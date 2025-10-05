import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivitySummary {
  totalMessages: number;
  totalStories: number;
  activeJourneys: number;
  streakDays: number;
  lastActive: string | null;
}

export function useChildActivities(childId: string) {
  return useQuery({
    queryKey: ["child-activities", childId],
    queryFn: async (): Promise<ActivitySummary> => {
      const [messagesResult, storiesResult, journeysResult, profileResult] = 
        await Promise.all([
          supabase
            .from("chat_messages")
            .select("id", { count: "exact", head: true })
            .eq("child_id", childId)
            .eq("role", "user"),
          supabase
            .from("child_stories")
            .select("id", { count: "exact", head: true })
            .eq("child_id", childId),
          supabase
            .from("goal_journeys")
            .select("id", { count: "exact", head: true })
            .eq("child_id", childId)
            .eq("status", "active"),
          supabase
            .from("child_profiles")
            .select("streak_days, last_chat_date")
            .eq("id", childId)
            .single(),
        ]);

      return {
        totalMessages: messagesResult.count || 0,
        totalStories: storiesResult.count || 0,
        activeJourneys: journeysResult.count || 0,
        streakDays: profileResult.data?.streak_days || 0,
        lastActive: profileResult.data?.last_chat_date || null,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!childId,
  });
}
