import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export interface ActivityItem {
  id: string;
  type: "story" | "message" | "journey" | "badge";
  childName: string;
  description: string;
  timestamp: string;
  icon: string;
  relativeTime: string;
}

export function useGlobalActivity() {
  return useQuery({
    queryKey: ["global-activity"],
    queryFn: async (): Promise<ActivityItem[]> => {
      // Fetch all activity types in parallel instead of sequentially
      const [storiesResult, badgesResult, journeyLogsResult] = await Promise.all([
        supabase
          .from("child_stories")
          .select("id, title, created_at, child_id, child_profiles(name)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("child_badges")
          .select("id, badge_name, earned_at, child_id, child_profiles(name)")
          .order("earned_at", { ascending: false })
          .limit(10),
        supabase
          .from("journey_progress_log")
          .select("id, logged_at, completed, child_id, child_profiles(name), journey_steps(title)")
          .eq("completed", true)
          .order("logged_at", { ascending: false })
          .limit(10),
      ]);

      const activities: ActivityItem[] = [];

      // Process stories
      if (storiesResult.data) {
        storiesResult.data.forEach((story) => {
          activities.push({
            id: story.id,
            type: "story",
            childName: (story.child_profiles as any)?.name || "Unknown",
            description: `Completed the story "${story.title}"`,
            timestamp: story.created_at,
            icon: "📖",
            relativeTime: formatDistanceToNow(new Date(story.created_at), { addSuffix: true }),
          });
        });
      }

      // Process badges
      if (badgesResult.data) {
        badgesResult.data.forEach((badge) => {
          activities.push({
            id: badge.id,
            type: "badge",
            childName: (badge.child_profiles as any)?.name || "Unknown",
            description: `Earned the "${badge.badge_name}" badge`,
            timestamp: badge.earned_at,
            icon: "🏆",
            relativeTime: formatDistanceToNow(new Date(badge.earned_at), { addSuffix: true }),
          });
        });
      }

      // Process journey progress
      if (journeyLogsResult.data) {
        journeyLogsResult.data.forEach((log) => {
          activities.push({
            id: log.id,
            type: "journey",
            childName: (log.child_profiles as any)?.name || "Unknown",
            description: `Completed mission: ${(log.journey_steps as any)?.title || "Daily task"}`,
            timestamp: log.logged_at,
            icon: "🎯",
            relativeTime: formatDistanceToNow(new Date(log.logged_at), { addSuffix: true }),
          });
        });
      }

      // Sort all activities by timestamp and limit to 10
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    staleTime: 3 * 60 * 1000, // 3 minutes - increased cache time
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
