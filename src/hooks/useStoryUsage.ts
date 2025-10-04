import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StoryUsage {
  count: number;
  limit: number;
  tier: "free" | "standard" | "premium";
  canCreate: boolean;
}

export function useStoryUsage(parentId: string) {
  const [usage, setUsage] = useState<StoryUsage>({
    count: 0,
    limit: 2,
    tier: "free",
    canCreate: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, [parentId]);

  const loadUsage = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      // Get or create usage record for current month
      const { data: existingUsage } = await supabase
        .from("story_usage")
        .select("*")
        .eq("parent_id", parentId)
        .eq("month", currentMonth)
        .single();

      let usageData = existingUsage;

      if (!usageData) {
        // Create new usage record for this month
        const { data: newUsage } = await supabase
          .from("story_usage")
          .insert({
            parent_id: parentId,
            month: currentMonth,
            story_count: 0,
            tier: "free", // Default tier
          })
          .select()
          .single();

        usageData = newUsage;
      }

      if (usageData) {
        const tierLimits = {
          free: 2,
          standard: 10,
          premium: Infinity,
        };

        const tierKey = (usageData.tier || "free") as "free" | "standard" | "premium";
        const limit = tierLimits[tierKey] || 2;
        const canCreate = usageData.story_count < limit;

        setUsage({
          count: usageData.story_count,
          limit,
          tier: tierKey,
          canCreate,
        });
      }
    } catch (error) {
      console.error("Error loading story usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);

      const { error } = await supabase
        .from("story_usage")
        .update({ story_count: usage.count + 1 })
        .eq("parent_id", parentId)
        .eq("month", currentMonth);

      if (error) throw error;

      await loadUsage(); // Refresh usage data
    } catch (error) {
      console.error("Error incrementing usage:", error);
      throw error;
    }
  };

  return {
    usage,
    loading,
    incrementUsage,
    refreshUsage: loadUsage,
  };
}
