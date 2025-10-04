import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { JourneyTemplateSelector } from "./JourneyTemplateSelector";

interface JourneyWizardProps {
  childId: string;
  childName: string;
  childAge: number;
  onComplete: () => void;
}

type WizardStep = "template" | "customize" | "schedule" | "review";

export function JourneyWizard({ childId, childName, childAge, onComplete }: JourneyWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [rewardType, setRewardType] = useState<"story_reinforcement" | "badge" | "custom">("story_reinforcement");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [allowSharing, setAllowSharing] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setTitle(template.name);
    setDescription(template.description);
    setDuration(template.duration_days.toString());
    
    // Parse template steps
    const templateSteps = Array.isArray(template.steps_template) 
      ? template.steps_template 
      : JSON.parse(template.steps_template || "[]");
    setSteps(templateSteps);
    
    setCurrentStep("customize");
  };

  const validatePositiveFraming = (text: string): boolean => {
    const negativeWords = ["don't", "dont", "stop", "avoid", "quit", "never"];
    const lowerText = text.toLowerCase();
    return !negativeWords.some(word => lowerText.includes(word));
  };

  const handleCreateJourney = async () => {
    if (!validatePositiveFraming(title) || steps.some(s => !validatePositiveFraming(s.title))) {
      toast.error("Please use positive framing only (no 'don't', 'stop', etc.)");
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create journey
      const { data: journey, error: journeyError } = await supabase
        .from("goal_journeys")
        .insert({
          parent_id: user.id,
          child_id: childId,
          title,
          description,
          goal_type: "habit",
          journey_category: selectedTemplate?.category || "routine",
          duration_days: parseInt(duration),
          total_steps: steps.length,
          reward_type: rewardType,
          mission_schedule_time: scheduleTime,
          allow_sharing: allowSharing,
        })
        .select()
        .single();

      if (journeyError) throw journeyError;

      // Create steps
      const stepsToInsert = steps.slice(0, parseInt(duration)).map((step, index) => ({
        journey_id: journey.id,
        step_number: index + 1,
        title: step.title,
        description: step.description,
      }));

      const { error: stepsError } = await supabase
        .from("journey_steps")
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      onComplete();
    } catch (error) {
      console.error("Error creating journey:", error);
      toast.error("Failed to create journey");
    } finally {
      setCreating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "template":
        return (
          <JourneyTemplateSelector
            childAge={childAge}
            onSelect={handleTemplateSelect}
          />
        );

      case "customize":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Journey Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 30 Days of Kindness"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will this journey help your child achieve?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="10">10 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="100">100 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Reward Type</Label>
              <Select value={rewardType} onValueChange={(v: any) => setRewardType(v)}>
                <SelectTrigger id="reward">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="story_reinforcement">Story Reinforcement</SelectItem>
                  <SelectItem value="badge">Badge Collection</SelectItem>
                  <SelectItem value="custom">Custom Reward</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {rewardType === "story_reinforcement" && "Habits woven into bedtime stories"}
                {rewardType === "badge" && "Unlock special badges for milestones"}
                {rewardType === "custom" && "Set your own rewards"}
              </p>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schedule-time">When should Buddy show the daily mission?</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Mission will appear in {childName}'s app after this time each day
              </p>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="sharing">Share with community</Label>
                <p className="text-xs text-muted-foreground">
                  Allow other families to use this journey template
                </p>
              </div>
              <Switch
                id="sharing"
                checked={allowSharing}
                onCheckedChange={setAllowSharing}
              />
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Journey Summary</h4>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Title:</dt>
                  <dd className="font-medium">{title}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Duration:</dt>
                  <dd className="font-medium">{duration} days</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Daily missions:</dt>
                  <dd className="font-medium">{Math.min(steps.length, parseInt(duration))}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Reward type:</dt>
                  <dd className="font-medium capitalize">{rewardType.replace("_", " ")}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Mission time:</dt>
                  <dd className="font-medium">{scheduleTime}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="font-semibold mb-2">First 3 Missions Preview</h4>
              <div className="space-y-2">
                {steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">Day {index + 1}: {step.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Create Goal Journey for {childName}</h2>
          <p className="text-sm text-muted-foreground">
            Step {currentStep === "template" ? 1 : currentStep === "customize" ? 2 : currentStep === "schedule" ? 3 : 4} of 4
          </p>
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep === "customize") setCurrentStep("template");
            else if (currentStep === "schedule") setCurrentStep("customize");
            else if (currentStep === "review") setCurrentStep("schedule");
          }}
          disabled={currentStep === "template" || creating}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={() => {
            if (currentStep === "customize") setCurrentStep("schedule");
            else if (currentStep === "schedule") setCurrentStep("review");
            else if (currentStep === "review") handleCreateJourney();
          }}
          disabled={
            currentStep === "template" || 
            (currentStep === "customize" && !title) ||
            creating
          }
        >
          {currentStep === "review" ? (
            creating ? "Creating..." : "Create Journey"
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
