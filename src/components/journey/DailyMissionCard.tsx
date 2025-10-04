import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MissionCompletionDialog } from "./MissionCompletionDialog";

interface DailyMissionCardProps {
  childId: string;
  personalityMode: string;
}

interface Mission {
  id: string;
  journey_id: string;
  journey_title: string;
  step_number: number;
  title: string;
  description: string | null;
  is_completed: boolean;
}

export function DailyMissionCard({ childId, personalityMode }: DailyMissionCardProps) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    loadTodaysMission();
  }, [childId]);

  const loadTodaysMission = async () => {
    try {
      // Get active journeys for this child
      const { data: journeys } = await supabase
        .from("goal_journeys")
        .select("*")
        .eq("child_id", childId)
        .eq("status", "active");

      if (!journeys || journeys.length === 0) {
        setLoading(false);
        return;
      }

      // Check schedule time - only show mission if time has passed
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const availableJourneys = journeys.filter(j => {
        if (!j.mission_schedule_time) return true;
        return currentTime >= j.mission_schedule_time;
      });

      if (availableJourneys.length === 0) {
        setLoading(false);
        return;
      }

      // Get the first active journey (prioritize by creation date)
      const activeJourney = availableJourneys[0];

      // Get the next incomplete step
      const { data: steps } = await supabase
        .from("journey_steps")
        .select("*")
        .eq("journey_id", activeJourney.id)
        .eq("is_completed", false)
        .order("step_number", { ascending: true })
        .limit(1);

      if (steps && steps.length > 0) {
        setMission({
          id: steps[0].id,
          journey_id: activeJourney.id,
          journey_title: activeJourney.title,
          step_number: steps[0].step_number,
          title: steps[0].title,
          description: steps[0].description,
          is_completed: steps[0].is_completed,
        });
      }
    } catch (error) {
      console.error("Error loading mission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!mission) return;

    try {
      // Mark step as completed
      const { error: stepError } = await supabase
        .from("journey_steps")
        .update({ 
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq("id", mission.id);

      if (stepError) throw stepError;

      // Update journey current_step
      const { error: journeyError } = await supabase
        .from("goal_journeys")
        .update({ 
          current_step: mission.step_number
        })
        .eq("id", mission.journey_id);

      if (journeyError) throw journeyError;

      // Log progress
      const { error: logError } = await supabase
        .from("journey_progress_log")
        .insert({
          journey_id: mission.journey_id,
          step_id: mission.id,
          child_id: childId,
          completed: true,
          buddy_message: getEncouragementMessage(),
        });

      if (logError) throw logError;

      setShowCompletion(true);
    } catch (error) {
      console.error("Error completing mission:", error);
      toast.error("Failed to complete mission");
    }
  };

  const getEncouragementMessage = () => {
    if (personalityMode === "curious_explorer") {
      return "Amazing work! You're building such a cool habit! 🚀";
    } else {
      return "I'm so proud of you. That was really thoughtful. 💙";
    }
  };

  const getHeaderText = () => {
    if (personalityMode === "curious_explorer") {
      return "Wow! Today's adventure is... 🌟";
    } else {
      return "Here's something kind we can do today... 💙";
    }
  };

  if (loading) {
    return null;
  }

  if (!mission) {
    return null;
  }

  if (mission.is_completed) {
    return null;
  }

  return (
    <>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 mb-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <CardTitle className="text-base">{getHeaderText()}</CardTitle>
              <CardDescription className="text-xs">
                {mission.journey_title} - Day {mission.step_number}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">{mission.title}</h4>
            {mission.description && (
              <p className="text-sm text-muted-foreground">{mission.description}</p>
            )}
          </div>
          <Button 
            onClick={handleComplete}
            className="w-full"
            size="lg"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        </CardContent>
      </Card>

      {showCompletion && (
        <MissionCompletionDialog
          missionTitle={mission.title}
          personalityMode={personalityMode}
          onClose={() => {
            setShowCompletion(false);
            loadTodaysMission();
          }}
        />
      )}
    </>
  );
}
