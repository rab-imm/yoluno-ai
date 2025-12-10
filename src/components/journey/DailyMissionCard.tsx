import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleError } from "@/lib/errors";
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
      handleError(error, {
        strategy: 'log',
        context: 'DailyMissionCard.loadTodaysMission'
      });
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

      // Trigger confetti celebration
      if (logError) throw logError;

      // Award journey badges
      await supabase.rpc("check_and_award_journey_badges", { p_child_id: childId });

      setShowCompletion(true);
    } catch (error) {
      handleError(error, {
        userMessage: "Failed to complete mission",
        context: 'DailyMissionCard.handleComplete'
      });
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
      <Card className="relative border-0 overflow-hidden animate-scale-in shadow-xl">
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-child-primary via-child-secondary to-child-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] opacity-40" 
             style={{ 
               padding: '3px',
               mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               maskComposite: 'exclude'
             }} 
        />
        
        {/* TODAY'S MISSION badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-child-primary to-child-secondary px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            <span className="text-white text-xs font-bold">🎯 TODAY'S MISSION!</span>
          </div>
        </div>

        {/* Card content with gradient background */}
        <div className="relative bg-gradient-to-br from-child-primary/10 via-child-secondary/5 to-background p-5 md:p-8">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-child-primary animate-pulse" />
              </div>
              <div className="flex-1 pr-20">
                <CardTitle className="text-lg md:text-xl mb-1 flex items-center gap-2">
                  {getHeaderText()}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground">
                  {mission.journey_title} - Day {mission.step_number}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-5">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-child-primary/20">
              <h4 className="font-bold text-xl md:text-2xl mb-2 text-foreground flex items-center gap-2">
                ⭐ {mission.title}
              </h4>
              {mission.description && (
                <p className="text-base text-muted-foreground leading-relaxed">{mission.description}</p>
              )}
            </div>
            
            <Button 
              onClick={handleComplete}
              className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-child-primary to-child-secondary hover:from-child-primary/90 hover:to-child-secondary/90 text-white border-0"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Mark Complete
            </Button>
          </CardContent>
        </div>
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
