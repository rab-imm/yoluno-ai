import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { childName, missionTitle, completionStatus, personalityMode } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const personalityGuidance = personalityMode === "curious_explorer"
      ? "Use an enthusiastic, adventurous tone with excitement and energy. Include emojis like 🚀✨🌟"
      : "Use a warm, gentle, nurturing tone with care and support. Include emojis like 💙🌸💝";

    const systemPrompt = `You are ${childName}'s AI buddy companion.
${personalityGuidance}
Keep messages short (1-2 sentences), age-appropriate, and genuinely encouraging.
Never be condescending or use baby talk.`;

    const userPrompt = completionStatus === "completed"
      ? `${childName} just completed their mission: "${missionTitle}". Give them genuine praise and celebration!`
      : `Encourage ${childName} about today's mission: "${missionTitle}". Motivate them positively!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content;

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating encouragement:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
