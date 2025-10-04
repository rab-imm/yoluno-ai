import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenes, illustrationStyle, childAge } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const illustrations = [];

    // Style descriptions
    const stylePrompts: { [key: string]: string } = {
      cartoon: 'colorful cartoon style, friendly and playful, smooth lines',
      watercolor: 'soft watercolor painting style, gentle colors, dreamy atmosphere',
      storybook: 'classic children\'s book illustration, warm and inviting',
      minimalist: 'simple minimalist design, clean shapes, modern aesthetic'
    };

    const styleDesc = stylePrompts[illustrationStyle] || stylePrompts.cartoon;

    for (const scene of scenes) {
      const prompt = `Create a child-friendly ${styleDesc} illustration: ${scene.description}. Safe for children aged ${childAge}, warm and comforting, no scary elements. Ultra high resolution, ${illustrationStyle} art style.`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        console.error(`Illustration generation failed for scene ${scene.scene}`);
        continue;
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageUrl) {
        illustrations.push({
          scene: scene.scene,
          imageUrl: imageUrl,
          description: scene.description
        });
      }
    }

    return new Response(JSON.stringify({ illustrations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-story-illustrations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
