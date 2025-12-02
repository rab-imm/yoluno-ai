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
  const [clipNameError, setClipNameError] = useState("");
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

  const handleMicrophoneError = (error: any) => {
    console.error("Error starting recording:", error);

    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      toast.error("Microphone access denied", {
        description: "Please allow microphone access in your browser settings to record voice clips."
      });
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      toast.error("No microphone found", {
        description: "Please connect a microphone to record voice clips."
      });
    } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      toast.error("Microphone unavailable", {
        description: "Your microphone is being used by another application."
      });
    } else if (error.name === "OverconstrainedError") {
      toast.error("Microphone not compatible", {
        description: "Your microphone doesn't meet the required settings."
      });
    } else if (error.name === "SecurityError") {
      toast.error("Secure connection required", {
        description: "Voice recording requires a secure (HTTPS) connection."
      });
    } else {
      toast.error("Failed to access microphone", {
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

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
      handleMicrophoneError(error);
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
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("Playback failed", {
          description: "Unable to play the recorded audio. Please try recording again."
        });
      };
      audio.play().catch(() => {
        setIsPlaying(false);
        toast.error("Playback blocked", {
          description: "Your browser blocked audio playback. Please try again."
        });
      });
      setIsPlaying(true);
    }
  };

  const validateClipName = (name: string): boolean => {
    if (name.trim().length < 2) {
      setClipNameError("Clip name must be at least 2 characters");
      return false;
    }
    if (name.trim().length > 50) {
      setClipNameError("Clip name must be less than 50 characters");
      return false;
    }
    setClipNameError("");
    return true;
  };

  const handleClipNameChange = (value: string) => {
    setClipName(value);
    if (value.trim().length > 0) {
      validateClipName(value);
    } else {
      setClipNameError("");
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) {
      toast.error("No recording found", {
        description: "Please record a voice clip first."
      });
      return;
    }

    if (!validateClipName(clipName)) {
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Session expired", {
          description: "Please sign in again to save your voice clip."
        });
        return;
      }

      // Upload audio to storage
      const fileName = `voice-vault/${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from("family_audio")
        .upload(fileName, audioBlob);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        if (uploadError.message?.includes("Payload too large")) {
          toast.error("File too large", {
            description: "The audio file exceeds the size limit. Please try a shorter recording."
          });
        } else if (uploadError.message?.includes("storage") || uploadError.message?.includes("bucket")) {
          toast.error("Storage unavailable", {
            description: "Unable to upload audio file. Please try again later."
          });
        } else {
          toast.error("Upload failed", {
            description: "Unable to upload audio file. Please try again."
          });
        }
        return;
      }

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

      if (insertError) {
        console.error("Database insert error:", insertError);
        if (insertError.code === "23505") {
          toast.error("Duplicate clip name", {
            description: "A clip with this name already exists. Please choose a different name."
          });
        } else {
          toast.error("Failed to save clip", {
            description: "Unable to save clip information. Please try again."
          });
        }
        return;
      }

      toast.success("Voice clip saved!", {
        description: `"${clipName.trim()}" is ready to be played as a reward.`
      });
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Error uploading clip:", error);
      
      if (!navigator.onLine) {
        toast.error("No internet connection", {
          description: "Please check your connection and try again."
        });
      } else {
        toast.error("Failed to save voice clip", {
          description: "An unexpected error occurred. Please try again."
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setAudioBlob(null);
    setClipName("");
    setClipNameError("");
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
                  disabled={uploading}
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
                  onChange={(e) => handleClipNameChange(e.target.value)}
                  disabled={uploading}
                  className={clipNameError ? "border-destructive" : ""}
                />
                {clipNameError && (
                  <p className="text-sm text-destructive">{clipNameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={(value: any) => setCategory(value)}
                  disabled={uploading}
                >
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
                  disabled={uploading}
                >
                  Record Again
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !clipName.trim() || !!clipNameError}
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
