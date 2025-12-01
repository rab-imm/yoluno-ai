import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, Play, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VoiceVaultRecorderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VoiceVaultRecorder({ open, onOpenChange, onSuccess }: VoiceVaultRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clipName, setClipName] = useState("");
  const [category, setCategory] = useState<"encouragement" | "praise" | "celebration">("encouragement");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setCountdown(1.0);

      // Countdown from 1 second
      let timeLeft = 1.0;
      countdownIntervalRef.current = window.setInterval(() => {
        timeLeft -= 0.1;
        setCountdown(Math.max(0, timeLeft));

        if (timeLeft <= 0) {
          stopRecording();
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
        }
      }, 100);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioBlob) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob || !clipName.trim()) {
      toast.error("Please provide a name for your clip");
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload audio to storage
      const fileName = `voice-vault/${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("family_audio")
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("family_audio")
        .getPublicUrl(fileName);

      // Save clip metadata
      const { error: insertError } = await supabase
        .from("voice_vault_clips")
        .insert({
          parent_id: user.id,
          clip_name: clipName.trim(),
          audio_url: publicUrl,
          duration_ms: 1000,
          category,
          is_active: true,
        });

      if (insertError) throw insertError;

      toast.success("Voice clip saved!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error uploading clip:", error);
      toast.error("Failed to save voice clip");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setAudioBlob(null);
    setClipName("");
    setCategory("encouragement");
    setCountdown(0);
    setIsRecording(false);
    setIsPlaying(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Voice Clip</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recording Section */}
          <div className="flex flex-col items-center gap-4">
            {!audioBlob ? (
              <>
                <div className="relative">
                  <Button
                    size="lg"
                    className="h-32 w-32 rounded-full"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isRecording}
                  >
                    {isRecording ? (
                      <Square className="h-12 w-12" />
                    ) : (
                      <Mic className="h-12 w-12" />
                    )}
                  </Button>
                  
                  {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-36 w-36 rounded-full border-4 border-primary animate-ping" />
                    </div>
                  )}
                </div>

                {isRecording && (
                  <div className="text-4xl font-bold text-primary">
                    {countdown.toFixed(1)}s
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center">
                  {isRecording ? "Recording..." : "Tap to record a 1-second clip"}
                </p>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={togglePlayback}
                  className="h-24 w-24 rounded-full"
                >
                  {isPlaying ? (
                    <Square className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isPlaying ? "Playing..." : "Preview your recording"}
                </p>
              </>
            )}
          </div>

          {/* Clip Details */}
          {audioBlob && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clipName">Clip Name</Label>
                <Input
                  id="clipName"
                  placeholder="e.g., 'Great job!'"
                  value={clipName}
                  onChange={(e) => setClipName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encouragement">Encouragement</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAudioBlob(null)}
                  className="flex-1"
                >
                  Record Again
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !clipName.trim()}
                  className="flex-1"
                >
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Clip
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
