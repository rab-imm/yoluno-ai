import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, Volume2, Edit, Save, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface StoryPreviewProps {
  childId: string;
  storyData: {
    title: string;
    content: string;
    scenes: { scene: number; description: string }[];
  };
  illustrations: { scene: number; imageUrl: string; description: string }[];
  audioContent: string | null;
  audioDuration: number | null;
  wizardSettings: any;
  onRegenerate: () => void;
  onSendToBedtime: () => void;
}

export function StoryPreview({
  childId,
  storyData,
  illustrations,
  audioContent,
  audioDuration,
  wizardSettings,
  onRegenerate,
  onSendToBedtime,
}: StoryPreviewProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(storyData.content);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saving, setSaving] = useState(false);

  const playAudio = () => {
    if (!audioContent) return;

    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      toast.error("Failed to play audio");
    };
    audio.play();
    setIsPlaying(true);
  };

  const saveAndSendToBedtime = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("child_stories").insert({
        child_id: childId,
        title: storyData.title,
        content: isEditing ? editedContent : storyData.content,
        prompt: `${wizardSettings.theme} story with ${wizardSettings.characters.map((c: any) => c.name).join(", ")}`,
        theme: wizardSettings.theme,
        mood: wizardSettings.mood,
        values: wizardSettings.values,
        characters: wizardSettings.characters,
        narration_voice: wizardSettings.narrationVoice,
        illustration_style: wizardSettings.illustrationStyle,
        audio_content: audioContent,
        illustrations: illustrations,
        duration_seconds: audioDuration,
        bedtime_ready: true,
        story_length: wizardSettings.storyLength,
        scenes: storyData.scenes,
      });

      if (error) throw error;

      // Invalidate stories cache to show new story immediately
      await queryClient.invalidateQueries({ queryKey: ["child-stories", childId] });

      toast.success("Story saved! Switching to your collection... 📖");
      
      // Check for badges
      await supabase.rpc("check_and_award_badges", { p_child_id: childId });
      
      onSendToBedtime();
    } catch (error) {
      console.error("Save story error:", error);
      toast.error("Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl">{storyData.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{wizardSettings.theme}</Badge>
              <Badge variant="outline">{wizardSettings.mood}</Badge>
              {wizardSettings.values.slice(0, 2).map((value: string) => (
                <Badge key={value} variant="outline">{value}</Badge>
              ))}
              {audioDuration && (
                <Badge variant="outline">
                  {Math.ceil(audioDuration / 60)} min
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Preview" : "Edit"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Story Text */}
        <div>
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[400px] text-base leading-relaxed"
            />
          ) : (
            <div className="prose prose-lg max-w-none space-y-4">
              {editedContent.split('\n\n').filter(p => p.trim()).map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Illustrations Preview */}
        {illustrations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Illustrations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {illustrations.map((ill) => (
                <div key={ill.scene} className="space-y-2">
                  <img
                    src={ill.imageUrl}
                    alt={`Scene ${ill.scene}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground">{ill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Preview */}
        {audioContent && (
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={playAudio}
              disabled={isPlaying}
            >
              {isPlaying ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? "Playing..." : "Preview Audio"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Narrated by {wizardSettings.narrationVoice}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onRegenerate}
            className="flex-1"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Re-roll Story
          </Button>
          <Button
            onClick={saveAndSendToBedtime}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Send to Bedtime"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
