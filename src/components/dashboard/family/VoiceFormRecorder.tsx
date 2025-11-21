import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FamilyMemberData {
  name: string;
  relationship?: string;
  specific_label?: string;
  birth_date?: string;
  location?: string;
  bio?: string;
}

interface VoiceFormRecorderProps {
  onComplete: (extractedData: FamilyMemberData) => void;
  onCancel: () => void;
}

export function VoiceFormRecorder({ onComplete, onCancel }: VoiceFormRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioBlob) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const transcribeAndExtract = async () => {
    if (!audioBlob) {
      toast.error("No audio recorded");
      return;
    }

    if (duration < 5) {
      toast.error("Recording too short. Please speak for at least 5 seconds.");
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error("Failed to process audio");
        }

        const { data, error } = await supabase.functions.invoke('transcribe-family-member', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (!data.extractedFields?.name) {
          toast.error("Could not extract name from recording. Please try again or use manual form.");
          setIsProcessing(false);
          return;
        }

        toast.success("Successfully extracted family member information!");
        onComplete(data.extractedFields);
      };
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Failed to transcribe audio. Please try again or use manual form.");
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Voice Recording</h3>
        <p className="text-sm text-muted-foreground">
          Describe this family member naturally. Include their name, relationship, special label (like "Dad" or "Grandma"), 
          birth date, location, and any memories or details.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {!audioBlob && (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                className="h-24 w-24 rounded-full"
              >
                {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
              {isRecording && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            {isRecording && (
              <div className="text-2xl font-mono">{formatDuration(duration)}</div>
            )}
          </div>
        )}

        {audioBlob && !isProcessing && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={togglePlayback}
                className="rounded-full"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <span className="text-lg font-mono">{formatDuration(duration)}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setAudioBlob(null);
                  setDuration(0);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                Re-record
              </Button>
              <Button
                onClick={transcribeAndExtract}
                className="flex-1"
              >
                Transcribe & Extract
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Processing audio...</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
