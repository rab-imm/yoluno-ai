import { useState, useEffect } from "react";
import { StoryWizard, StoryWizardData } from "./StoryWizard";
import { StoryPreview } from "./StoryPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStoryUsage } from "@/hooks/useStoryUsage";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      // Step 1: Generate story text and scenes
      toast.info("Creating your story... ✨");
      const { data: storyData, error: storyError } = await supabase.functions.invoke("generate-enhanced-story", {
        body: {
          childId,
          childName,
          childAge,
          theme: data.theme,
          characters: data.characters,
          mood: data.mood,
          values: data.values,
          storyLength: data.storyLength,
        },
      });

      if (storyError) throw storyError;
      setGeneratedStory(storyData);

      // Step 2: Generate illustrations if we have scenes
      if (storyData.scenes && storyData.scenes.length > 0) {
        toast.info("Drawing magical illustrations... 🎨");
        const { data: illustrationsData, error: illustrationsError } = await supabase.functions.invoke("generate-story-illustrations", {
          body: {
            scenes: storyData.scenes,
            illustrationStyle: data.illustrationStyle,
            childAge,
          },
        });

        if (illustrationsError) throw illustrationsError;
        setIllustrations(illustrationsData.illustrations || []);
      }

      // Step 3: Generate narration
      toast.info("Recording the narration... 🎙️");
      const { data: narrationData, error: narrationError } = await supabase.functions.invoke("generate-story-narration", {
        body: {
          storyText: storyData.content,
          voice: data.narrationVoice,
        },
      });

      if (narrationError) throw narrationError;
      setAudioContent(narrationData.audioContent);
      setAudioDuration(narrationData.duration);

      toast.success("Story ready! 🎉");
      
      // Increment usage count
      try {
        await incrementUsage();
      } catch (error) {
        console.error("Failed to update usage:", error);
      }

      setStage("preview");
    } catch (error: any) {
      console.error("Story generation error:", error);
      toast.error("Failed to generate story. Please try again!");
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
      <Card className="w-full max-w-3xl mx-auto p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        </div>
      </Card>
    );
  }

  if (stage === "limit-reached") {
    return (
      <Card className="w-full max-w-3xl mx-auto p-8">
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
      <div className="space-y-4">
        {/* Usage indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {usage.count} of {usage.limit === Infinity ? "unlimited" : usage.limit} stories created this month
        </div>
        <StoryWizard
          childId={childId}
          childName={childName}
          childAge={childAge}
          onComplete={handleWizardComplete}
          onCancel={onComplete}
        />
      </div>
    );
  }

  if (stage === "generating") {
    return (
      <Card className="w-full max-w-3xl mx-auto p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <Loader2 
            className="w-16 h-16 animate-spin" 
            style={{ color: 'hsl(var(--story-magic))' }}
          />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Creating Your Magical Story</h3>
            <p className="text-muted-foreground">
              Writing the story, drawing illustrations, and recording narration...
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
