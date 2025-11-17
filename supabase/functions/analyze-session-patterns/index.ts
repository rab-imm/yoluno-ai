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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Get active sessions (sessions with activity in last 30 min)
    const { data: activeSessions } = await supabase
      .from('chat_session_metrics')
      .select('*')
      .gte('session_start', thirtyMinutesAgo.toISOString())
      .is('session_end', null);

    if (!activeSessions || activeSessions.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No active sessions to analyze',
        analyzed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const analysisResults = [];

    for (const session of activeSessions) {
      const childId = session.child_id;

      // Get recent messages in this session
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('child_id', childId)
        .gte('created_at', session.session_start)
        .order('created_at', { ascending: true });

      // Get validation logs for this session
      const { data: validationLogs } = await supabase
        .from('message_validation_logs')
        .select('*')
        .eq('child_id', childId)
        .gte('created_at', session.session_start);

      const totalMessages = messages?.length || 0;
      const flaggedMessages = validationLogs?.filter(log => 
        log.flag_level === 'yellow' || log.flag_level === 'red'
      ).length || 0;

      // Calculate anomaly score (0-10)
      let anomalyScore = 0;
      let rapidSwitching = false;
      let manipulationAttempts = 0;

      // Check for rapid topic switching
      const topics = session.topics_discussed || [];
      if (topics.length > 5 && totalMessages < 10) {
        rapidSwitching = true;
        anomalyScore += 2;
      }

      // Check flagged message ratio
      const flaggedRatio = totalMessages > 0 ? flaggedMessages / totalMessages : 0;
      if (flaggedRatio > 0.3) {
        anomalyScore += 3;
      }

      // Check for manipulation patterns
      manipulationAttempts = validationLogs?.filter(log => {
        const reasons = log.flag_reasons as any;
        return reasons?.some((r: any) => r.toLowerCase().includes('manipulation'));
      }).length || 0;

      if (manipulationAttempts > 0) {
        anomalyScore += manipulationAttempts * 2;
      }

      // Check time of day (chatting at unusual hours?)
      const sessionHour = new Date(session.session_start).getHours();
      if (sessionHour < 6 || sessionHour > 22) {
        anomalyScore += 1;
      }

      // Cap anomaly score at 10
      anomalyScore = Math.min(anomalyScore, 10);

      // Calculate topic drift score
      const topicDrift = topics.length > 3 ? Math.min(topics.length / 2, 10) : 0;

      // Update session metrics
      await supabase
        .from('chat_session_metrics')
        .update({
          total_messages: totalMessages,
          flagged_messages: flaggedMessages,
          topics_discussed: topics,
          topic_drift_score: topicDrift,
          manipulation_attempts: manipulationAttempts,
          anomaly_score: anomalyScore,
          rapid_switching: rapidSwitching,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      // Create parent alert if anomaly score is high
      if (anomalyScore >= 6 && !session.parent_alerted) {
        const { data: profile } = await supabase
          .from('child_profiles')
          .select('parent_id')
          .eq('id', childId)
          .single();

        if (profile) {
          await supabase.from('parent_alerts').insert({
            parent_id: profile.parent_id,
            child_id: childId,
            alert_type: 'session_anomaly',
            severity: anomalyScore >= 8 ? 'high' : 'medium',
            title: 'Unusual Chat Pattern Detected',
            description: `We detected unusual patterns in your child's conversation: ${
              rapidSwitching ? 'rapid topic switching, ' : ''
            }${flaggedRatio > 0.3 ? 'high rate of flagged messages, ' : ''
            }${manipulationAttempts > 0 ? 'possible manipulation attempts' : ''}`,
            metadata: {
              anomalyScore,
              totalMessages,
              flaggedMessages,
              manipulationAttempts,
              rapidSwitching
            }
          });

          await supabase
            .from('chat_session_metrics')
            .update({ parent_alerted: true })
            .eq('id', session.id);
        }
      }

      analysisResults.push({
        sessionId: session.id,
        childId,
        anomalyScore,
        totalMessages,
        flaggedMessages,
        manipulationAttempts,
        alertCreated: anomalyScore >= 6
      });
    }

    return new Response(JSON.stringify({
      message: 'Session analysis complete',
      analyzed: activeSessions.length,
      results: analysisResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Session analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
