import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('generate-story-narration function invoked at:', new Date().toISOString());
  console.log('Request method:', req.method);

  try {
    const { storyText, voice } = await req.json();
    
    console.log('Generating narration for text length:', storyText?.length || 0);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Validate voice is one of the supported child-friendly voices
    const supportedVoices = ['alloy', 'nova', 'shimmer'];
    const selectedVoice = supportedVoices.includes(voice) ? voice : 'alloy';

    console.log('Using voice:', selectedVoice);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: storyText,
        voice: selectedVoice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    // Get audio data and encode to base64 using Deno standard library
    const arrayBuffer = await response.arrayBuffer();
    
    console.log('Audio size in bytes:', arrayBuffer.byteLength);
    
    // Use Deno's built-in base64 encoding (handles large files properly)
    const base64Audio = encodeBase64(arrayBuffer);
    
    console.log('Base64 encoded length:', base64Audio.length);

    // Calculate estimated duration (rough estimate: ~150 words per minute)
    const wordCount = storyText.split(/\s+/).length;
    const estimatedDuration = Math.ceil((wordCount / 150) * 60);

    console.log('Estimated duration:', estimatedDuration, 'seconds');

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        duration: estimatedDuration
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error: any) {
    console.error('Error in generate-story-narration:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate narration' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
