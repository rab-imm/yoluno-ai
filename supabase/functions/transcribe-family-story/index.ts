import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioBase64, fileName, parentId, title, durationMinutes } = await req.json();

    if (!audioBase64 || !fileName || !parentId || !title || !durationMinutes) {
      throw new Error('Missing required fields');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Checking transcription quota for ${durationMinutes} minutes...`);

    // Check transcription quota
    const { data: quotaCheck, error: quotaError } = await supabase
      .rpc('check_transcription_quota', {
        p_parent_id: parentId,
        p_duration_minutes: durationMinutes
      });

    if (quotaError) {
      console.error('Quota check error:', quotaError);
      throw new Error('Failed to check transcription quota');
    }

    if (!quotaCheck) {
      return new Response(
        JSON.stringify({ error: 'Transcription quota exceeded. Please upgrade your plan or wait for next billing cycle.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode and upload audio
    const audioData = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const fileSizeBytes = audioData.length;
    const filePath = `${parentId}/${Date.now()}_${fileName}`;

    console.log('Uploading audio file...');

    const { error: uploadError } = await supabase.storage
      .from('family_audio')
      .upload(filePath, audioData, {
        contentType: 'audio/webm',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload audio');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('family_audio')
      .getPublicUrl(filePath);

    console.log('Transcribing audio with Whisper...');

    // Transcribe with OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([audioData], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Transcription error:', errorText);
      throw new Error('Failed to transcribe audio');
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text;

    console.log('Generating AI summary...');

    // Generate summary and keywords with Gemini
    const summaryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: `Summarize this family story in 2-3 sentences. Make it engaging and suitable for a child to discover through conversation. Also extract 5-10 keywords (names, places, events) separated by commas.\n\nStory:\n${transcription}\n\nProvide response in format:\nSUMMARY: [summary]\nKEYWORDS: [keyword1, keyword2, ...]`
          }
        ]
      })
    });

    if (!summaryResponse.ok) {
      console.error('Summary error:', await summaryResponse.text());
      throw new Error('Failed to generate summary');
    }

    const summaryData = await summaryResponse.json();
    const responseText = summaryData.choices[0].message.content;
    
    const summaryMatch = responseText.match(/SUMMARY:\s*(.+?)(?=KEYWORDS:|$)/s);
    const keywordsMatch = responseText.match(/KEYWORDS:\s*(.+?)$/s);
    
    const aiSummary = summaryMatch ? summaryMatch[1].trim() : responseText.slice(0, 200);
    const keywords = keywordsMatch 
      ? keywordsMatch[1].split(',').map((k: string) => k.trim())
      : [];

    console.log('Saving to database...');

    // Save to database
    const { data: story, error: dbError } = await supabase
      .from('family_stories')
      .insert({
        parent_id: parentId,
        title,
        story_type: 'audio',
        content: transcription,
        file_url: publicUrl,
        ai_summary: aiSummary,
        keywords
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save story to database');
    }

    // Update usage
    const fileSizeMB = fileSizeBytes / 1024 / 1024;
    const { error: updateError } = await supabase
      .from('parent_subscriptions')
      .update({
        storage_used_mb: supabase.rpc('increment', { value: fileSizeMB }),
        transcription_used_minutes: supabase.rpc('increment', { value: durationMinutes })
      })
      .eq('parent_id', parentId)
      .eq('status', 'active');

    if (updateError) {
      console.error('Failed to update usage:', updateError);
    }

    console.log('Story processing complete');

    return new Response(
      JSON.stringify({
        story,
        transcription,
        summary: aiSummary,
        keywords,
        message: 'Story transcribed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-family-story:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
