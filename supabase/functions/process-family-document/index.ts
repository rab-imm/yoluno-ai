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
    const { documentBase64, fileName, parentId, title, fileType } = await req.json();

    if (!documentBase64 || !fileName || !parentId || !title) {
      throw new Error('Missing required fields');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Decode and get file size
    const documentData = Uint8Array.from(atob(documentBase64), c => c.charCodeAt(0));
    const fileSizeBytes = documentData.length;

    console.log(`Processing document, size: ${fileSizeBytes} bytes, type: ${fileType}`);

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
    const contentType = fileType || 'application/octet-stream';

    console.log('Uploading document...');

    const { error: uploadError } = await supabase.storage
      .from('family_documents')
      .upload(filePath, documentData, {
        contentType,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload document');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('family_documents')
      .getPublicUrl(filePath);

    console.log('Extracting text from document...');

    let extractedText = '';

    // For image files, use Gemini vision for OCR
    if (fileType?.startsWith('image/')) {
      const ocrResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                  text: 'Extract all text from this document image. Format it clearly and preserve the structure.'
                },
                {
                  type: 'image_url',
                  image_url: { url: `data:${contentType};base64,${documentBase64}` }
                }
              ]
            }
          ]
        })
      });

      if (ocrResponse.ok) {
        const ocrData = await ocrResponse.json();
        extractedText = ocrData.choices[0].message.content;
      }
    } else {
      // For PDFs and other docs, we'd need a PDF parsing library
      // For now, just note that it's uploaded
      extractedText = `[Document uploaded: ${fileName}]`;
    }

    console.log('Generating summary...');

    // Generate AI summary
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
            content: `Summarize this family document in 2-3 sentences. Make it engaging and suitable for a child to discover through conversation. Also extract 5-10 keywords (names, places, events) separated by commas.\n\nDocument:\n${extractedText}\n\nProvide response in format:\nSUMMARY: [summary]\nKEYWORDS: [keyword1, keyword2, ...]`
          }
        ]
      })
    });

    let aiSummary = 'Family document';
    let keywords: string[] = [];

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      const responseText = summaryData.choices[0].message.content;
      
      const summaryMatch = responseText.match(/SUMMARY:\s*(.+?)(?=KEYWORDS:|$)/s);
      const keywordsMatch = responseText.match(/KEYWORDS:\s*(.+?)$/s);
      
      aiSummary = summaryMatch ? summaryMatch[1].trim() : responseText.slice(0, 200);
      keywords = keywordsMatch 
        ? keywordsMatch[1].split(',').map((k: string) => k.trim())
        : [];
    }

    console.log('Saving to database...');

    // Save to database
    const { data: story, error: dbError } = await supabase
      .from('family_stories')
      .insert({
        parent_id: parentId,
        title,
        story_type: 'document',
        content: extractedText,
        file_url: publicUrl,
        ai_summary: aiSummary,
        keywords
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save document to database');
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

    console.log('Document processing complete');

    return new Response(
      JSON.stringify({
        story,
        extractedText,
        summary: aiSummary,
        keywords,
        message: 'Document processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-family-document:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
