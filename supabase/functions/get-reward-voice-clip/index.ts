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
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ 
          error: "Authentication required",
          userMessage: "Please sign in to access voice rewards." 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ 
          error: "Session expired",
          userMessage: "Your session has expired. Please sign in again." 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    let category: string | undefined;
    try {
      const body = await req.json();
      category = body.category;
    } catch {
      // No body or invalid JSON - continue without category filter
    }

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

    if (fetchError) {
      console.error("Database error fetching clips:", fetchError);
      return new Response(
        JSON.stringify({ 
          error: "Database error",
          userMessage: "Unable to retrieve voice clips at this time." 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!clips || clips.length === 0) {
      console.log("No voice clips available for user:", user.id);
      return new Response(
        JSON.stringify({ 
          clip: null, 
          message: "No voice clips available" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select random clip
    const randomClip = clips[Math.floor(Math.random() * clips.length)];

    // Increment play count
    const { data: currentClip, error: countError } = await supabase
      .from("voice_vault_clips")
      .select("play_count")
      .eq("id", randomClip.id)
      .single();

    if (countError) {
      console.error("Error fetching play count:", countError);
      // Continue without updating play count
    } else if (currentClip) {
      const { error: updateError } = await supabase
        .from("voice_vault_clips")
        .update({ play_count: (currentClip.play_count || 0) + 1 })
        .eq("id", randomClip.id);

      if (updateError) {
        console.error("Error updating play count:", updateError);
        // Continue anyway - play count update is not critical
      }
    }

    console.log("Selected voice clip:", randomClip.clip_name, "for user:", user.id);

    return new Response(
      JSON.stringify({ clip: randomClip }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error in get-reward-voice-clip:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        userMessage: "Something went wrong. Please try again later." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
