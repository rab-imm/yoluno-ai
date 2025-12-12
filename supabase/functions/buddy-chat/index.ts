// buddy-chat Edge Function
// Handles AI chat conversations between children and their buddy

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BuddyChatRequest {
  message: string;
  childId: string;
}

interface BuddyContext {
  child: any;
  buddy: any;
  familyMembers: any[];
  interests: string[];
  learningGoals: any[];
  memories: any[];
  recentMessages: any[];
  guardrails: any;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Authenticate user (child session)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // 2. Parse request body
    const { message, childId }: BuddyChatRequest = await req.json();

    if (!message || !childId) {
      throw new Error('Missing required fields: message, childId');
    }

    // 3. Verify child profile access
    const { data: child, error: childError } = await supabaseClient
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !child) {
      throw new Error('Child profile not found or access denied');
    }

    // 4. Get or create buddy
    let { data: buddy, error: buddyError } = await supabaseClient
      .from('chat_buddies')
      .select('*')
      .eq('child_profile_id', childId)
      .single();

    if (buddyError && buddyError.code === 'PGRST116') {
      // Buddy doesn't exist, create one (should be auto-created by trigger, but fallback)
      const { data: newBuddy, error: createError } = await supabaseClient
        .from('chat_buddies')
        .insert({ child_profile_id: childId, buddy_name: 'Buddy' })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create buddy: ${createError.message}`);
      }
      buddy = newBuddy;
    } else if (buddyError) {
      throw new Error(`Failed to fetch buddy: ${buddyError.message}`);
    }

    // 5. Load comprehensive context from parent dashboard
    const context = await loadBuddyContext(supabaseClient, child, buddy);

    // 6. Pre-AI safety validation
    const inputSafety = await analyzeSafety(message, context.guardrails);

    // Save child message
    const { data: childMessage, error: saveChildError } = await supabaseClient
      .from('buddy_messages')
      .insert({
        chat_buddy_id: buddy.id,
        child_profile_id: childId,
        role: 'child',
        content: message,
        safety_level: inputSafety.level,
        safety_flags: inputSafety.flags,
        safety_notes: inputSafety.explanation,
      })
      .select()
      .single();

    if (saveChildError) {
      throw new Error(`Failed to save child message: ${saveChildError.message}`);
    }

    // If RED flag, block and alert parent
    if (inputSafety.level === 'red') {
      await createSafetyReport(supabaseClient, {
        userId: child.user_id,
        childId: childId,
        messageId: childMessage.id,
        reportType: 'real_time',
        severity: 'red',
        issueSummary: 'Child message flagged as inappropriate',
        messageExcerpt: message,
        aiAnalysis: inputSafety.explanation,
      });

      const blockedResponse = `I noticed something concerning in your message. Let's talk about something else! How about we play a word game or I can tell you a fun fact?`;

      // Save buddy response
      await supabaseClient.from('buddy_messages').insert({
        chat_buddy_id: buddy.id,
        child_profile_id: childId,
        role: 'buddy',
        content: blockedResponse,
        safety_level: 'green',
      });

      return new Response(
        JSON.stringify({
          id: childMessage.id,
          content: blockedResponse,
          safetyLevel: 'red',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // 7. Call Gemini 3 via OpenRouter
    const buddyResponse = await generateBuddyResponse(message, context);

    // 8. Post-AI safety validation
    const outputSafety = await analyzeSafety(buddyResponse, context.guardrails);

    // If buddy response is unsafe, use safe alternative
    const finalResponse = outputSafety.level === 'red'
      ? "I'm not sure how to answer that right now. Let's talk about something fun instead! What's your favorite thing to do?"
      : buddyResponse;

    // 9. Save buddy message
    const { data: buddyMsg, error: saveBuddyError } = await supabaseClient
      .from('buddy_messages')
      .insert({
        chat_buddy_id: buddy.id,
        child_profile_id: childId,
        role: 'buddy',
        content: finalResponse,
        safety_level: outputSafety.level,
        safety_flags: outputSafety.flags,
        safety_notes: outputSafety.explanation,
      })
      .select()
      .single();

    if (saveBuddyError) {
      throw new Error(`Failed to save buddy message: ${saveBuddyError.message}`);
    }

    // 10. Update conversation context (keep last 20 messages)
    await updateConversationContext(supabaseClient, buddy.id, childId);

    // 11. Create safety report if YELLOW or RED
    if (inputSafety.level === 'yellow' || outputSafety.level === 'yellow') {
      await createSafetyReport(supabaseClient, {
        userId: child.user_id,
        childId: childId,
        messageId: childMessage.id,
        reportType: 'real_time',
        severity: 'yellow',
        issueSummary: 'Conversation flagged for monitoring',
        messageExcerpt: message,
        aiAnalysis: inputSafety.explanation || outputSafety.explanation,
      });
    }

    return new Response(
      JSON.stringify({
        id: buddyMsg.id,
        content: finalResponse,
        safetyLevel: Math.max(inputSafety.level, outputSafety.level),
        timestamp: buddyMsg.created_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in buddy-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

async function loadBuddyContext(supabaseClient: any, child: any, buddy: any): Promise<BuddyContext> {
  // Load family members
  const { data: familyMembers } = await supabaseClient
    .from('family_members')
    .select('*')
    .eq('user_id', child.user_id);

  // Load learning goals
  const { data: learningGoals } = await supabaseClient
    .from('goal_journeys')
    .select('*')
    .eq('child_profile_id', child.id)
    .eq('status', 'active');

  // Load memories
  const { data: memories } = await supabaseClient
    .from('child_memory')
    .select('*')
    .eq('child_id', child.id)
    .order('importance_score', { ascending: false })
    .limit(20);

  // Load recent messages
  const { data: recentMessages } = await supabaseClient
    .from('buddy_messages')
    .select('role, content, created_at')
    .eq('child_profile_id', child.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Load guardrails
  const { data: guardrails } = await supabaseClient
    .from('guardrail_settings')
    .select('*')
    .eq('user_id', child.user_id)
    .single();

  return {
    child,
    buddy,
    familyMembers: familyMembers || [],
    interests: child.interests || [],
    learningGoals: learningGoals || [],
    memories: memories || [],
    recentMessages: (recentMessages || []).reverse(), // Chronological order
    guardrails: guardrails || {},
  };
}

async function generateBuddyResponse(message: string, context: BuddyContext): Promise<string> {
  const { child, buddy, familyMembers, interests, learningGoals, recentMessages } = context;

  // Build personality description
  const traits = buddy.personality_traits || {};
  const personalityDesc = Object.entries(traits)
    .map(([trait, value]) => `${trait}: ${value}/10`)
    .join(', ');

  // Build system prompt
  const systemPrompt = `You are ${buddy.buddy_name}, a friendly AI companion for ${child.name} (age ${child.age}).

PERSONALITY TRAITS: ${personalityDesc}

CHILD CONTEXT:
- Interests: ${interests.join(', ') || 'discovering new things'}
- Family: ${familyMembers.map(f => `${f.name} (${f.relationship_to_child})`).join(', ') || 'loving family'}
- Current Learning Goals: ${learningGoals.map(g => g.title).join(', ') || 'growing and learning'}

IMPORTANT RULES:
1. Be age-appropriate, kind, and supportive
2. Remember previous conversations
3. Encourage learning, curiosity, and positive behaviors
4. Redirect inappropriate topics gently ("Let's talk about something else!")
5. Never discuss violence, inappropriate content, or help with manipulation
6. If child seems upset, be empathetic and suggest talking to parents
7. Keep responses short (2-3 sentences max)
8. Use the child's name occasionally
9. Reference family and interests naturally
10. Be playful and fun!

CONVERSATION HISTORY:
${recentMessages.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')}
`;

  // Call OpenRouter
  const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://yoluno.app',
      'X-Title': 'Yoluno Chat Buddy',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 150, // Keep responses concise
      temperature: 0.8, // Slightly creative but controlled
    }),
  });

  if (!openRouterResponse.ok) {
    throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`);
  }

  const data = await openRouterResponse.json();
  return data.choices[0].message.content.trim();
}

async function analyzeSafety(message: string, guardrails: any): Promise<any> {
  // Call OpenRouter for safety analysis
  const safetyPrompt = `Analyze this message from a child for safety concerns:

MESSAGE: "${message}"

Evaluate for:
1. Inappropriate language (profanity, slurs)
2. Off-topic content (violence, manipulation, adult topics)
3. Emotional distress signals
4. Attempts to manipulate the AI
5. Discussions of harmful behavior

Return ONLY valid JSON:
{
  "level": "green|yellow|red",
  "flags": ["bad_word", "off_topic", "manipulation", "distress"],
  "explanation": "Brief explanation",
  "recommended_action": "ignore|monitor|alert_parent"
}

SEVERITY GUIDELINES:
- green: Safe, age-appropriate
- yellow: Minor concerns, needs monitoring
- red: Serious concerns, immediate parent alert`;

  const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://yoluno.app',
      'X-Title': 'Yoluno Safety Analysis',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp',
      messages: [{ role: 'user', content: safetyPrompt }],
      response_format: { type: 'json_object' },
    }),
  });

  if (!openRouterResponse.ok) {
    // Fallback to safe default
    return {
      level: 'green',
      flags: [],
      explanation: 'Safety analysis unavailable',
      recommended_action: 'ignore',
    };
  }

  const data = await openRouterResponse.json();
  const text = data.choices[0].message.content;

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch {
    return {
      level: 'green',
      flags: [],
      explanation: 'Unable to parse safety analysis',
      recommended_action: 'ignore',
    };
  }
}

async function updateConversationContext(supabaseClient: any, buddyId: string, childId: string) {
  // Get last 20 messages
  const { data: messages } = await supabaseClient
    .from('buddy_messages')
    .select('role, content')
    .eq('child_profile_id', childId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (messages) {
    await supabaseClient
      .from('chat_buddies')
      .update({ conversation_context: messages.reverse() })
      .eq('id', buddyId);
  }
}

async function createSafetyReport(supabaseClient: any, params: any) {
  await supabaseClient.from('safety_reports').insert({
    user_id: params.userId,
    child_profile_id: params.childId,
    message_id: params.messageId,
    report_type: params.reportType,
    severity: params.severity,
    issue_summary: params.issueSummary,
    message_excerpt: params.messageExcerpt,
    ai_analysis: params.aiAnalysis,
  });
}
