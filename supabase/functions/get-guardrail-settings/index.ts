import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_SETTINGS = {
  strictness_level: 'medium',
  block_on_yellow: false,
  notify_on_yellow: true,
  notify_on_green: false,
  custom_blocked_keywords: [],
  custom_allowed_phrases: [],
  require_explicit_approval: false,
  auto_expand_topics: true,
  messages_per_minute: 5,
  messages_per_hour: 50,
  max_response_length: 300,
  preferred_ai_tone: 'friendly',
  learn_from_approvals: true
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { parentId, childId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let effectiveParentId = parentId;

    // If only childId provided, get parentId
    if (!parentId && childId) {
      const { data: profile } = await supabase
        .from('child_profiles')
        .select('parent_id')
        .eq('id', childId)
        .single();

      if (profile) {
        effectiveParentId = profile.parent_id;
      }
    }

    if (!effectiveParentId) {
      return new Response(JSON.stringify({ 
        error: 'Parent ID or Child ID required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Fetch custom settings
    const { data: customSettings } = await supabase
      .from('guardrail_settings')
      .select('*')
      .eq('parent_id', effectiveParentId)
      .single();

    // Merge with defaults
    const settings = customSettings ? {
      ...DEFAULT_SETTINGS,
      ...customSettings
    } : DEFAULT_SETTINGS;

    // Add computed fields
    const effectiveSettings = {
      ...settings,
      computedFields: {
        isStrictMode: settings.strictness_level === 'high',
        isLenientMode: settings.strictness_level === 'low',
        hasCustomKeywords: settings.custom_blocked_keywords.length > 0,
        hasCustomPhrases: settings.custom_allowed_phrases.length > 0
      }
    };

    return new Response(JSON.stringify({
      settings: effectiveSettings,
      isCustomized: !!customSettings
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get guardrail settings error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      settings: DEFAULT_SETTINGS,
      isCustomized: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
