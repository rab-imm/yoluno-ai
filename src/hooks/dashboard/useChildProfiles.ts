import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  custom_avatar_url?: string;
  avatar_library_id?: string;
  use_library_avatar?: boolean;
  personality_mode: string;
  streak_days: number;
  last_chat_date?: string;
  created_at: string;
  updated_at: string;
}

export function useChildProfiles() {
  const queryClient = useQueryClient();

  const { data: children = [], isLoading, error } = useQuery({
    queryKey: ["child-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("child_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ChildProfile[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refreshProfiles = () => {
    queryClient.invalidateQueries({ queryKey: ["child-profiles"] });
  };

  return {
    children,
    isLoading,
    error,
    refreshProfiles,
  };
}
