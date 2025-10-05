import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvatarLibraryItem {
  id: string;
  character_name: string;
  character_slug: string;
  category: 'animal' | 'fantasy' | 'everyday';
  description: string;
  avatar_neutral: string;
  avatar_happy: string;
  avatar_thinking: string;
  avatar_excited: string;
  primary_color: string;
  secondary_color: string;
}

export function useAvatarLibrary(category?: string) {
  return useQuery({
    queryKey: ["avatar-library", category],
    queryFn: async () => {
      let query = supabase
        .from("avatar_library")
        .select("*")
        .order("character_name");

      if (category && category !== 'all') {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AvatarLibraryItem[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - avatars don't change often
  });
}
