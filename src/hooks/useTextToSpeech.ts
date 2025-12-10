import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/errors";

export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const speak = async (text: string, voice: string = "nova") => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setSpeaking(true);

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice },
      });

      if (error) throw error;

      // Create audio element from base64
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      setCurrentAudio(audio);

      audio.onended = () => {
        setSpeaking(false);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        setSpeaking(false);
        setCurrentAudio(null);
        handleError(new Error("Audio playback failed"), {
          userMessage: "Failed to play audio",
          context: 'useTextToSpeech.speak'
        });
      };

      await audio.play();
    } catch (error) {
      handleError(error, {
        userMessage: "Failed to generate speech",
        context: 'useTextToSpeech.speak'
      });
      setSpeaking(false);
      setCurrentAudio(null);
    }
  };

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setSpeaking(false);
  };

  return { speak, stop, speaking };
}
