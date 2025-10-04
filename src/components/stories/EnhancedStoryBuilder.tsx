import { useState } from "react";
import { StoryWizard, StoryWizardData } from "./StoryWizard";
import { StoryPreview } from "./StoryPreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EnhancedStoryBuilderProps {
  childId: string;
  childName: string;
  childAge: number;
  onComplete: () => void;
}

export function EnhancedStoryBuilder({ childId, childName, childAge, onComplete }: EnhancedStoryBuilderProps) {
  const [stage, setStage] = useState<"wizard" | "generating" | "preview">("wizard");
  const [wizardData, setWizardData] = useState<StoryWizardData | null>(null);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [illustrations, setIllustrations] = useState<any[]>([]);
  const [audioContent, setAudioContent] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  const handleWizardComplete = async (data: StoryWizardData) => {
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

  if (stage === "wizard") {
    return (
      <StoryWizard
        childId={childId}
        childName={childName}
        childAge={childAge}
        onComplete={handleWizardComplete}
        onCancel={onComplete}
      />
    );
  }

  if (stage === "generating") {
    return (
      <Card className="w-full max-w-3xl mx-auto p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
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
