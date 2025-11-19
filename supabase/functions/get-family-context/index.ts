import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to build relationship path explanations
function buildRelationshipPath(
  memberId: string,
  relationships: any[],
  members: any[],
  childId: string
): string {
  // Simple relationship explanation based on stored relationship field
  const member = members.find(m => m.id === memberId);
  if (!member || !member.relationship) return '';

  const rel = member.relationship.toLowerCase();
  
  // Map common relationships to child-friendly explanations
  if (rel.includes('grandm')) return "your parent's mother (your grandmother)";
  if (rel.includes('grandf')) return "your parent's father (your grandfather)";
  if (rel.includes('aunt')) return "your parent's sister (your aunt)";
  if (rel.includes('uncle')) return "your parent's brother (your uncle)";
  if (rel.includes('cousin')) return "your aunt or uncle's child (your cousin)";
  if (rel.includes('sibling') || rel.includes('brother') || rel.includes('sister')) {
    return "your parent's sibling";
  }
  if (rel.includes('great-grand')) return "your grandparent's parent (your great-grandparent)";
  
  return `your ${rel}`;
}

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

    // Get child's age and parent info for filtering
    const { data: child } = await supabase
      .from('child_profiles')
      .select('age, parent_id')
      .eq('id', childId)
      .single();

    const childAge = child?.age || 5;

    console.log(`Child age: ${childAge}, Age restriction: ${ageRestriction}`);

    // Search query (lowercase for case-insensitive search)
    const searchQuery = query.toLowerCase();

    // Extract relationship keywords from the query
    function extractFamilyKeywords(q: string): string[] {
      const keywords: string[] = [];
      
      // Direct relationship mentions
      if (q.match(/\b(dad|father|papa|daddy)\b/)) keywords.push('parent', 'father');
      if (q.match(/\b(mom|mother|mama|mommy)\b/)) keywords.push('parent', 'mother');
      if (q.match(/\b(parents?)\b/)) keywords.push('parent');
      if (q.match(/\b(grandm|grandmother|nana|granny)\b/)) keywords.push('grandmother', 'grandparent');
      if (q.match(/\b(grandf|grandfather|grandpa|gramps)\b/)) keywords.push('grandfather', 'grandparent');
      if (q.match(/\b(uncle)\b/)) keywords.push('uncle');
      if (q.match(/\b(aunt|auntie)\b/)) keywords.push('aunt');
      if (q.match(/\b(sibling|brother|sister)\b/)) keywords.push('sibling', 'brother', 'sister');
      if (q.match(/\b(cousin)\b/)) keywords.push('cousin');
      
      return keywords;
    }

    const extractedKeywords = extractFamilyKeywords(searchQuery);
    
    console.log(`Search query: "${searchQuery}"`);
    console.log(`Extracted keywords: ${extractedKeywords.join(', ') || 'none'}`);

    // Build smart query based on extracted keywords
    let membersQuery = supabase
      .from('family_members')
      .select('*')
      .eq('parent_id', parentId);

    if (extractedKeywords.length > 0) {
      // If we extracted relationship keywords, search for those in the relationship field
      const relationshipFilters = extractedKeywords
        .map(k => `relationship.ilike.%${k}%`)
        .join(',');
      membersQuery = membersQuery.or(relationshipFilters);
      console.log(`Searching for relationships: ${extractedKeywords.join(', ')}`);
    } else if (searchQuery.length > 3) {
      // Otherwise use original search on name/bio (but not relationship to avoid false matches)
      membersQuery = membersQuery.or(
        `name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`
      );
      console.log(`Searching for name/bio containing: "${searchQuery}"`);
    } else {
      // For very short or general queries, return all members
      console.log(`Short/general query, fetching all family members`);
    }

    const { data: members } = await membersQuery.limit(10);
    
    console.log(`Found ${members?.length || 0} family members`);

    // Get ALL relationships to build relationship graph
    const { data: relationships } = await supabase
      .from('family_relationships')
      .select('*')
      .eq('parent_id', parentId);

    // Build relationship explanations for found members
    const membersWithRelationships = (members || []).map(member => {
      const relationshipPath = buildRelationshipPath(member.id, relationships || [], members || [], childId);
      return {
        ...member,
        relationshipExplanation: relationshipPath
      };
    });

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

    // Get relevant family events for found members
    const memberIds = (members || []).map(m => m.id);
    let events = [];
    if (memberIds.length > 0) {
      const { data: eventsData } = await supabase
        .from('family_events')
        .select('*')
        .eq('parent_id', parentId)
        .order('event_date', { ascending: false })
        .limit(10);
      
      // Filter events that involve the found members
      events = (eventsData || []).filter(event => 
        event.related_member_ids?.some((id: string) => memberIds.includes(id))
      );
    }

    console.log(`Found ${members?.length || 0} members, ${stories?.length || 0} stories, ${photos?.length || 0} photos, ${events.length} events`);

    // Build enhanced context object
    const context = {
      members: membersWithRelationships,
      stories: stories || [],
      photos: photos || [],
      events: events,
      relationships: relationships || []
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
