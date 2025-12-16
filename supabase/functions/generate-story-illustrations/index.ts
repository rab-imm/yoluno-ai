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

    console.log('Starting illustration generation for', scenes?.length || 0, 'scenes');
    console.log('Style:', illustrationStyle, 'Age:', childAge);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const illustrations = [];

    // Style descriptions
    const stylePrompts: { [key: string]: string } = {
      cartoon: 'colorful cartoon style, friendly and playful, smooth lines, bright colors',
      watercolor: 'soft watercolor painting style, gentle colors, dreamy atmosphere, pastel tones',
      storybook: 'classic children\'s book illustration, warm and inviting, detailed and whimsical',
      minimalist: 'simple minimalist design, clean shapes, modern aesthetic, gentle colors'
    };

    const styleDesc = stylePrompts[illustrationStyle] || stylePrompts.cartoon;

    for (const scene of scenes) {
      console.log(`Generating illustration ${scene.scene} of ${scenes.length}...`);
      
      const prompt = `Create a child-friendly ${styleDesc} illustration for a bedtime story: ${scene.description}. 
      
REQUIREMENTS:
- Safe and appropriate for children aged ${childAge}
- Warm, comforting, magical atmosphere
- NO scary elements, monsters, or dark themes
- Bright, cheerful colors
- Clear, simple composition perfect for children
- ${illustrationStyle} art style with high quality details
- Ultra high resolution, professional children's book quality`;

      try {
        // Set timeout for each illustration
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Illustration ${scene.scene} failed with status ${response.status}:`, errorText);
          
          // Add placeholder illustration on failure
          illustrations.push({
            scene: scene.scene,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbGx1c3RyYXRpb24gQ29taW5nIFNvb248L3RleHQ+PC9zdmc+',
            description: scene.description,
            error: true
          });
          continue;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
          console.log(`Illustration ${scene.scene} generated successfully`);
          illustrations.push({
            scene: scene.scene,
            imageUrl: imageUrl,
            description: scene.description
          });
        } else {
          console.error(`No image URL in response for scene ${scene.scene}`);
          console.error('Response data:', JSON.stringify(data, null, 2));
          
          // Add placeholder
          illustrations.push({
            scene: scene.scene,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbGx1c3RyYXRpb24gVW5hdmFpbGFibGU8L3RleHQ+PC9zdmc+',
            description: scene.description,
            error: true
          });
        }
      } catch (err: any) {
        console.error(`Error generating illustration ${scene.scene}:`, err.message);
        
        // Add placeholder on error
        illustrations.push({
          scene: scene.scene,
          imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbGx1c3RyYXRpb24gRXJyb3I8L3RleHQ+PC9zdmc+',
          description: scene.description,
          error: true
        });
      }
    }

    console.log(`Illustration generation complete: ${illustrations.length} illustrations created`);
    
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
