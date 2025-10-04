import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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

    // System prompt for the AI buddy
    const personalityPrompts: Record<string, string> = {
      curious_explorer: "You love asking follow-up questions! After answering, ask the child what else they'd like to know about the topic.",
      patient_teacher: "You explain things step-by-step with clear examples. Break down complex ideas into simple parts.",
      playful_friend: "You use jokes, silly examples, and playful language to make learning super fun!",
    };

    // Get child's personality mode
    const { data: childData } = await supabase
      .from('child_profiles')
      .select('personality_mode')
      .eq('id', childId)
      .single();

    const personalityMode = childData?.personality_mode || 'curious_explorer';
    const personalityInstruction = personalityPrompts[personalityMode] || personalityPrompts.curious_explorer;

    const systemPrompt = `You are a friendly AI buddy for children. You can ONLY talk about these approved topics: ${approvedTopics.join(', ')}.

PERSONALITY: ${personalityInstruction}

IMPORTANT RULES:
1. Keep responses simple, fun, and age-appropriate (ages 5-12)
2. If the child asks about a topic NOT in the approved list, politely say: "That's not one of the topics your parent picked! But I'd love to chat about ${approvedTopics[0]} or ${approvedTopics[1] || approvedTopics[0]}! 🌟"
3. Use emojis and friendly language
4. Keep responses under 100 words
5. Encourage curiosity and learning
6. Never discuss anything inappropriate or scary
7. If unsure, default to a gentle refusal and redirect to approved topics

Be enthusiastic, supportive, and make learning fun!`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
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

    // Track conversation stats for insights (run in background, don't block response)
    const messageLower = message.toLowerCase();
    let detectedTopic = null;
    
    for (const topic of approvedTopics) {
      if (messageLower.includes(topic.toLowerCase())) {
        detectedTopic = topic;
        break;
      }
    }
    
    if (detectedTopic) {
      // Try to update existing stat or insert new one
      const { data: existingStat } = await supabase
        .from('conversation_stats')
        .select('message_count')
        .eq('child_id', childId)
        .eq('topic', detectedTopic)
        .single();
      
      if (existingStat) {
        // Increment existing count
        await supabase
          .from('conversation_stats')
          .update({
            message_count: existingStat.message_count + 1,
            last_message_at: new Date().toISOString(),
          })
          .eq('child_id', childId)
          .eq('topic', detectedTopic);
      } else {
        // Insert new stat
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
