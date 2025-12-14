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
    console.log('buddy-chat: Starting request processing');

    // Debug: Check env vars first
    const envCheck = {
      hasUrl: !!Deno.env.get('SUPABASE_URL'),
      hasAnon: !!Deno.env.get('SUPABASE_ANON_KEY'),
      hasService: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      hasOpenRouter: !!Deno.env.get('OPENROUTER_API_KEY'),
    };
    console.log('buddy-chat: ENV check', envCheck);

    // 1. Authenticate user (child session)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('buddy-chat: Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log('buddy-chat: Auth header present');

    // User client for auth verification
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Service role client for database operations (bypasses RLS for inserts)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error('buddy-chat: Auth failed', userError);
      throw new Error('Unauthorized');
    }
    console.log('buddy-chat: User authenticated', user.id);

    // 2. Parse request body
    let body: BuddyChatRequest;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('buddy-chat: Failed to parse request body', parseError);
      throw new Error('Invalid request body');
    }
    const { message, childId } = body;

    if (!message || !childId) {
      console.error('buddy-chat: Missing required fields', { message: !!message, childId: !!childId });
      throw new Error('Missing required fields: message, childId');
    }
    console.log('buddy-chat: Request parsed', { childId, messageLength: message.length });

    // 3. Verify child profile access
    console.log('buddy-chat: Fetching child profile', childId);
    const { data: child, error: childError } = await supabaseClient
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !child) {
      console.error('buddy-chat: Child profile error', childError);
      throw new Error('Child profile not found or access denied');
    }
    console.log('buddy-chat: Child profile found', child.name);

    // 4. Get or create buddy
    console.log('buddy-chat: Fetching buddy');
    let { data: buddy, error: buddyError } = await supabaseClient
      .from('chat_buddies')
      .select('*')
      .eq('child_profile_id', childId)
      .single();

    if (buddyError && buddyError.code === 'PGRST116') {
      console.log('buddy-chat: Buddy not found, creating one');
      // Buddy doesn't exist, create one (should be auto-created by trigger, but fallback)
      const { data: newBuddy, error: createError } = await supabaseClient
        .from('chat_buddies')
        .insert({ child_profile_id: childId, buddy_name: 'Buddy' })
        .select()
        .single();

      if (createError) {
        console.error('buddy-chat: Failed to create buddy', createError);
        throw new Error(`Failed to create buddy: ${createError.message}`);
      }
      buddy = newBuddy;
      console.log('buddy-chat: Created new buddy', buddy.id);
    } else if (buddyError) {
      console.error('buddy-chat: Failed to fetch buddy', buddyError);
      throw new Error(`Failed to fetch buddy: ${buddyError.message}`);
    }
    console.log('buddy-chat: Buddy ready', buddy.buddy_name);

    // 5. Load comprehensive context from parent dashboard
    console.log('buddy-chat: Loading context');
    const context = await loadBuddyContext(supabaseClient, child, buddy);
    console.log('buddy-chat: Context loaded');

    // 6. Pre-AI safety validation
    console.log('buddy-chat: Analyzing input safety');
    const inputSafety = await analyzeSafety(message, context.guardrails);
    console.log('buddy-chat: Input safety level', inputSafety.level);

    // Save child message
    console.log('buddy-chat: Saving child message');
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

    // 7. Call Gemini via OpenRouter
    console.log('buddy-chat: Generating AI response');
    const buddyResponse = await generateBuddyResponse(message, context);
    console.log('buddy-chat: AI response generated, length:', buddyResponse.length);

    // 8. Post-AI safety validation
    const outputSafety = await analyzeSafety(buddyResponse, context.guardrails);

    // If buddy response is unsafe, block it
    if (outputSafety.level === 'red') {
      throw new Error('AI generated unsafe response');
    }
    const finalResponse = buddyResponse;

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    return new Response(
      JSON.stringify({
        error: errorMessage || 'Internal server error',
        details: errorStack
      }),
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
  console.log('buddy-chat: loadBuddyContext starting');

  // Load family members
  const { data: familyMembers, error: familyError } = await supabaseClient
    .from('family_members')
    .select('*')
    .eq('user_id', child.user_id);
  if (familyError) console.log('buddy-chat: family_members query error (non-fatal)', familyError.message);

  // Load learning goals (journeys table)
  const { data: learningGoals, error: journeysError } = await supabaseClient
    .from('journeys')
    .select('*')
    .eq('child_profile_id', child.id)
    .eq('status', 'active');
  if (journeysError) console.log('buddy-chat: journeys query error (non-fatal)', journeysError.message);

  // Load recent messages (used as memory context)
  const { data: recentMessages, error: messagesError } = await supabaseClient
    .from('buddy_messages')
    .select('role, content, created_at')
    .eq('child_profile_id', child.id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (messagesError) console.log('buddy-chat: buddy_messages query error (non-fatal)', messagesError.message);

  // Load guardrails (linked to child_profile_id) - use maybeSingle to avoid error if not found
  const { data: guardrails, error: guardrailsError } = await supabaseClient
    .from('guardrail_settings')
    .select('*')
    .eq('child_profile_id', child.id)
    .maybeSingle();
  if (guardrailsError) console.log('buddy-chat: guardrail_settings query error (non-fatal)', guardrailsError.message);

  console.log('buddy-chat: loadBuddyContext complete');

  return {
    child,
    buddy,
    familyMembers: familyMembers || [],
    interests: child.interests || [],
    learningGoals: learningGoals || [],
    memories: [], // Memories derived from recent messages
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
- Family: ${familyMembers.map(f => `${f.name} (${f.relationship_type || 'family member'})`).join(', ') || 'loving family'}
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

  const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!openRouterApiKey) {
    console.error('buddy-chat: OPENROUTER_API_KEY not set');
    throw new Error('OpenRouter API key not configured');
  }
  console.log('buddy-chat: Calling OpenRouter API');

  try {
    // Call OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoluno.app',
        'X-Title': 'Yoluno Chat Buddy',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('buddy-chat: OpenRouter API error', openRouterResponse.status, errorText);
      throw new Error(`OpenRouter API error: ${openRouterResponse.status} ${errorText}`);
    }

    const data = await openRouterResponse.json();
    console.log('buddy-chat: OpenRouter response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('buddy-chat: Invalid OpenRouter response structure', JSON.stringify(data));
      throw new Error('Invalid response from OpenRouter');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('buddy-chat: generateBuddyResponse error', error);
    throw error;
  }
}

async function analyzeSafety(message: string, _guardrails: any): Promise<any> {
  // Simple keyword-based safety check (fast, no API call needed for basic checks)
  const redFlags = ['kill', 'hurt', 'hate', 'die', 'dead', 'blood', 'gun', 'weapon'];
  const yellowFlags = ['stupid', 'dumb', 'shut up', 'angry', 'mad', 'scared', 'afraid'];

  const lowerMessage = message.toLowerCase();

  // Check for red flags first
  for (const flag of redFlags) {
    if (lowerMessage.includes(flag)) {
      console.log('buddy-chat: Red safety flag detected:', flag);
      return {
        level: 'red',
        flags: ['concerning_content'],
        explanation: `Message contains concerning content`,
        recommended_action: 'alert_parent',
      };
    }
  }

  // Check for yellow flags
  for (const flag of yellowFlags) {
    if (lowerMessage.includes(flag)) {
      console.log('buddy-chat: Yellow safety flag detected:', flag);
      return {
        level: 'yellow',
        flags: ['monitor'],
        explanation: `Message may need monitoring`,
        recommended_action: 'monitor',
      };
    }
  }

  // Default to green (safe)
  return {
    level: 'green',
    flags: [],
    explanation: 'Message appears safe',
    recommended_action: 'ignore',
  };
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
