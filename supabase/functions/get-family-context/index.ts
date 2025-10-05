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
    const { childId, query } = await req.json();

    if (!childId || !query) {
      throw new Error('Missing required fields: childId, query');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Getting family context for child ${childId}...`);

    // Check if family history is enabled for this child
    const { data: access, error: accessError } = await supabase
      .from('family_history_access')
      .select('is_enabled, age_restriction, parent_id')
      .eq('child_id', childId)
      .single();

    if (accessError || !access || !access.is_enabled) {
      console.log('Family history not enabled for this child');
      return new Response(
        JSON.stringify({ hasAccess: false, context: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parentId = access.parent_id;
    const ageRestriction = access.age_restriction;

    // Get child's age for filtering
    const { data: child } = await supabase
      .from('child_profiles')
      .select('age')
      .eq('id', childId)
      .single();

    const childAge = child?.age || 5;

    console.log(`Child age: ${childAge}, Age restriction: ${ageRestriction}`);

    // Search query (lowercase for case-insensitive search)
    const searchQuery = query.toLowerCase();

    // Search family members
    const { data: members } = await supabase
      .from('family_members')
      .select('*')
      .eq('parent_id', parentId)
      .or(`name.ilike.%${searchQuery}%,relationship.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
      .limit(5);

    // Search stories with age filtering
    let storiesQuery = supabase
      .from('family_stories')
      .select('*')
      .eq('parent_id', parentId)
      .or(`title.ilike.%${searchQuery}%,ai_summary.ilike.%${searchQuery}%,keywords.cs.{${searchQuery}}`)
      .limit(5);

    // Apply age filtering
    if (ageRestriction === 'age_8_plus' && childAge < 8) {
      storiesQuery = storiesQuery.eq('is_age_sensitive', false);
    } else if (ageRestriction === 'age_12_plus' && childAge < 12) {
      storiesQuery = storiesQuery.eq('is_age_sensitive', false);
    }

    const { data: stories } = await storiesQuery;

    // Search photos
    const { data: photos } = await supabase
      .from('family_photos')
      .select('*')
      .eq('parent_id', parentId)
      .or(`ai_caption.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(5);

    console.log(`Found ${members?.length || 0} members, ${stories?.length || 0} stories, ${photos?.length || 0} photos`);

    // Build context object
    const context = {
      members: members || [],
      stories: stories || [],
      photos: photos || []
    };

    return new Response(
      JSON.stringify({
        hasAccess: true,
        context,
        ageRestriction,
        childAge
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-family-context:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
