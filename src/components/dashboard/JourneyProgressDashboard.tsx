import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Play, Pause, CheckCircle2, Circle, Calendar, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { JourneyReflectionPrompt } from "./JourneyReflectionPrompt";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface JourneyProgressDashboardProps {
  journeyId: string;
  childName: string;
  onBack: () => void;
  onRefresh: () => void;
}

interface Journey {
  id: string;
  title: string;
  description: string | null;
  current_step: number;
  total_steps: number;
  status: string;
  reward_type: string;
  created_at: string;
}

interface Step {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  reflection: string | null;
}

export function JourneyProgressDashboard({
  journeyId,
  childName,
  onBack,
  onRefresh,
}: JourneyProgressDashboardProps) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    loadJourneyData();
  }, [journeyId]);

  const loadJourneyData = async () => {
    try {
      const { data: journeyData, error: journeyError } = await supabase
        .from("goal_journeys")
        .select("*")
        .eq("id", journeyId)
        .single();

      if (journeyError) throw journeyError;
      setJourney(journeyData);

      const { data: stepsData, error: stepsError } = await supabase
        .from("journey_steps")
        .select("*")
        .eq("journey_id", journeyId)
        .order("step_number", { ascending: true });

      if (stepsError) throw stepsError;
      setSteps(stepsData || []);
    } catch (error) {
      console.error("Error loading journey:", error);
      toast.error("Failed to load journey details");
    } finally {
      setLoading(false);
    }
  };

  const toggleJourneyStatus = async () => {
    if (!journey) return;

    try {
      const newStatus = journey.status === "active" ? "paused" : "active";
      const { error } = await supabase
        .from("goal_journeys")
        .update({ status: newStatus })
        .eq("id", journeyId);

      if (error) throw error;
      
      toast.success(`Journey ${newStatus === "active" ? "resumed" : "paused"}`);
      loadJourneyData();
    } catch (error) {
      console.error("Error updating journey:", error);
      toast.error("Failed to update journey");
    }
  };

  const deleteJourney = async () => {
    try {
      const { error } = await supabase
        .from("goal_journeys")
        .delete()
        .eq("id", journeyId);

      if (error) throw error;
      
      toast.success("Journey deleted");
      onRefresh();
      onBack();
    } catch (error) {
      console.error("Error deleting journey:", error);
      toast.error("Failed to delete journey");
    }
  };

  if (loading || !journey) {
    return <div className="animate-pulse">Loading journey...</div>;
  }

  const progress = (journey.current_step / journey.total_steps) * 100;
  const completedSteps = steps.filter((s) => s.is_completed).length;
  const stepsWithReflections = steps.filter((s) => s.reflection).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journeys
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleJourneyStatus}>
            {journey.status === "active" ? (
              <><Pause className="h-4 w-4 mr-2" /> Pause Journey</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Resume Journey</>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Journey?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this journey and all its progress. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteJourney}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{journey.title}</CardTitle>
          <CardDescription>
            {journey.description || `Journey for ${childName}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">{Math.round(progress)}%</p>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedSteps} / {journey.total_steps}</p>
              <p className="text-xs text-muted-foreground">steps</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reflections</p>
              <p className="text-2xl font-bold">{stepsWithReflections}</p>
              <p className="text-xs text-muted-foreground">recorded</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Ask {childName} to reflect</p>
              <p className="text-sm text-muted-foreground">
                Buddy will prompt them about their journey progress
              </p>
            </div>
            <Button onClick={() => setShowReflection(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Prompt
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journey Steps</CardTitle>
          <CardDescription>
            Track {childName}'s progress through each mission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border ${
                    step.is_completed ? "bg-muted/50" : "bg-background"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {step.is_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            Day {step.step_number}: {step.title}
                          </p>
                          {step.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.description}
                            </p>
                          )}
                        </div>
                        {step.is_completed && (
                          <Badge variant="secondary" className="ml-2">
                            Complete
                          </Badge>
                        )}
                      </div>

                      {step.completed_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Completed {new Date(step.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {step.reflection && (
                        <div className="p-3 bg-background rounded border mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Reflection:
                          </p>
                          <p className="text-sm italic">"{step.reflection}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {showReflection && (
        <JourneyReflectionPrompt
          journeyId={journeyId}
          childName={childName}
          onClose={() => setShowReflection(false)}
        />
      )}
    </div>
  );
}
