import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Flame, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface JourneyProgressWidgetProps {
  childId: string;
}

interface JourneyProgress {
  id: string;
  title: string;
  current_step: number;
  total_steps: number;
  journey_category: string;
}

export function JourneyProgressWidget({ childId }: JourneyProgressWidgetProps) {
  const [journeys, setJourneys] = useState<JourneyProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, [childId]);

  const loadJourneys = async () => {
    try {
      const { data } = await supabase
        .from("goal_journeys")
        .select("id, title, current_step, total_steps, journey_category")
        .eq("child_id", childId)
        .eq("status", "active");

      setJourneys(data || []);
    } catch (error) {
      console.error("Error loading journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      social: "💝",
      academic: "📚",
      health: "💪",
      creativity: "🎨",
      routine: "🌅",
    };
    return emojiMap[category] || "🎯";
  };

  if (loading || journeys.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {journeys.map((journey) => {
        const progress = (journey.current_step / journey.total_steps) * 100;
        
        return (
          <Card key={journey.id} className="bg-muted/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getCategoryEmoji(journey.journey_category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{journey.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {journey.current_step} / {journey.total_steps} steps
                  </p>
                </div>
                {journey.current_step > 0 && (
                  <Flame className="h-4 w-4 text-orange-500 flex-shrink-0" />
                )}
              </div>
              <Progress value={progress} className="h-1.5" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
