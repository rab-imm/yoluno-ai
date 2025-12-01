import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { category } = await req.json();

    // Build query for active clips
    let query = supabase
      .from("voice_vault_clips")
      .select("id, audio_url, clip_name, category")
      .eq("parent_id", user.id)
      .eq("is_active", true);

    // Filter by category if provided
    if (category) {
      query = query.eq("category", category);
    }

    const { data: clips, error: fetchError } = await query;

    if (fetchError) throw fetchError;

    if (!clips || clips.length === 0) {
      return new Response(
        JSON.stringify({ clip: null, message: "No voice clips available" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select random clip
    const randomClip = clips[Math.floor(Math.random() * clips.length)];

    // Increment play count
    const { data: currentClip } = await supabase
      .from("voice_vault_clips")
      .select("play_count")
      .eq("id", randomClip.id)
      .single();

    if (currentClip) {
      await supabase
        .from("voice_vault_clips")
        .update({ play_count: (currentClip.play_count || 0) + 1 })
        .eq("id", randomClip.id);
    }

    console.log("Selected voice clip:", randomClip.clip_name);

    return new Response(
      JSON.stringify({ clip: randomClip }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-reward-voice-clip:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
