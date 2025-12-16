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

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get all learning events from the past 7 days
    const { data: learningEvents } = await supabase
      .from('guardrail_learning_events')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (!learningEvents || learningEvents.length === 0) {
      return new Response(JSON.stringify({
        message: 'No learning events to analyze',
        suggestions: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Group events by parent
    const eventsByParent = new Map<string, any[]>();
    learningEvents.forEach(event => {
      const parentEvents = eventsByParent.get(event.parent_id) || [];
      parentEvents.push(event);
      eventsByParent.set(event.parent_id, parentEvents);
    });

    const suggestions = [];

    // Analyze each parent's patterns
    for (const [parentId, events] of eventsByParent.entries()) {
      const approvedYellows = events.filter(e => 
        e.original_flag_level === 'yellow' && e.parent_decision === 'approve'
      );

      const blockedGreens = events.filter(e =>
        e.original_flag_level === 'green' && e.parent_decision === 'block'
      );

      // Check guardrail settings
      const { data: settings } = await supabase
        .from('guardrail_settings')
        .select('learn_from_approvals')
        .eq('parent_id', parentId)
        .single();

      // Skip if learning is disabled
      if (settings && !settings.learn_from_approvals) {
        continue;
      }

      // Analyze patterns for false positives (approved yellows)
      if (approvedYellows.length >= 3) {
        const topicCounts = new Map<string, number>();
        const phraseCounts = new Map<string, number>();

        approvedYellows.forEach(event => {
          // Count topics
          if (event.message_topic) {
            const count = topicCounts.get(event.message_topic) || 0;
            topicCounts.set(event.message_topic, count + 1);
          }

          // Extract common phrases (simple word frequency)
          if (event.message_content) {
            const words = event.message_content.toLowerCase()
              .split(/\s+/)
              .filter((w: string) => w.length > 4);
            
            words.forEach((word: string) => {
              const count = phraseCounts.get(word) || 0;
              phraseCounts.set(word, count + 1);
            });
          }
        });

        // Suggest adding frequently approved topics
        for (const [topic, count] of topicCounts.entries()) {
          if (count >= 2) {
            suggestions.push({
              parentId,
              type: 'topic_whitelist',
              suggestion: `Consider adding "${topic}" to allowed topics`,
              confidence: Math.min(count / approvedYellows.length, 1),
              evidence: `${count} yellow flags on this topic were approved`,
              action: 'add_allowed_topic',
              metadata: { topic }
            });
          }
        }

        // Suggest adding common phrases as allowed
        const frequentPhrases = Array.from(phraseCounts.entries())
          .filter(([_, count]) => count >= 2)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        if (frequentPhrases.length > 0) {
          suggestions.push({
            parentId,
            type: 'phrase_whitelist',
            suggestion: 'Consider adding these commonly approved phrases to your allowed list',
            confidence: 0.7,
            evidence: `These words appeared in ${frequentPhrases.length} approved messages`,
            action: 'add_allowed_phrases',
            metadata: { phrases: frequentPhrases.map(([word]) => word) }
          });
        }
      }

      // Analyze blocked greens (false negatives)
      if (blockedGreens.length >= 2) {
        const keywords = new Set<string>();
        
        blockedGreens.forEach(event => {
          if (event.message_content) {
            const words = event.message_content.toLowerCase()
              .split(/\s+/)
              .filter((w: string) => w.length > 3);
            words.forEach((w: string) => keywords.add(w));
          }
        });

        if (keywords.size > 0) {
          suggestions.push({
            parentId,
            type: 'keyword_blocklist',
            suggestion: 'Consider adding specific keywords to your blocked list',
            confidence: 0.6,
            evidence: `${blockedGreens.length} green-flagged messages were blocked by parent`,
            action: 'add_blocked_keywords',
            metadata: { keywords: Array.from(keywords).slice(0, 10) }
          });
        }
      }

      // Suggest strictness level adjustment
      const totalDecisions = events.length;
      const overridesRatio = approvedYellows.length / totalDecisions;

      if (overridesRatio > 0.5 && totalDecisions >= 5) {
        suggestions.push({
          parentId,
          type: 'strictness_adjustment',
          suggestion: 'Consider lowering strictness level to reduce false positives',
          confidence: 0.8,
          evidence: `${Math.round(overridesRatio * 100)}% of flagged content was approved`,
          action: 'adjust_strictness',
          metadata: { currentLevel: 'medium', suggestedLevel: 'low' }
        });
      }

      // Create parent alert with suggestions
      if (suggestions.filter(s => s.parentId === parentId).length > 0) {
        const parentSuggestions = suggestions.filter(s => s.parentId === parentId);
        
        await supabase.from('parent_alerts').insert({
          parent_id: parentId,
          child_id: events[0].child_id,
          alert_type: 'pattern_detected',
          severity: 'low',
          title: 'Guardrail Learning Insights Available',
          description: `Based on your recent decisions, we have ${parentSuggestions.length} suggestion(s) to improve accuracy.`,
          metadata: { suggestions: parentSuggestions }
        });
      }
    }

    return new Response(JSON.stringify({
      message: 'Guardrail adaptation complete',
      analyzed: eventsByParent.size,
      suggestions: suggestions.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Adapt guardrails error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
