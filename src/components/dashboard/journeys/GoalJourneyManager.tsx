import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Calendar, Share2, Play, Pause, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { JourneyWizard } from "./JourneyWizard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { JourneyProgressDashboard } from "./JourneyProgressDashboard";

interface Journey {
  id: string;
  title: string;
  journey_category: string;
  current_step: number;
  total_steps: number;
  status: string;
  reward_type: string;
  mission_schedule_time: string | null;
  allow_sharing: boolean;
  created_at: string;
}

interface GoalJourneyManagerProps {
  childId: string;
  childName: string;
  childAge: number;
}

export function GoalJourneyManager({ childId, childName, childAge }: GoalJourneyManagerProps) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

  useEffect(() => {
    loadJourneys();
  }, [childId]);

  const loadJourneys = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("goal_journeys")
        .select("*")
        .eq("child_id", childId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJourneys(data || []);
    } catch (error) {
      console.error("Error loading journeys:", error);
      toast.error("Failed to load journeys");
    } finally {
      setLoading(false);
    }
  };

  const toggleJourneyStatus = async (journeyId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      const { error } = await supabase
        .from("goal_journeys")
        .update({ status: newStatus })
        .eq("id", journeyId);

      if (error) throw error;
      
      toast.success(`Journey ${newStatus === "active" ? "resumed" : "paused"}`);
      loadJourneys();
    } catch (error) {
      console.error("Error updating journey:", error);
      toast.error("Failed to update journey");
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

  if (loading) {
    return <div className="animate-pulse">Loading journeys...</div>;
  }

  if (selectedJourneyId) {
    return (
      <JourneyProgressDashboard
        journeyId={selectedJourneyId}
        childName={childName}
        onBack={() => setSelectedJourneyId(null)}
        onRefresh={loadJourneys}
      />
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Goal Journeys for {childName}</h3>
            <p className="text-sm text-muted-foreground">
              Build habits and reach milestones, one fun step at a time
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = "/marketplace"}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Browse More
            </Button>
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Journey
            </Button>
          </div>
        </div>

      {journeys.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <Target className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h4 className="font-semibold mb-2">No journeys yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first journey to help {childName} build positive habits
              </p>
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {journeys.map((journey) => {
            const progress = (journey.current_step / journey.total_steps) * 100;
            const isActive = journey.status === "active";
            const isCompleted = journey.status === "completed";

            return (
              <Card 
                key={journey.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedJourneyId(journey.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryEmoji(journey.journey_category)}</span>
                      <div>
                        <CardTitle className="text-lg">{journey.title}</CardTitle>
                        <CardDescription className="capitalize">
                          {journey.journey_category} • {journey.reward_type.replace("_", " ")}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={isCompleted ? "default" : isActive ? "secondary" : "outline"}>
                      {journey.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {journey.current_step} / {journey.total_steps} steps
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {journey.mission_schedule_time && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{journey.mission_schedule_time}</span>
                        </div>
                      )}
                      {journey.allow_sharing && (
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          <span>Shared</span>
                        </div>
                      )}
                    </div>
                    {!isCompleted && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleJourneyStatus(journey.id, journey.status);
                        }}
                      >
                        {isActive ? (
                          <><Pause className="h-3 w-3 mr-1" /> Pause</>
                        ) : (
                          <><Play className="h-3 w-3 mr-1" /> Resume</>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <JourneyWizard
            childId={childId}
            childName={childName}
            childAge={childAge}
            onComplete={() => {
              setShowWizard(false);
              loadJourneys();
              toast.success("Journey created! 🎉");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
