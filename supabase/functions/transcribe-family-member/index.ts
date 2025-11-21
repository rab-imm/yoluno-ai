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
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing audio for family member extraction...');

    // Step 1: Transcribe audio with OpenAI Whisper
    const binaryString = atob(audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('OpenAI transcription error:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcription = transcriptionResult.text;

    console.log('Transcription:', transcription);

    // Step 2: Extract structured data using OpenAI GPT-5-mini with tool calling
    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts structured family member information from natural speech transcriptions. Extract as much information as possible, but at minimum you must extract the name.'
          },
          {
            role: 'user',
            content: `Extract family member information from this transcription:\n\n${transcription}\n\nExtract: name (required), relationship type, specific label (like Dad/Mom/Grandma), birth date (convert to YYYY-MM-DD format if mentioned), location (City, Country format), and a concise 2-3 sentence bio summarizing key memories or details mentioned.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_family_member",
              description: "Extract structured family member information from transcription",
              parameters: {
                type: "object",
                properties: {
                  name: { 
                    type: "string", 
                    description: "Full name of the family member" 
                  },
                  relationship: { 
                    type: "string",
                    enum: ["parent", "child", "spouse", "sibling", "grandparent", "grandchild", "aunt_uncle", "niece_nephew", "cousin", "other"],
                    description: "Relationship type to the user"
                  },
                  specific_label: { 
                    type: "string", 
                    description: "Specific label like Dad, Mom, Grandma, Uncle John, etc." 
                  },
                  birth_date: { 
                    type: "string", 
                    description: "Birth date in YYYY-MM-DD format. If only year mentioned, use YYYY-01-01. If approximate (like 'in the 80s'), use best guess." 
                  },
                  location: { 
                    type: "string", 
                    description: "Location in 'City, Country' format or just city/country if only one mentioned" 
                  },
                  bio: { 
                    type: "string", 
                    description: "2-3 sentence biography summarizing key memories, personality traits, or details mentioned" 
                  }
                },
                required: ["name"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { 
          type: "function", 
          function: { name: "extract_family_member" } 
        }
      }),
    });

    if (!extractionResponse.ok) {
      const errorText = await extractionResponse.text();
      console.error('Lovable AI extraction error:', errorText);
      throw new Error(`Extraction failed: ${errorText}`);
    }

    const extractionResult = await extractionResponse.json();
    console.log('Extraction result:', JSON.stringify(extractionResult, null, 2));

    // Parse the tool call result
    const toolCall = extractionResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error('No extraction result from AI');
    }

    const extractedFields = JSON.parse(toolCall.function.arguments);
    
    console.log('Extracted fields:', extractedFields);

    return new Response(
      JSON.stringify({ 
        transcription,
        extractedFields 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in transcribe-family-member:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
