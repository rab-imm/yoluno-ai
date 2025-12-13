/**
 * Story Generation Edge Function
 *
 * Generates personalized stories using AI based on child preferences.
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

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  interests: string[] | null;
  personality_mode: string | null;
}

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

    // Build prompt
    const systemPrompt = `You are a children's story writer creating age-appropriate, engaging stories.
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

    const userPrompt = `Create a ${mood} story for ${childProfile.name}, age ${childProfile.age}.

Theme: ${theme}
${characters.length > 0 ? `Characters: ${characters.join(', ')}` : ''}
${values.length > 0 ? `Values to incorporate: ${values.join(', ')}` : ''}
${childProfile.interests?.length ? `Child's interests: ${childProfile.interests.join(', ')}` : ''}
${familyContext}

Please write an engaging story with a clear beginning, middle, and end. Include a gentle moral lesson.

Respond in JSON format:
{
  "title": "Story title",
  "content": "Full story text",
  "moral": "The lesson of the story",
  "wordCount": number
}`;

    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenRouter API
    console.log('generate-story: Calling OpenRouter API');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoluno.app',
        'X-Title': 'Yoluno Story Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });
    console.log('generate-story: OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to generate story',
          details: `OpenRouter returned ${response.status}: ${errorText.substring(0, 500)}`
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No story content generated from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON response
    let storyData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      storyData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      if (!storyData) throw new Error('No JSON found');
    } catch {
      storyData = {
        title: `${theme} Adventure`,
        content: content,
        moral: '',
        wordCount: content.split(/\s+/).length,
      };
    }

    // Save story to database
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
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving story:', saveError);
      // Still return the story even if save failed, but include warning
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
