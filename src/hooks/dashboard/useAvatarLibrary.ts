import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { avatarCache } from "@/lib/avatarCache";

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
      // Try IndexedDB cache first
      const cachedData = category && category !== 'all' 
        ? await avatarCache.getByCategory(category)
        : await avatarCache.getAll();

      if (cachedData && cachedData.length > 0) {
        console.log('✓ Loaded avatars from IndexedDB cache');
        return cachedData as AvatarLibraryItem[];
      }

      // Fetch from Supabase if cache miss
      let query = supabase
        .from("avatar_library")
        .select("*")
        .order("character_name");

      if (category && category !== 'all') {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Store in IndexedDB for next time
      if (data && data.length > 0) {
        await avatarCache.setAll(data);
        console.log('✓ Cached avatars to IndexedDB');
      }

      return data as AvatarLibraryItem[];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - avatars rarely change
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days - keep in memory
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });
}
