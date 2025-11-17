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
    const { childId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get guardrail settings for custom rate limits
    const { data: profile } = await supabase
      .from('child_profiles')
      .select('parent_id')
      .eq('id', childId)
      .single();

    let messagesPerMinute = 5;
    let messagesPerHour = 50;

    if (profile) {
      const { data: settings } = await supabase
        .from('guardrail_settings')
        .select('messages_per_minute, messages_per_hour')
        .eq('parent_id', profile.parent_id)
        .single();

      if (settings) {
        messagesPerMinute = settings.messages_per_minute;
        messagesPerHour = settings.messages_per_hour;
      }
    }

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // Check 1-minute window
    const { count: oneMinuteCount } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId)
      .eq('role', 'user')
      .gte('created_at', oneMinuteAgo.toISOString());

    if ((oneMinuteCount || 0) >= messagesPerMinute) {
      // Log rate limit violation
      await supabase.from('message_rate_limits').upsert({
        child_id: childId,
        window_start: new Date(now.getTime() - (now.getTime() % 60000)).toISOString(),
        message_count: oneMinuteCount || 0,
        blocked_count: 1
      });

      return new Response(JSON.stringify({
        allowed: false,
        reason: 'rate_limit_1min',
        message: `Please slow down! You can send ${messagesPerMinute} messages per minute.`,
        retryAfter: 60
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429
      });
    }

    // Check 1-hour window
    const { count: oneHourCount } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', childId)
      .eq('role', 'user')
      .gte('created_at', oneHourAgo.toISOString());

    if ((oneHourCount || 0) >= messagesPerHour) {
      // Create parent alert for persistent violations
      if (profile && oneHourCount && oneHourCount > messagesPerHour * 0.9) {
        await supabase.from('parent_alerts').insert({
          parent_id: profile.parent_id,
          child_id: childId,
          alert_type: 'rate_limit_exceeded',
          severity: 'medium',
          title: 'High Message Volume',
          description: `Your child has sent ${oneHourCount} messages in the past hour, approaching the ${messagesPerHour} message limit.`,
          metadata: { messageCount: oneHourCount, limit: messagesPerHour }
        });
      }

      return new Response(JSON.stringify({
        allowed: false,
        reason: 'rate_limit_1hour',
        message: `You've sent a lot of messages! Please take a break and come back later.`,
        retryAfter: 3600
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429
      });
    }

    // Rate limit passed
    return new Response(JSON.stringify({
      allowed: true,
      remainingMinute: messagesPerMinute - (oneMinuteCount || 0),
      remainingHour: messagesPerHour - (oneHourCount || 0)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Rate limit check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      allowed: true, // Fail open for safety
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
