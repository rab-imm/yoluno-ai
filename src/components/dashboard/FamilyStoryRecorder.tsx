import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Square, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onComplete: () => void;
}

export const FamilyStoryRecorder = ({ onComplete }: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioBlob || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob || !title) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (!base64) throw new Error("Failed to read audio");

        const { data, error } = await supabase.functions.invoke('transcribe-family-story', {
          body: {
            audioBase64: base64,
            fileName: `recording_${Date.now()}.webm`,
            parentId: user.id,
            title,
            durationMinutes: Math.ceil(duration / 60)
          }
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Audio story recorded and transcribed successfully"
        });

        onComplete();
      };
    } catch (error: any) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload audio",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="audio-title">Story Title *</Label>
        <Input
          id="audio-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Great-Grandpa's War Stories"
        />
      </div>

      <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
        {!audioBlob ? (
          <>
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              className="w-32 h-32 rounded-full"
            >
              {isRecording ? <Square className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </Button>
            <p className="text-lg font-medium">
              {isRecording ? formatDuration(duration) : "Click to start recording"}
            </p>
          </>
        ) : (
          <>
            <audio
              ref={audioRef}
              src={URL.createObjectURL(audioBlob)}
              onEnded={() => setIsPlaying(false)}
            />
            <Button size="lg" onClick={togglePlayback} className="w-24 h-24 rounded-full">
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <p className="text-lg font-medium">Duration: {formatDuration(duration)}</p>
            <Button variant="outline" onClick={() => { setAudioBlob(null); setDuration(0); }}>
              Record Again
            </Button>
          </>
        )}
      </div>

      {audioBlob && (
        <Button 
          onClick={handleUpload} 
          className="w-full" 
          disabled={!title || uploading}
        >
          {uploading ? "Processing..." : "Transcribe & Save"}
        </Button>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Audio will be automatically transcribed and searchable
      </p>
    </div>
  );
};
