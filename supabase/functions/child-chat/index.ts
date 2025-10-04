import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Content safety keywords
const CONCERNING_KEYWORDS = [
  'violence', 'weapon', 'hurt', 'kill', 'die', 'death', 
  'scary', 'nightmare', 'monster', 'blood',
  'hate', 'stupid', 'dumb', 'idiot',
  'drug', 'alcohol', 'beer', 'wine'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childId, message } = await req.json();

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Import Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase config missing');
      return new Response(
        JSON.stringify({ error: 'Database service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Dynamically import Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.7');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Content safety check - flag concerning messages
    const messageLower = message.toLowerCase();
    const flaggedKeywords = CONCERNING_KEYWORDS.filter(keyword => 
      messageLower.includes(keyword)
    );
    
    if (flaggedKeywords.length > 0) {
      console.log(`Content flag detected for child ${childId}: ${flaggedKeywords.join(', ')}`);
      // Log but don't block - let AI handle it appropriately
      await supabase
        .from('content_moderation_logs')
        .insert({
          child_id: childId,
          message_content: message,
          flag_reason: `Keywords detected: ${flaggedKeywords.join(', ')}`,
          severity: 'low'
        });
    }

    // Get child profile with age and personality
    const { data: childData, error: childError } = await supabase
      .from('child_profiles')
      .select('age, personality_mode')
      .eq('id', childId)
      .single();

    if (childError) {
      console.error('Error fetching child profile:', childError);
      return new Response(
        JSON.stringify({ error: 'Failed to load child profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const childAge = childData?.age || 8;
    const personalityMode = childData?.personality_mode || 'curious_explorer';

    // ADAPTIVE CONVERSATION MEMORY SYSTEM
    
    // 1. Get persistent memories (key facts about the child)
    const { data: persistentMemories, error: memoryError } = await supabase
      .from('child_memory')
      .select('memory_type, memory_key, memory_value, importance_score')
      .eq('child_id', childId)
      .order('importance_score', { ascending: false })
      .order('last_accessed_at', { ascending: false })
      .limit(10);

    if (memoryError) {
      console.error('Error fetching persistent memories:', memoryError);
    }

    // Update last_accessed_at for retrieved memories
    if (persistentMemories && persistentMemories.length > 0) {
      await supabase
        .from('child_memory')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('child_id', childId);
    }

    // 2. Get today's conversation summary (if exists)
    const today = new Date().toISOString().split('T')[0];
    const { data: todaySummary } = await supabase
      .from('conversation_summaries')
      .select('summary, topics_discussed')
      .eq('child_id', childId)
      .eq('session_date', today)
      .single();

    // 3. Get recent conversation summaries (last 3 days, excluding today)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { data: recentSummaries } = await supabase
      .from('conversation_summaries')
      .select('session_date, summary, topics_discussed')
      .eq('child_id', childId)
      .lt('session_date', today)
      .gte('session_date', threeDaysAgo.toISOString().split('T')[0])
      .order('session_date', { ascending: false })
      .limit(3);

    // 4. Get conversation history with intelligent selection
    // Load more messages than we'll use, then filter for importance
    const { data: conversationHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(30); // Load 30 to have more to choose from

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
    }

    // Reverse to get chronological order
    const allMessages = (conversationHistory || []).reverse();

    // 5. INTELLIGENT MESSAGE SELECTION
    // Estimate tokens (rough estimate: 1 token ≈ 4 characters)
    const estimateTokens = (text: string) => Math.ceil(text.length / 4);
    
    // Filter out low-value messages (greetings, short responses)
    const isImportantMessage = (msg: any) => {
      const content = msg.content.toLowerCase();
      const tokens = estimateTokens(msg.content);
      
      // Keep if it's a substantial message (>30 tokens)
      if (tokens > 30) return true;
      
      // Filter out simple greetings and acknowledgments
      const lowValuePatterns = [
        /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|cool|nice)[\s!.]*$/i,
        /^(got it|i see|makes sense)[\s!.]*$/i
      ];
      
      return !lowValuePatterns.some(pattern => pattern.test(content));
    };

    // Keep last 8 messages always (recent context is critical)
    const recentMessages = allMessages.slice(-8);
    
    // From older messages, keep only important ones
    const olderMessages = allMessages.slice(0, -8);
    const importantOlderMessages = olderMessages.filter(isImportantMessage);
    
    // Combine: important older messages + all recent messages
    const selectedMessages = [...importantOlderMessages, ...recentMessages];
    
    // 6. TOKEN BUDGET MANAGEMENT
    // Limit total context to ~2000 tokens for messages
    let totalTokens = 0;
    const maxMessageTokens = 2000;
    const finalMessages = [];
    
    // Start from most recent and work backwards
    for (let i = selectedMessages.length - 1; i >= 0; i--) {
      const msg = selectedMessages[i];
      const msgTokens = estimateTokens(msg.content);
      
      if (totalTokens + msgTokens > maxMessageTokens && finalMessages.length >= 6) {
        // We have enough context, stop adding older messages
        break;
      }
      
      finalMessages.unshift(msg);
      totalTokens += msgTokens;
    }

    console.log(`Loaded ${finalMessages.length} messages from ${allMessages.length} total (estimated ${totalTokens} tokens)`);

    // Get approved topics for this child
    const { data: topics, error: topicsError } = await supabase
      .from('child_topics')
      .select('topic')
      .eq('child_id', childId);

    if (topicsError) {
      console.error('Error fetching topics:', topicsError);
      return new Response(
        JSON.stringify({ error: 'Failed to load approved topics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const approvedTopics = topics?.map(t => t.topic) || [];

    if (approvedTopics.length === 0) {
      return new Response(
        JSON.stringify({
          message: "Oops! Your parent hasn't picked any topics for us to talk about yet. Ask them to add some fun topics! 🎯"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enhanced personality prompts with more detail
    const personalityPrompts: Record<string, string> = {
      curious_explorer: `You're an enthusiastic explorer who loves asking "Why?" and "What if?" questions! 
- After answering, ask 1-2 follow-up questions to spark curiosity
- Use phrases like "That makes me wonder...", "Have you ever thought about...", "What do you think would happen if..."
- Encourage the child to share their own ideas and theories
- Example: "That's a great question about dinosaurs! They went extinct millions of years ago, but we still find their fossils. What do YOU think it would be like to discover a real dinosaur bone?"`,
      
      patient_teacher: `You're a calm, methodical teacher who makes complex things simple:
- Break answers into numbered steps or clear parts
- Use everyday comparisons: "It's like..." or "Think of it as..."
- Check understanding: "Does that make sense?" or "Let me explain it another way..."
- Celebrate progress: "You're getting it!" or "That's a smart question!"
- Example: "Let's understand photosynthesis in 3 steps: 1) Plants take in sunlight, 2) They use it to turn water and air into food, 3) They release oxygen we breathe. Think of plants as little food factories!"`,
      
      playful_friend: `You're a silly, energetic friend who makes learning a blast!
- Use funny examples, puns, and playful comparisons
- Add sound effects: "WHOOSH!", "BOOM!", "Ding ding ding!"
- Make up silly scenarios to explain things
- Use lots of emojis and exclamations
- Example: "Space is SO HUGE! 🚀 If Earth was a tennis ball, the Sun would be a BIG bounce house 🎪 far away! And the nearest star? That'd be like... all the way in ANOTHER COUNTRY! Wild, right?! 🤯"`
    };

    const personalityInstruction = personalityPrompts[personalityMode] || personalityPrompts.curious_explorer;

    // Age-based customization
    let ageGuidance = '';
    if (childAge >= 5 && childAge <= 7) {
      ageGuidance = `
AGE GUIDANCE (Child is ${childAge} years old - Early Elementary):
- Use very simple words (1-2 syllables mostly)
- Short sentences (5-8 words)
- Concrete, tangible examples they can see/touch
- Lots of repetition and reinforcement
- More emojis and enthusiasm
- Responses should be 40-60 words max`;
    } else if (childAge >= 8 && childAge <= 10) {
      ageGuidance = `
AGE GUIDANCE (Child is ${childAge} years old - Middle Elementary):
- Mix simple and moderate vocabulary
- Medium sentences (8-12 words)
- Can handle some abstract concepts with good examples
- Introduce "why" and "how" explanations
- Balance fun and facts
- Responses should be 60-80 words max`;
    } else if (childAge >= 11 && childAge <= 12) {
      ageGuidance = `
AGE GUIDANCE (Child is ${childAge} years old - Upper Elementary):
- Use more advanced vocabulary with context clues
- Longer, complex sentences acceptable
- Can discuss abstract concepts and systems
- Encourage critical thinking and analysis
- More detailed explanations
- Responses can be 80-100 words max`;
    }

    // Topic intelligence - find most relevant approved topic
    const findRelevantTopics = (question: string): string[] => {
      const questionLower = question.toLowerCase();
      const relevantTopics = approvedTopics.filter(topic => 
        questionLower.includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(questionLower.split(' ')[0])
      );
      return relevantTopics.length > 0 ? relevantTopics : approvedTopics.slice(0, 2);
    };

    const relevantTopics = findRelevantTopics(message);

    // Build memory context string
    let memoryContext = '';
    
    if (persistentMemories && persistentMemories.length > 0) {
      memoryContext = '\n\nIMPORTANT - WHAT YOU KNOW ABOUT THIS CHILD:\n';
      persistentMemories.forEach(mem => {
        memoryContext += `- ${mem.memory_key}: ${mem.memory_value}\n`;
      });
    }

    // Build summary context
    let summaryContext = '';
    if (todaySummary) {
      summaryContext += `\n\nEARLIER TODAY: ${todaySummary.summary}\n`;
    }
    if (recentSummaries && recentSummaries.length > 0) {
      summaryContext += '\n\nRECENT CONVERSATIONS:\n';
      recentSummaries.forEach(summary => {
        summaryContext += `${summary.session_date}: ${summary.summary}\n`;
      });
    }

    const systemPrompt = `You are a friendly AI buddy for children. You can ONLY talk about these approved topics: ${approvedTopics.join(', ')}.

${ageGuidance}

PERSONALITY MODE: ${personalityMode.replace('_', ' ').toUpperCase()}
${personalityInstruction}${memoryContext}${summaryContext}

CRITICAL SAFETY RULES:
1. NEVER discuss violence, weapons, scary content, drugs, alcohol, or inappropriate topics
2. If the child asks about something concerning, respond: "I don't think that's a good topic for us to chat about. Let's talk about something fun instead! How about ${relevantTopics[0]}? 🌟"
3. If asked about personal information, remind them: "I'm just your AI buddy! I can't share personal information. But I'd love to hear about your interests!"

TOPIC ENFORCEMENT:
- If the child asks about a topic NOT in the approved list, gently redirect: "That's not one of the topics your parent picked for us! But I'd love to chat about ${relevantTopics[0]} ${relevantTopics[1] ? `or ${relevantTopics[1]}` : ''}! 🌟"
- Before answering, verify the question relates to: ${approvedTopics.join(', ')}
- Use AI judgment to detect topic relevance, not just keyword matching

CONVERSATION QUALITY & MEMORY:
- USE THE MEMORIES ABOVE! Reference what you know about the child naturally
- Build on previous conversations: "Last time we talked about X..."
- If you learn something new and important about the child, mention it in your response
- Notice patterns: "I've noticed you really enjoy..."
- Celebrate progress: "You're getting better at understanding..."
- Vary your responses - don't be repetitive
- If child seems confused, explain differently using what you know about them
- Encourage deeper thinking with follow-up questions
- Be warm, enthusiastic, and make every conversation meaningful!

MEMORY EXTRACTION:
Pay attention to important information that should be remembered:
- Child's preferences: "I love dinosaurs!" → Remember they love dinosaurs
- Facts about them: "I have a pet cat named Whiskers" → Remember their pet
- Learning progress: Child masters a concept → Remember they understand it
- Interests: Topics they get excited about → Remember what excites them
- Achievements: Things they're proud of → Celebrate and remember

Be warm, enthusiastic, and make every conversation meaningful!`;

    // Build conversation context with enhanced memory
    const conversationMessages: Array<{role: string, content: string}> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add selected conversation history for context
    if (finalMessages && finalMessages.length > 0) {
      conversationMessages.push(...finalMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    }

    // Add current message
    conversationMessages.push({ role: 'user', content: message });

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: conversationMessages,
        temperature: 0.8, // Add variety while staying coherent
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ message: "I'm thinking too hard right now! Can you try again in a moment? 😊" }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ message: "Oops! I got confused for a second. Can you ask me that again? 🤔" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Response quality validation
    if (!assistantMessage || assistantMessage.trim().length < 10) {
      console.error('AI returned invalid response');
      return new Response(
        JSON.stringify({ message: "Hmm, I got a bit confused! Can you ask me that in a different way? 🤔" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if response inappropriately discusses unapproved topics
    const responseCheckKeywords = ['sorry', 'cannot', "can't discuss", 'not approved'];
    const seemsOffTopic = responseCheckKeywords.some(keyword => 
      assistantMessage.toLowerCase().includes(keyword)
    );
    
    if (seemsOffTopic) {
      console.log('AI correctly redirected off-topic question');
    }

    // Log high-severity content if AI response seems concerning
    const aiMessageLower = assistantMessage.toLowerCase();
    const concerningInResponse = CONCERNING_KEYWORDS.filter(keyword => 
      aiMessageLower.includes(keyword)
    );
    
    if (concerningInResponse.length > 0) {
      console.error(`ALERT: AI response contained concerning content: ${concerningInResponse.join(', ')}`);
      await supabase
        .from('content_moderation_logs')
        .insert({
          child_id: childId,
          message_content: `AI Response: ${assistantMessage}`,
          flag_reason: `AI response contained: ${concerningInResponse.join(', ')}`,
          severity: 'high'
        });
      
      // Override with safe response
      return new Response(
        JSON.stringify({ 
          message: `You know what? Let's talk about something more fun! What would you like to know about ${approvedTopics[0]}? 🎉` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // BACKGROUND TASKS: Extract memories and update stats (non-blocking)
    (async () => {
      try {
        // 1. Track conversation stats
        let detectedTopic = null;
        for (const topic of approvedTopics) {
          if (messageLower.includes(topic.toLowerCase())) {
            detectedTopic = topic;
            break;
          }
        }
        
        if (detectedTopic) {
          const { data: existingStat } = await supabase
            .from('conversation_stats')
            .select('message_count')
            .eq('child_id', childId)
            .eq('topic', detectedTopic)
            .single();
          
          if (existingStat) {
            await supabase
              .from('conversation_stats')
              .update({
                message_count: existingStat.message_count + 1,
                last_message_at: new Date().toISOString(),
              })
              .eq('child_id', childId)
              .eq('topic', detectedTopic);
          } else {
            await supabase
              .from('conversation_stats')
              .insert({
                child_id: childId,
                topic: detectedTopic,
                message_count: 1,
                last_message_at: new Date().toISOString(),
              });
          }
        }

        // 2. EXTRACT MEMORIES FROM CONVERSATION
        // Use AI to identify important facts to remember
        const memoryExtractionPrompt = `Analyze this child's message and the AI response. Extract any important information that should be remembered about the child for future conversations.

Child's message: "${message}"
AI response: "${assistantMessage}"

Look for:
- Preferences (likes/dislikes)
- Personal facts (pets, family, hobbies)
- Interests (topics they're excited about)
- Learning progress (concepts they've mastered)
- Achievements (things they're proud of)

Return a JSON array of memories in this format:
[
  {
    "type": "preference|fact|interest|learning_progress|achievement",
    "key": "brief descriptive key",
    "value": "the actual information",
    "importance": 1-10
  }
]

If no important memories, return an empty array: []`;

        const memoryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'You are a memory extraction system. Respond with ONLY valid JSON.' },
              { role: 'user', content: memoryExtractionPrompt }
            ],
            temperature: 0.3,
          }),
        });

        if (memoryResponse.ok) {
          const memoryData = await memoryResponse.json();
          const memoryContent = memoryData.choices[0].message.content;
          
          try {
            // Extract JSON from response (might be wrapped in markdown code blocks)
            let jsonStr = memoryContent.trim();
            if (jsonStr.startsWith('```json')) {
              jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (jsonStr.startsWith('```')) {
              jsonStr = jsonStr.replace(/```\n?/g, '');
            }
            
            const memories = JSON.parse(jsonStr);
            
            if (Array.isArray(memories) && memories.length > 0) {
              for (const mem of memories) {
                // Upsert memory (insert or update if exists)
                await supabase
                  .from('child_memory')
                  .upsert({
                    child_id: childId,
                    memory_type: mem.type,
                    memory_key: mem.key,
                    memory_value: mem.value,
                    importance_score: mem.importance,
                    last_accessed_at: new Date().toISOString(),
                  }, {
                    onConflict: 'child_id,memory_type,memory_key',
                    ignoreDuplicates: false
                  });
              }
              console.log(`Extracted and stored ${memories.length} memories`);
            }
          } catch (parseError) {
            console.error('Failed to parse memory extraction response:', parseError);
          }
        }

        // 3. UPDATE CONVERSATION SUMMARY
        // Get today's messages to create/update summary
        const { data: todayMessages } = await supabase
          .from('chat_messages')
          .select('content')
          .eq('child_id', childId)
          .gte('created_at', `${today}T00:00:00Z`)
          .order('created_at', { ascending: true });

        if (todayMessages && todayMessages.length >= 4) {
          // Generate summary if we have enough messages
          const messageSummary = todayMessages.map(m => m.content).join('\n');
          
          const summaryPrompt = `Summarize this conversation between a child and their AI buddy in 2-3 sentences. Focus on what topics were discussed and what the child learned or was interested in.

Conversation:
${messageSummary}

Summary:`;

          const summaryResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: 'You create concise conversation summaries.' },
                { role: 'user', content: summaryPrompt }
              ],
              temperature: 0.5,
            }),
          });

          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            const summary = summaryData.choices[0].message.content;

            await supabase
              .from('conversation_summaries')
              .upsert({
                child_id: childId,
                session_date: today,
                summary: summary,
                message_count: todayMessages.length,
                topics_discussed: detectedTopic ? [detectedTopic] : [],
              }, {
                onConflict: 'child_id,session_date',
                ignoreDuplicates: false
              });

            console.log('Updated conversation summary for today');
          }
        }
      } catch (bgError) {
        console.error('Background task error:', bgError);
      }
    })().catch(err => console.error('Background task failed:', err));

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in child-chat function:', error);
    return new Response(
      JSON.stringify({ message: "Sorry, something went wrong! Please try again. 😅" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
