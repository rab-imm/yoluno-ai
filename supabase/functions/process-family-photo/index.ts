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
    const { imageBase64, fileName, parentId } = await req.json();

    if (!imageBase64 || !fileName || !parentId) {
      throw new Error('Missing required fields: imageBase64, fileName, parentId');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Decode base64 and get file size
    const imageData = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    const fileSizeBytes = imageData.length;

    console.log(`Processing photo, size: ${fileSizeBytes} bytes`);

    // Check storage quota
    const { data: quotaCheck, error: quotaError } = await supabase
      .rpc('check_storage_quota', { 
        p_parent_id: parentId, 
        p_file_size_bytes: fileSizeBytes 
      });

    if (quotaError) {
      console.error('Quota check error:', quotaError);
      throw new Error('Failed to check storage quota');
    }

    if (!quotaCheck) {
      return new Response(
        JSON.stringify({ error: 'Storage quota exceeded. Please upgrade your plan.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload to storage
    const filePath = `${parentId}/${Date.now()}_${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('family_photos')
      .upload(filePath, imageData, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload photo');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('family_photos')
      .getPublicUrl(filePath);

    console.log('Photo uploaded, generating caption...');

    // Generate AI caption using Gemini 2.5 Flash
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: [
              {
                type: 'text',
                text: 'Describe this family photo in a warm, detailed way suitable for a child to understand. Focus on people, setting, and mood. Keep it to 2-3 sentences.'
              },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
              }
            ]
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      console.error('AI caption error:', await aiResponse.text());
      throw new Error('Failed to generate caption');
    }

    const aiData = await aiResponse.json();
    const aiCaption = aiData.choices[0].message.content;

    console.log('Caption generated, saving to database...');

    // Save to database
    const { data: photo, error: dbError } = await supabase
      .from('family_photos')
      .insert({
        parent_id: parentId,
        image_url: publicUrl,
        ai_caption: aiCaption,
        file_size_bytes: fileSizeBytes
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save photo to database');
    }

    // Update storage usage
    const fileSizeMB = fileSizeBytes / 1024 / 1024;
    const { error: updateError } = await supabase
      .from('parent_subscriptions')
      .update({
        storage_used_mb: supabase.rpc('increment', { value: fileSizeMB })
      })
      .eq('parent_id', parentId)
      .eq('status', 'active');
    
    if (updateError) {
      console.error('Failed to update storage usage:', updateError);
    }

    console.log('Photo processing complete');

    return new Response(
      JSON.stringify({
        photo,
        message: 'Photo processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-family-photo:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
