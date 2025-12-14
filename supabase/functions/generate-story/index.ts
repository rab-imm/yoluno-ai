/**
 * Story Generation Edge Function
 *
 * Generates personalized stories with illustrations using Google Gemini via OpenRouter.
 *
 * Models:
 * - Story Text: google/gemini-2.5-flash (fast, reliable)
 * - Illustrations: google/gemini-3-pro-image-preview (image generation)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StoryRequest {
  childProfileId: string;
  theme: string;
  characters?: string[];
  mood?: string;
  values?: string[];
  storyLength?: 'short' | 'medium' | 'long';
  includeFamily?: boolean;
}

// AI Model Configuration
const AI_MODELS = {
  storyGeneration: 'google/gemini-2.5-flash',
  imageGeneration: 'google/gemini-2.5-flash-image',
};

serve(async (req) => {
  // Always handle CORS first
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('generate-story: Starting request');

    // Debug: Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY');

    console.log('generate-story: ENV check', {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      hasServiceKey: !!supabaseServiceKey,
      hasOpenRouterKey: !!openrouterKey,
    });

    // User client for auth verification
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Service role client for database operations (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify authentication
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      childProfileId,
      theme,
      characters = [],
      mood = 'adventurous',
      values = [],
      storyLength = 'medium',
      includeFamily = false,
    }: StoryRequest = await req.json();

    if (!childProfileId || !theme) {
      return new Response(
        JSON.stringify({ error: 'childProfileId and theme are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get child profile
    const { data: childProfile, error: profileError } = await supabase
      .from('child_profiles')
      .select('id, name, age, interests, personality_mode')
      .eq('id', childProfileId)
      .single();

    if (profileError || !childProfile) {
      return new Response(
        JSON.stringify({ error: 'Child profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get family context if requested
    let familyContext = '';
    if (includeFamily) {
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('name, relationship_type')
        .eq('user_id', user.id)
        .limit(5);

      if (familyMembers && familyMembers.length > 0) {
        familyContext = `Family members to potentially include: ${familyMembers
          .map((m) => `${m.name} (${m.relationship_type})`)
          .join(', ')}.`;
      }
    }

    // Determine word count based on age and story length
    const wordCounts = {
      short: { min: 150, max: 250 },
      medium: { min: 300, max: 500 },
      long: { min: 500, max: 800 },
    };

    const ageAdjustedLength = childProfile.age <= 7 ? 'short' : storyLength;
    const targetWords = wordCounts[ageAdjustedLength];

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========== STEP 1: Generate Story Text ==========
    const storySystemPrompt = `You are a children's story writer creating age-appropriate, engaging stories.

Write stories that are:
- Safe and appropriate for children aged ${childProfile.age}
- Educational and values-driven
- Imaginative and fun
- Using vocabulary suitable for the child's age
- Between ${targetWords.min}-${targetWords.max} words

Never include:
- Violence or scary content
- Inappropriate themes
- Complex vocabulary beyond the child's age level`;

    const storyUserPrompt = `Create a ${mood} story for ${childProfile.name}, age ${childProfile.age}.

Theme: ${theme}
${characters.length > 0 ? `Characters: ${characters.join(', ')}` : ''}
${values.length > 0 ? `Values to incorporate: ${values.join(', ')}` : ''}
${childProfile.interests?.length ? `Child's interests: ${childProfile.interests.join(', ')}` : ''}
${familyContext}

Please write an engaging story with a clear beginning, middle, and end. Include a gentle moral lesson.

Respond in JSON format:
{
  "title": "Story title",
  "content": "Full story text with paragraphs separated by newlines",
  "moral": "The lesson of the story",
  "wordCount": number,
  "illustrationPrompt": "A detailed prompt for generating a child-friendly illustration for this story (describe the main scene, characters, setting, and mood)"
}`;

    console.log('generate-story: Generating story text with model:', AI_MODELS.storyGeneration);
    const storyResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoluno.app',
        'X-Title': 'Yoluno Story Generator',
      },
      body: JSON.stringify({
        model: AI_MODELS.storyGeneration,
        messages: [
          { role: 'system', content: storySystemPrompt },
          { role: 'user', content: storyUserPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      console.error('OpenRouter story error:', storyResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to generate story',
          details: `OpenRouter returned ${storyResponse.status}: ${errorText.substring(0, 500)}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storyAiResponse = await storyResponse.json();
    const storyTextContent = storyAiResponse.choices?.[0]?.message?.content;

    if (!storyTextContent) {
      return new Response(
        JSON.stringify({ error: 'No story content generated from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse story JSON
    let storyData;
    try {
      const jsonMatch = storyTextContent.match(/\{[\s\S]*\}/);
      storyData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      if (!storyData) throw new Error('No JSON found');
    } catch {
      storyData = {
        title: `${theme} Adventure`,
        content: storyTextContent,
        moral: '',
        wordCount: storyTextContent.split(/\s+/).length,
        illustrationPrompt: `A colorful, child-friendly illustration of a ${mood} ${theme} story for a ${childProfile.age} year old child.`,
      };
    }

    console.log('generate-story: Story text generated:', storyData.title);

    // ========== STEP 2: Generate Illustration ==========
    let illustrationUrl: string | null = null;

    try {
      const illustrationPrompt = storyData.illustrationPrompt ||
        `A colorful, whimsical children's book illustration for a story titled "${storyData.title}" about ${theme}. Style: warm, friendly, suitable for children aged ${childProfile.age}. The scene should be cheerful and inviting.`;

      console.log('generate-story: Generating illustration with model:', AI_MODELS.imageGeneration);

      const imageResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yoluno.app',
          'X-Title': 'Yoluno Story Illustrator',
        },
        body: JSON.stringify({
          model: AI_MODELS.imageGeneration,
          messages: [
            {
              role: 'user',
              content: `Generate a beautiful, child-friendly illustration image for a children's story.

${illustrationPrompt}

Important:
- Make it colorful and appealing to children
- Use a warm, friendly art style like a children's book illustration
- No text in the image
- Safe and appropriate for young children
- Single cohesive scene

Please generate the image.`,
            },
          ],
          max_tokens: 4096,
        }),
      });

      if (imageResponse.ok) {
        const imageAiResponse = await imageResponse.json();
        console.log('generate-story: Image response received');

        // Check for base64 image in various possible locations
        const message = imageAiResponse.choices?.[0]?.message;
        let base64Image: string | null = null;

        console.log('generate-story: Parsing image response, message keys:', message ? Object.keys(message) : 'no message');

        // Check images array first (format from gemini-2.5-flash-image)
        // Format: images: [{ type: "image_url", image_url: { url: "data:image/png;base64,..." } }]
        if (message?.images && Array.isArray(message.images)) {
          for (const img of message.images) {
            if (img.type === 'image_url' && img.image_url?.url) {
              const url = img.image_url.url;
              if (url.startsWith('data:image')) {
                base64Image = url.split(',')[1];
                console.log('generate-story: Found image in images array (image_url format)');
                break;
              }
            }
            // Also check for direct base64 in images array
            if (typeof img === 'string' && img.length > 100) {
              base64Image = img;
              console.log('generate-story: Found direct base64 in images array');
              break;
            }
          }
        }

        // Check content array for image parts
        if (!base64Image && message?.content && Array.isArray(message.content)) {
          for (const part of message.content) {
            if (part.type === 'image' && part.image) {
              base64Image = part.image;
              console.log('generate-story: Found image in content array (image type)');
              break;
            }
            if (part.type === 'image_url' && part.image_url?.url) {
              const url = part.image_url.url;
              if (url.startsWith('data:image')) {
                base64Image = url.split(',')[1];
                console.log('generate-story: Found image in content array (image_url type)');
              }
              break;
            }
          }
        }

        // Check direct properties
        if (!base64Image && message?.image) {
          base64Image = message.image;
          console.log('generate-story: Found image in direct image property');
        }

        // Check if content itself is base64
        if (!base64Image && message?.content && typeof message.content === 'string') {
          // Check if it's a data URL
          if (message.content.startsWith('data:image')) {
            base64Image = message.content.split(',')[1];
            console.log('generate-story: Found image as data URL in content string');
          }
          // Check if it looks like raw base64 (starts with common PNG/JPEG signatures)
          else if (message.content.match(/^[A-Za-z0-9+/=]{100,}$/)) {
            base64Image = message.content;
            console.log('generate-story: Found raw base64 in content string');
          }
        }

        if (base64Image) {
          console.log('generate-story: Found base64 image, uploading to storage');

          // Remove data URL prefix if present
          const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

          // Convert base64 to Uint8Array
          const binaryString = atob(cleanBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const fileName = `stories/${childProfileId}/${Date.now()}.png`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('story-illustrations')
            .upload(fileName, bytes, {
              contentType: 'image/png',
              upsert: false,
            });

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('story-illustrations')
              .getPublicUrl(fileName);
            illustrationUrl = urlData?.publicUrl || null;
            console.log('generate-story: Illustration uploaded:', illustrationUrl);
          } else {
            console.error('generate-story: Failed to upload illustration:', uploadError);
          }
        } else {
          console.log('generate-story: No base64 image found in response');
          // Log the response structure for debugging
          console.log('generate-story: Response structure:', JSON.stringify({
            hasMessage: !!message,
            contentType: typeof message?.content,
            isArray: Array.isArray(message?.content),
            hasImage: !!message?.image,
            hasImages: !!message?.images,
          }));
        }
      } else {
        const errorText = await imageResponse.text();
        console.error('generate-story: Image generation failed:', imageResponse.status, errorText);
      }
    } catch (imageError) {
      console.error('generate-story: Error generating illustration:', imageError);
      // Continue without illustration - don't fail the whole request
    }

    // ========== STEP 3: Save Story to Database ==========
    console.log('generate-story: Saving story to database');
    const { data: savedStory, error: saveError } = await supabase
      .from('stories')
      .insert({
        child_profile_id: childProfileId,
        title: storyData.title,
        content: storyData.content,
        theme: theme,
        mood: mood,
        values: values,
        word_count: storyData.wordCount,
        illustration_url: illustrationUrl,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving story:', saveError);
      return new Response(
        JSON.stringify({
          story: {
            id: null,
            title: storyData.title,
            content: storyData.content,
            moral: storyData.moral,
            wordCount: storyData.wordCount,
            theme,
            mood,
            illustrationUrl,
          },
          warning: 'Story generated but failed to save to database',
          saveError: saveError.message,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('generate-story: Story saved successfully with id:', savedStory?.id);

    return new Response(
      JSON.stringify({
        story: {
          id: savedStory?.id,
          title: storyData.title,
          content: storyData.content,
          moral: storyData.moral,
          wordCount: storyData.wordCount,
          theme,
          mood,
          illustrationUrl,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Story generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
