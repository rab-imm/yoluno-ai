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

STORY STRUCTURE REQUIREMENTS:
- Write EXACTLY ${targetWordCount} words (±50 words acceptable)
- Use clear paragraph breaks (separate paragraphs with double newlines)
- Include dialogue with quotation marks
- Use descriptive, sensory language (sights, sounds, feelings)
- Vary sentence length (mix short and long sentences)
- Structure: Beginning (introduce setting/character) → Middle (adventure/challenge) → End (resolution/lesson)

THEME: ${theme}
MOOD: ${mood}
CHARACTERS: ${characterDesc}
TARGET WORD COUNT: ${targetWordCount} words

SCENE DESCRIPTIONS:
- Provide 3 detailed scene descriptions perfect for child-friendly illustrations
- Each scene should describe specific visual elements, characters, setting, and mood
- Make scenes colorful, magical, and age-appropriate

Return ONLY a JSON object with this exact structure:
{
  "title": "An engaging, descriptive title",
  "content": "Full story with proper paragraph breaks using \\n\\n between paragraphs...",
  "scenes": [
    {"scene": 1, "description": "Detailed visual description for illustration of opening scene"},
    {"scene": 2, "description": "Detailed visual description for illustration of middle scene"},
    {"scene": 3, "description": "Detailed visual description for illustration of ending scene"}
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
    
    console.log('AI Response received, length:', generatedText?.length || 0);
    
    // Parse JSON response
    let storyData;
    try {
      // Extract JSON if wrapped in markdown code blocks
      let jsonText = generatedText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
      }
      
      storyData = JSON.parse(jsonText);
      
      // Validate story structure
      if (!storyData.title || !storyData.content || !storyData.scenes) {
        throw new Error('Invalid story structure');
      }
      
      // Validate word count
      const wordCount = storyData.content.split(/\s+/).length;
      console.log('Story word count:', wordCount, 'Target:', targetWordCount);
      
      if (wordCount < targetWordCount * 0.7) {
        console.warn('Story too short:', wordCount, 'words (target:', targetWordCount, ')');
      }
      
      // Validate scenes
      if (storyData.scenes.length < 3) {
        console.warn('Missing scenes, expected 3, got:', storyData.scenes.length);
        // Add placeholder scenes if needed
        while (storyData.scenes.length < 3) {
          storyData.scenes.push({
            scene: storyData.scenes.length + 1,
            description: `Scene ${storyData.scenes.length + 1} from ${storyData.title}`
          });
        }
      }
      
      console.log('Story validation passed:', {
        title: storyData.title,
        wordCount,
        sceneCount: storyData.scenes.length
      });
      
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      console.error('Raw response:', generatedText.substring(0, 500));
      
      // Fallback if response isn't proper JSON
      storyData = {
        title: `${childName}'s ${theme} Adventure`,
        content: generatedText,
        scenes: [
          { scene: 1, description: `${childName} begins an adventure` },
          { scene: 2, description: `${childName} discovers something magical` },
          { scene: 3, description: `${childName} learns an important lesson` }
        ]
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
