import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface StoryModeProps {
  childId: string;
  childName: string;
}

export function StoryMode({ childId, childName }: StoryModeProps) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<{ title: string; content: string } | null>(null);

  const generateStory = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a story idea!");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-story", {
        body: {
          childId,
          prompt: prompt.trim(),
          childName,
        },
      });

      if (error) throw error;

      setStory({
        title: data.title,
        content: data.story,
      });

      toast.success("Story created! 📖");
    } catch (error: any) {
      console.error("Story generation error:", error);
      toast.error("Failed to generate story. Please try again!");
    } finally {
      setGenerating(false);
    }
  };

  const saveStory = async () => {
    if (!story) return;

    try {
      const { error } = await supabase.from("child_stories").insert({
        child_id: childId,
        title: story.title,
        content: story.content,
        prompt: prompt,
      });

      if (error) throw error;

      toast.success("Story saved to your collection! ✨");
      
      // Check for badges
      await supabase.rpc("check_and_award_badges", { p_child_id: childId });
    } catch (error) {
      console.error("Save story error:", error);
      toast.error("Failed to save story");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold">Story Time! 📚</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Tell me what kind of story you'd like to hear! I'll create a magical tale just for you.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story-prompt">Story Idea</Label>
            <Input
              id="story-prompt"
              placeholder="e.g., A brave dinosaur who loves space..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={generating}
              onKeyPress={(e) => e.key === "Enter" && generateStory()}
            />
          </div>

          <Button
            onClick={generateStory}
            disabled={generating || !prompt.trim()}
            className="w-full"
            variant="playful"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating your story...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Story
              </>
            )}
          </Button>
        </div>
      </Card>

      {story && (
        <Card className="p-6 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 text-center">{story.title}</h3>
          <Textarea
            value={story.content}
            readOnly
            className="min-h-[300px] text-base leading-relaxed resize-none border-0 focus-visible:ring-0"
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={saveStory} variant="success" className="flex-1">
              Save Story
            </Button>
            <Button
              onClick={() => {
                setStory(null);
                setPrompt("");
              }}
              variant="outline"
              className="flex-1"
            >
              New Story
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
