import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MissionCompletionDialogProps {
  missionTitle: string;
  personalityMode: string;
  onClose: () => void;
}

export function MissionCompletionDialog({
  missionTitle,
  personalityMode,
  onClose,
}: MissionCompletionDialogProps) {
  const [voiceClipUrl, setVoiceClipUrl] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState(false);

  useEffect(() => {
    loadVoiceClip();
  }, []);

  const loadVoiceClip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch a random active voice clip
      const { data: clips } = await supabase
        .from("voice_vault_clips")
        .select("id, audio_url")
        .eq("parent_id", user.id)
        .eq("is_active", true);

      if (clips && clips.length > 0) {
        const randomClip = clips[Math.floor(Math.random() * clips.length)];
        setVoiceClipUrl(randomClip.audio_url);

        // Increment play count
        const { data: currentClip } = await supabase
          .from("voice_vault_clips")
          .select("play_count")
          .eq("id", randomClip.id)
          .single();

        if (currentClip) {
          await supabase
            .from("voice_vault_clips")
            .update({ play_count: (currentClip.play_count || 0) + 1 })
            .eq("id", randomClip.id);
        }
      }
    } catch (error) {
      console.error("Error loading voice clip:", error);
    }
  };

  const playVoiceClip = () => {
    if (!voiceClipUrl || playingVoice) return;

    const audio = new Audio(voiceClipUrl);
    audio.onended = () => setPlayingVoice(false);
    audio.play();
    setPlayingVoice(true);
  };

  const getMessage = () => {
    if (personalityMode === "curious_explorer") {
      return "Awesome! You earned a star! ⭐";
    } else {
      return "That's wonderful! You did great today. 💙";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Star className="h-20 w-20 text-primary opacity-30" />
            </div>
            <Star className="h-20 w-20 text-primary fill-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Mission Complete!</h3>
            <p className="text-muted-foreground">{missionTitle}</p>
          </div>

          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-medium">{getMessage()}</p>
          </div>

          {voiceClipUrl && (
            <Button
              onClick={playVoiceClip}
              variant="outline"
              size="lg"
              className="w-full"
              disabled={playingVoice}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {playingVoice ? "Playing..." : "Hear a Message from Your Parent!"}
            </Button>
          )}

          <Button onClick={onClose} size="lg" className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
