import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childId, theme, characters, mood, values, storyLength, childName, childAge } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get approved topics
    const { data: approvedTopics } = await supabase
      .from('child_topics')
      .select('topic')
      .eq('child_id', childId);

    const topicsList = approvedTopics?.map(t => t.topic).join(', ') || 'general topics';

    // Determine target word count
    const wordCounts: { [key: string]: number } = {
      short: 300,
      medium: 500,
      long: 800
    };
    const targetWordCount = wordCounts[storyLength] || 500;

    // Build character description
    const characterDesc = characters.map((c: any) => `${c.name} (${c.role})`).join(', ');

    const systemPrompt = `You are a bedtime storyteller for children aged ${childAge}.

CRITICAL SAFETY RULES:
- NO violence, scary content, nightmares, or monsters
- NO adult themes, politics, religion, or medical advice
- NO real-world dangers or risky behaviors
- USE only approved topics: ${topicsList}
- KEEP language age-appropriate (simple words for ages 5-7, richer for 8-12)
- INCLUDE positive lessons about ${values.join(', ')}
- MAKE ${childName} the hero or central character
- CREATE warm, cozy bedtime atmosphere
- END with reassuring, gentle conclusion

THEME: ${theme}
MOOD: ${mood}
CHARACTERS: ${characterDesc}
LENGTH: ${targetWordCount} words

Create a ${mood} story that teaches about ${values[0]} through ${theme}.

Return ONLY a JSON object with this structure:
{
  "title": "Story Title",
  "content": "Full story text...",
  "scenes": [
    {"scene": 1, "description": "Scene 1 description for illustration"},
    {"scene": 2, "description": "Scene 2 description for illustration"},
    {"scene": 3, "description": "Scene 3 description for illustration"}
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a bedtime story for ${childName} about ${theme}.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Parse JSON response
    let storyData;
    try {
      storyData = JSON.parse(generatedText);
    } catch (e) {
      // Fallback if response isn't proper JSON
      storyData = {
        title: `${childName}'s ${theme} Adventure`,
        content: generatedText,
        scenes: []
      };
    }

    return new Response(JSON.stringify(storyData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-enhanced-story:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
