import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childId, prompt, childName } = await req.json();

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get approved topics for context
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase config missing');
      return new Response(
        JSON.stringify({ error: 'Database service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.7');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: topics } = await supabase
      .from('child_topics')
      .select('topic')
      .eq('child_id', childId);

    const approvedTopics = topics?.map(t => t.topic) || [];

    // Get child's age for personalization
    const { data: childData } = await supabase
      .from('child_profiles')
      .select('age')
      .eq('id', childId)
      .single();

    const childAge = childData?.age || 8;

    // Age-based story guidance
    let ageGuidance = '';
    if (childAge >= 5 && childAge <= 7) {
      ageGuidance = 'Use very simple words and short sentences. Include lots of action and fun sounds. Keep paragraphs very short (2-3 sentences).';
    } else if (childAge >= 8 && childAge <= 10) {
      ageGuidance = 'Use moderate vocabulary with some descriptive language. Include dialogue and adventure. Paragraphs can be 3-4 sentences.';
    } else if (childAge >= 11 && childAge <= 12) {
      ageGuidance = 'Use richer vocabulary and more complex plots. Include character development and meaningful lessons. Paragraphs can be 4-5 sentences.';
    }

    // Create story prompt
    const systemPrompt = `You are a creative storyteller for children aged ${childAge}. Create an engaging, age-appropriate short story (300-500 words).

APPROVED TOPICS: ${approvedTopics.join(', ')}
CHILD'S NAME: ${childName}
CHILD'S AGE: ${childAge} years old

AGE-APPROPRIATE WRITING: ${ageGuidance}

RULES:
1. The story MUST relate to one or more approved topics: ${approvedTopics.join(', ')}
2. Include ${childName} as the main character or reference them in the story
3. Keep it appropriate and fun for a ${childAge}-year-old
4. Include a clear beginning, middle, and end
5. Use age-appropriate language and vivid descriptions
6. Include a positive message or lesson
7. Make it exciting and engaging
8. NO scary, violent, or inappropriate content
9. If the prompt asks for something not in approved topics, use the closest approved topic instead

Format your response as JSON:
{
  "title": "Story Title Here (include ${childName}'s name when possible)",
  "story": "The full story text here..."
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a story about: ${prompt}. Make it fun for ${childName}!` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many story requests! Please wait a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate story. Please try again!" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const storyData = JSON.parse(aiData.choices[0].message.content);

    return new Response(
      JSON.stringify(storyData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(
      JSON.stringify({ error: "Something went wrong! Please try again." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
