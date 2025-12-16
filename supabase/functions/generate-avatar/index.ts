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
    const { emoji, childName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate custom avatar using Gemini image generation
    const prompt = `Create a cute, friendly, child-appropriate avatar character based on ${emoji}. 
    This is ${childName}'s personal AI learning buddy companion.
    The character should be colorful, expressive, and appealing to children aged 5-12. 
    Style: cartoon, simple shapes, bright colors, friendly face with big expressive eyes. 
    The character should look welcoming, fun, and educational - perfect for a learning companion.
    Background: transparent or soft gradient.
    High quality, professional illustration style suitable for a children's educational app.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI gateway error:", response.status, error);
      throw new Error("Failed to generate avatar image");
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error generating avatar:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate avatar" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});