import { useState, useEffect } from "react";
import { StoryWizard, StoryWizardData } from "./StoryWizard";
import { StoryPreview } from "./StoryPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStoryUsage } from "@/hooks/useStoryUsage";
import { Button } from "@/components/ui/button";
import { AlertCircle, Library } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoriesLibrary } from "./StoriesLibrary";

interface EnhancedStoryBuilderProps {
  childId: string;
  childName: string;
  childAge: number;
  onComplete: () => void;
}

export function EnhancedStoryBuilder({ childId, childName, childAge, onComplete }: EnhancedStoryBuilderProps) {
  const [stage, setStage] = useState<"wizard" | "generating" | "preview" | "limit-reached">("wizard");
  const [wizardData, setWizardData] = useState<StoryWizardData | null>(null);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [illustrations, setIllustrations] = useState<any[]>([]);
  const [audioContent, setAudioContent] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [parentId, setParentId] = useState<string>("");
  const [showLibrary, setShowLibrary] = useState(false);
  const { usage, loading: usageLoading, incrementUsage } = useStoryUsage(parentId);

  useEffect(() => {
    loadParentId();
  }, []);

  const loadParentId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setParentId(user.id);
    }
  };

  const handleWizardComplete = async (data: StoryWizardData) => {
    // Check usage limits
    if (!usage.canCreate) {
      setStage("limit-reached");
      return;
    }

    setWizardData(data);
    setStage("generating");
    await generateStory(data);
  };

  const generateStory = async (data: StoryWizardData) => {
    try {
      // Check for active journeys with story reinforcement
      const { data: activeJourneys } = await supabase
        .from("goal_journeys")
        .select("*, journey_steps!inner(*)")
        .eq("child_id", childId)
        .eq("status", "active")
        .eq("reward_type", "story_reinforcement")
        .eq("journey_steps.is_completed", false)
        .order("journey_steps.step_number", { ascending: true })
        .limit(1);

      let modifiedPrompt = data.theme;
      
      // If there's an active journey with story reinforcement, inject the habit
      if (activeJourneys && activeJourneys.length > 0) {
        const journey = activeJourneys[0];
        const nextStep = journey.journey_steps?.[0];
        
        if (nextStep) {
          toast.info("Adding your journey mission to the story... 🌟");
          
          const { data: habitData } = await supabase.functions.invoke("inject-habit-into-story", {
            body: {
              storyPrompt: data.theme,
              habitTitle: nextStep.title,
              personalityMode: data.mood || "curious_explorer",
            },
          });
          
          if (habitData?.modifiedPrompt) {
            modifiedPrompt = habitData.modifiedPrompt;
          }
        }
      }

      // Step 1: Generate story text and scenes
      toast.info("Writing your magical story... ✨", { duration: 5000 });
      const { data: storyData, error: storyError } = await supabase.functions.invoke("generate-enhanced-story", {
        body: {
          childId,
          childName,
          childAge,
          theme: modifiedPrompt,
          characters: data.characters,
          mood: data.mood,
          values: data.values,
          storyLength: data.storyLength,
        },
      });

      if (storyError) {
        console.error("Story generation error:", storyError);
        throw new Error("Failed to generate story text");
      }
      
      if (!storyData || !storyData.content) {
        throw new Error("Invalid story data received");
      }
      
      console.log("Story generated:", {
        title: storyData.title,
        wordCount: storyData.content.split(/\s+/).length,
        scenes: storyData.scenes?.length || 0
      });
      
      setGeneratedStory(storyData);
      toast.success("Story written! Now creating illustrations... 🎨");

      // Step 2: Generate illustrations if we have scenes
      let generatedIllustrations = [];
      if (storyData.scenes && storyData.scenes.length > 0) {
        toast.info(`Drawing ${storyData.scenes.length} magical illustrations... 🎨`, { duration: 8000 });
        
        try {
          const { data: illustrationsData, error: illustrationsError } = await supabase.functions.invoke("generate-story-illustrations", {
            body: {
              scenes: storyData.scenes,
              illustrationStyle: data.illustrationStyle,
              childAge,
            },
          });

          if (illustrationsError) {
            console.error("Illustrations error:", illustrationsError);
            toast.warning("Story ready! Illustrations may take a moment...");
          } else {
            generatedIllustrations = illustrationsData.illustrations || [];
            console.log("Illustrations generated:", generatedIllustrations.length);
            
            const failedCount = generatedIllustrations.filter((i: any) => i.error).length;
            if (failedCount > 0) {
              toast.info(`${generatedIllustrations.length - failedCount} illustrations ready!`);
            } else {
              toast.success("All illustrations created! 🎨");
            }
          }
        } catch (illustrationError) {
          console.error("Illustration generation failed:", illustrationError);
          toast.warning("Story ready! Illustrations couldn't be generated.");
        }
        
        setIllustrations(generatedIllustrations);
      }

      // Step 3: Generate narration
      toast.info("Recording the narration... 🎙️", { duration: 5000 });
      
      try {
        const { data: narrationData, error: narrationError } = await supabase.functions.invoke("generate-story-narration", {
          body: {
            storyText: storyData.content,
            voice: data.narrationVoice,
          },
        });

        if (narrationError) {
          console.error("Narration error:", narrationError);
          toast.warning("Story and illustrations ready! Narration couldn't be generated.");
        } else {
          setAudioContent(narrationData.audioContent);
          setAudioDuration(narrationData.duration);
          toast.success("Narration recorded! 🎙️");
        }
      } catch (narrationError) {
        console.error("Narration generation failed:", narrationError);
        toast.warning("Story ready without audio!");
      }

      toast.success("Your magical story is ready! 🎉");
      
      // Increment usage count
      try {
        await incrementUsage();
      } catch (error) {
        console.error("Failed to update usage:", error);
      }

      setStage("preview");
    } catch (error: any) {
      console.error("Story generation error:", error);
      toast.error(error.message || "Failed to generate story. Please try again!");
      setStage("wizard");
    }
  };

  const handleRegenerate = async () => {
    if (!wizardData) return;
    setStage("generating");
    await generateStory(wizardData);
  };

  if (usageLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto p-6 md:p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        </div>
      </Card>
    );
  }

  if (stage === "limit-reached") {
    return (
      <Card className="w-full max-w-3xl mx-auto p-4 md:p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Story Limit Reached</AlertTitle>
          <AlertDescription>
            You've created {usage.count} of {usage.limit === Infinity ? "unlimited" : usage.limit} stories this month on the {usage.tier} plan.
            {usage.tier === "free" && (
              <div className="mt-4">
                <p className="mb-2">Upgrade to create more magical bedtime stories:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Standard Plan ($15/mo): 10 stories/month + multiple voices</li>
                  <li>Premium Plan ($25/mo): Unlimited stories + all features</li>
                </ul>
              </div>
            )}
            {usage.tier === "standard" && (
              <div className="mt-4">
                <p>Upgrade to Premium ($25/mo) for unlimited stories and all premium features!</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2 mt-6">
          <Button onClick={onComplete} variant="outline" className="flex-1">
            Go Back
          </Button>
          <Button 
            className="flex-1"
            style={{ 
              backgroundColor: 'hsl(var(--story-magic))',
              color: 'white'
            }}
          >
            Upgrade Plan
          </Button>
        </div>
      </Card>
    );
  }

  if (stage === "wizard") {
    return (
      <>
        <div className="space-y-4">
          {/* Header with Library button */}
          <div className="flex items-center justify-between">
            <div className="text-center text-sm text-muted-foreground flex-1">
              {usage.count} of {usage.limit === Infinity ? "unlimited" : usage.limit} stories created this month
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLibrary(true)}
              className="flex items-center gap-2"
            >
              <Library className="w-4 h-4" />
              My Stories
            </Button>
          </div>
          <StoryWizard
            childId={childId}
            childName={childName}
            childAge={childAge}
            onComplete={handleWizardComplete}
            onCancel={onComplete}
          />
        </div>

        {/* Stories Library Dialog */}
        <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">My Story Collection</DialogTitle>
            </DialogHeader>
            <StoriesLibrary childId={childId} childName={childName} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (stage === "generating") {
    return (
      <Card className="w-full max-w-3xl mx-auto p-6 md:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
          <Loader2 
            className="w-12 h-12 md:w-16 md:h-16 animate-spin" 
            style={{ color: 'hsl(var(--story-magic))' }}
          />
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-xl md:text-2xl font-bold">Creating Your Magical Story</h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                ✍️ Writing the story with {wizardData?.characters.length || 0} characters
              </p>
              <p className="flex items-center justify-center gap-2">
                🎨 Drawing magical illustrations
              </p>
              <p className="flex items-center justify-center gap-2">
                🎙️ Recording narration
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This may take 30-60 seconds...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (stage === "preview" && generatedStory && wizardData) {
    return (
      <StoryPreview
        childId={childId}
        storyData={generatedStory}
        illustrations={illustrations}
        audioContent={audioContent}
        audioDuration={audioDuration}
        wizardSettings={wizardData}
        onRegenerate={handleRegenerate}
        onSendToBedtime={onComplete}
      />
    );
  }

  return null;
}
