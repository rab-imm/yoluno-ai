import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Character {
  name: string;
  slug: string;
  category: 'animal' | 'fantasy' | 'everyday';
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

const CHARACTERS: Character[] = [
  // Animals (12)
  { name: "Robot Pup", slug: "robot-pup", category: "animal", description: "A friendly robot puppy who loves exploring technology", primaryColor: "#4A90E2", secondaryColor: "#7CB9E8" },
  { name: "Unicorn Star", slug: "unicorn-star", category: "animal", description: "A magical unicorn who spreads joy and wonder", primaryColor: "#9013FE", secondaryColor: "#D4A5FF" },
  { name: "Dragon Spark", slug: "dragon-spark", category: "animal", description: "A playful dragon who loves adventure and stories", primaryColor: "#F5A623", secondaryColor: "#FFD700" },
  { name: "Rocket Racer", slug: "rocket-racer", category: "animal", description: "A speedy rocket-loving adventurer reaching for the stars", primaryColor: "#D0021B", secondaryColor: "#FF6B6B" },
  { name: "Dino Rex", slug: "dino-rex", category: "animal", description: "A curious dinosaur who loves learning about history", primaryColor: "#7ED321", secondaryColor: "#A8E6A3" },
  { name: "Curious Cat", slug: "curious-cat", category: "animal", description: "A clever cat who asks questions and solves mysteries", primaryColor: "#F8E71C", secondaryColor: "#FFF176" },
  { name: "Wonder Dog", slug: "wonder-dog", category: "animal", description: "A loyal dog who loves making new friends", primaryColor: "#8B4513", secondaryColor: "#D2691E" },
  { name: "Fox Scout", slug: "fox-scout", category: "animal", description: "A smart fox who explores nature and discovers secrets", primaryColor: "#FF6347", secondaryColor: "#FF8C69" },
  { name: "Panda Zen", slug: "panda-zen", category: "animal", description: "A peaceful panda who teaches mindfulness and balance", primaryColor: "#000000", secondaryColor: "#808080" },
  { name: "Lion Heart", slug: "lion-heart", category: "animal", description: "A brave lion who shows courage and kindness", primaryColor: "#DAA520", secondaryColor: "#FFD700" },
  { name: "Frog Leap", slug: "frog-leap", category: "animal", description: "An energetic frog who loves jumping into new challenges", primaryColor: "#32CD32", secondaryColor: "#90EE90" },
  { name: "Ocean Octopus", slug: "ocean-octopus", category: "animal", description: "A creative octopus who multi-tasks and creates art", primaryColor: "#20B2AA", secondaryColor: "#48D1CC" },
  
  // Fantasy/Adventure (6)
  { name: "Space Explorer", slug: "space-explorer", category: "fantasy", description: "An astronaut discovering new worlds and galaxies", primaryColor: "#191970", secondaryColor: "#4169E1" },
  { name: "Magic Wizard", slug: "magic-wizard", category: "fantasy", description: "A wise wizard who loves books and spells", primaryColor: "#4B0082", secondaryColor: "#8A2BE2" },
  { name: "Forest Elf", slug: "forest-elf", category: "fantasy", description: "A nature-loving elf who protects the forest", primaryColor: "#228B22", secondaryColor: "#32CD32" },
  { name: "Desert Nomad", slug: "desert-nomad", category: "fantasy", description: "An adventurer exploring ancient desert mysteries", primaryColor: "#DEB887", secondaryColor: "#F4A460" },
  { name: "Mountain Climber", slug: "mountain-climber", category: "fantasy", description: "A brave climber reaching new heights", primaryColor: "#696969", secondaryColor: "#A9A9A9" },
  { name: "Ocean Diver", slug: "ocean-diver", category: "fantasy", description: "An underwater explorer discovering sea wonders", primaryColor: "#006994", secondaryColor: "#00A5CF" },
  
  // Everyday Heroes (6)
  { name: "Super Chef", slug: "super-chef", category: "everyday", description: "A creative chef who loves cooking and sharing meals", primaryColor: "#DC143C", secondaryColor: "#FF6B6B" },
  { name: "Artist Bee", slug: "artist-bee", category: "everyday", description: "A buzzing artist who creates colorful masterpieces", primaryColor: "#FFD700", secondaryColor: "#FFA500" },
  { name: "Music Maestro", slug: "music-maestro", category: "everyday", description: "A musical genius who brings joy through songs", primaryColor: "#9370DB", secondaryColor: "#BA55D3" },
  { name: "Science Star", slug: "science-star", category: "everyday", description: "A curious scientist conducting amazing experiments", primaryColor: "#00CED1", secondaryColor: "#40E0D0" },
  { name: "Sport Champion", slug: "sport-champion", category: "everyday", description: "An athletic champion who loves teamwork and fair play", primaryColor: "#FF4500", secondaryColor: "#FF6347" },
  { name: "Book Buddy", slug: "book-buddy", category: "everyday", description: "A bookworm who loves reading and sharing stories", primaryColor: "#8B4513", secondaryColor: "#A0522D" },
];

const EXPRESSIONS = ['neutral', 'happy', 'thinking', 'excited'] as const;

async function generateAvatarImage(character: Character, expression: typeof EXPRESSIONS[number]): Promise<string> {
  const expressionDescriptions = {
    neutral: "calm, friendly, welcoming expression with gentle smile",
    happy: "big joyful smile, bright sparkling eyes, enthusiastic and delighted",
    thinking: "thoughtful expression, one eyebrow raised, curious and pondering",
    excited: "wide excited eyes, open mouth showing surprise and energy, animated"
  };

  const prompt = `Create a high-quality Pixar-style 3D rendered character avatar: ${character.name}

Character Description: ${character.description}
Expression: ${expressionDescriptions[expression]}

Art Style Requirements:
- Professional Pixar/Disney 3D animation quality rendering
- Large, highly expressive eyes that convey emotion clearly
- Soft, rounded, friendly shapes and proportions
- Vibrant, saturated colors (primary: ${character.primaryColor}, secondary: ${character.secondaryColor})
- Soft volumetric lighting with gentle highlights and shadows
- Glossy, smooth textures with professional finish
- Studio-quality character animation appearance

Composition:
- Centered character portrait showing head and shoulders
- Character facing directly forward
- Clean composition suitable for circular avatar frame
- Professional studio lighting

Background: Soft gradient or transparent, keeping focus on character

Target Audience: Children ages 5-12 years old
Safety: Completely child-safe, friendly, non-threatening, joyful
Quality: Ultra high resolution, production-ready character asset`;

  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableApiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      modalities: ["image", "text"]
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Image generation failed: ${error}`);
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  if (!imageUrl) {
    throw new Error("No image returned from API");
  }

  return imageUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { regenerate, characterSlug } = await req.json();

    let charactersToGenerate = CHARACTERS;
    
    // If specific character requested, only generate that one
    if (characterSlug) {
      charactersToGenerate = CHARACTERS.filter(c => c.slug === characterSlug);
      if (charactersToGenerate.length === 0) {
        throw new Error(`Character ${characterSlug} not found`);
      }
    }

    const results = [];

    for (const character of charactersToGenerate) {
      console.log(`Generating avatars for ${character.name}...`);

      try {
        // Check if character already exists
        if (!regenerate) {
          const { data: existing } = await supabase
            .from("avatar_library")
            .select("id")
            .eq("character_slug", character.slug)
            .single();

          if (existing) {
            console.log(`${character.name} already exists, skipping...`);
            results.push({ character: character.name, status: "skipped", reason: "already exists" });
            continue;
          }
        }

        // Generate all 4 expressions
        const [neutralImg, happyImg, thinkingImg, excitedImg] = await Promise.all([
          generateAvatarImage(character, 'neutral'),
          generateAvatarImage(character, 'happy'),
          generateAvatarImage(character, 'thinking'),
          generateAvatarImage(character, 'excited'),
        ]);

        // Insert or update in database
        const { error } = await supabase
          .from("avatar_library")
          .upsert({
            character_name: character.name,
            character_slug: character.slug,
            category: character.category,
            description: character.description,
            avatar_neutral: neutralImg,
            avatar_happy: happyImg,
            avatar_thinking: thinkingImg,
            avatar_excited: excitedImg,
            primary_color: character.primaryColor,
            secondary_color: character.secondaryColor,
          }, {
            onConflict: 'character_slug'
          });

        if (error) throw error;

        results.push({ character: character.name, status: "success" });
        console.log(`✓ ${character.name} generated successfully`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`✗ Failed to generate ${character.name}:`, error);
        results.push({ character: character.name, status: "error", error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${results.filter(r => r.status === 'success').length}/${charactersToGenerate.length} characters`,
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
