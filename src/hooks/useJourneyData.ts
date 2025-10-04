import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ActiveJourney {
  id: string;
  title: string;
  current_step: number;
  total_steps: number;
  journey_category: string;
  reward_type: string;
}

export function useJourneyData(childId: string) {
  const [activeJourneys, setActiveJourneys] = useState<ActiveJourney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      loadJourneys();
    }
  }, [childId]);

  const loadJourneys = async () => {
    try {
      const { data, error } = await supabase
        .from("goal_journeys")
        .select("id, title, current_step, total_steps, journey_category, reward_type")
        .eq("child_id", childId)
        .eq("status", "active");

      if (error) throw error;
      setActiveJourneys(data || []);
    } catch (error) {
      console.error("Error loading journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    activeJourneys,
    loading,
    refreshJourneys: loadJourneys,
  };
}
