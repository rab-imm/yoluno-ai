import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childQuestion, childAge, childId, approvedTopics } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Matching content for question: "${childQuestion}", age: ${childAge}, topics: ${approvedTopics.join(', ')}`);

    // Determine age range
    const ageRange = childAge <= 7 ? '5-7' : childAge <= 10 ? '8-10' : '11-12';

    // Step 1: Extract keywords from the question using simple text processing
    const keywords = extractKeywords(childQuestion);
    console.log(`Extracted keywords: ${keywords.join(', ')}`);

    // Step 2: Find matching pre-written content from topic_content
    const { data: contentMatches, error: contentError } = await supabase
      .from('topic_content')
      .select('*')
      .in('topic', approvedTopics)
      .eq('age_range', ageRange)
      .eq('is_reviewed', true)
      .limit(10);

    if (contentError) {
      console.error('Error fetching content:', contentError);
      return new Response(
        JSON.stringify({ matched: false, reason: 'database_error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${contentMatches?.length || 0} potential matches`);

    // Step 3: Rank matches by relevance
    const rankedMatches = rankByRelevance(contentMatches || [], childQuestion, keywords);

    if (rankedMatches.length === 0) {
      console.log('No matches found');
      return new Response(
        JSON.stringify({ matched: false, reason: 'no_content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const bestMatch = rankedMatches[0];
    console.log(`Best match: "${bestMatch.question}" (score: ${bestMatch.score})`);

    // Step 4: Check if parent approved this content
    const { data: parentProfile } = await supabase
      .from('child_profiles')
      .select('parent_id')
      .eq('id', childId)
      .single();

    if (!parentProfile) {
      console.error('Child profile not found');
      return new Response(
        JSON.stringify({ matched: false, reason: 'child_not_found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if this specific content is approved
    const { data: approval } = await supabase
      .from('parent_approved_content')
      .select('*')
      .eq('parent_id', parentProfile.parent_id)
      .eq('content_id', bestMatch.id)
      .or(`child_id.eq.${childId},child_id.is.null`)
      .single();

    if (approval) {
      console.log('Content is approved, returning pre-written answer');
      return new Response(
        JSON.stringify({
          matched: true,
          approved: true,
          content: bestMatch,
          answer: bestMatch.answer
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Content exists but not approved - check custom content
    const { data: customContent } = await supabase
      .from('custom_content')
      .select('*')
      .eq('parent_id', parentProfile.parent_id)
      .eq('topic', bestMatch.topic)
      .eq('age_range', ageRange)
      .or(`child_id.eq.${childId},child_id.is.null`);

    if (customContent && customContent.length > 0) {
      const customMatch = rankByRelevance(customContent, childQuestion, keywords)[0];
      if (customMatch && customMatch.score > 0.3) {
        console.log('Using custom parent content');
        return new Response(
          JSON.stringify({
            matched: true,
            approved: true,
            isCustom: true,
            content: customMatch,
            answer: customMatch.answer
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Content found but not approved');
    return new Response(
      JSON.stringify({
        matched: true,
        approved: false,
        content: bestMatch,
        parentId: parentProfile.parent_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in match-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful keywords
  const stopWords = new Set(['is', 'the', 'a', 'an', 'what', 'why', 'how', 'do', 'does', 'are', 'can', 'will', 'would', 'could', 'should']);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

function rankByRelevance(contents: any[], question: string, keywords: string[]): any[] {
  const questionLower = question.toLowerCase();
  
  return contents.map(content => {
    let score = 0;
    const contentQuestionLower = content.question.toLowerCase();
    const contentKeywords = content.keywords || [];

    // Exact question match
    if (contentQuestionLower === questionLower) {
      score += 10;
    }

    // Partial question match
    const questionWords = questionLower.split(/\s+/);
    const matchingWords = questionWords.filter(word => contentQuestionLower.includes(word));
    score += (matchingWords.length / questionWords.length) * 5;

    // Keyword overlap
    const keywordMatches = keywords.filter(keyword => 
      contentKeywords.some((ck: string) => ck.toLowerCase().includes(keyword) || keyword.includes(ck.toLowerCase()))
    );
    score += keywordMatches.length * 2;

    // Answer relevance (keywords in answer)
    const answerLower = content.answer.toLowerCase();
    const answerMatches = keywords.filter(keyword => answerLower.includes(keyword));
    score += answerMatches.length * 0.5;

    return { ...content, score };
  })
  .filter(content => content.score > 0)
  .sort((a, b) => b.score - a.score);
}
