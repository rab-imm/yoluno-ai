/**
 * Text-to-Speech Service
 *
 * Client-side service for TTS functionality.
 */

import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/errors';

export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface TTSOptions {
  voice?: TTSVoice;
  speed?: number;
  childProfileId?: string;
}

export interface TTSResponse {
  audio: string; // base64 encoded
  format: string;
  textLength: number;
}

export async function generateSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<TTSResponse> {
  const { voice = 'nova', speed = 1.0, childProfileId } = options;

  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: {
      text,
      voice,
      speed,
      childProfileId,
    },
  });

  if (error) {
    throw handleError(error, {
      context: 'textToSpeech.generateSpeech',
      strategy: 'throw',
    });
  }

  return data as TTSResponse;
}

export function playAudioFromBase64(base64Audio: string): HTMLAudioElement {
  const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
  audio.play();
  return audio;
}

export async function speakText(
  text: string,
  options: TTSOptions = {}
): Promise<HTMLAudioElement> {
  const response = await generateSpeech(text, options);
  return playAudioFromBase64(response.audio);
}

// Child-friendly voice recommendations by age
export function getRecommendedVoice(age: number): TTSVoice {
  if (age <= 6) return 'shimmer'; // Warm, friendly
  if (age <= 10) return 'nova'; // Neutral, clear
  return 'echo'; // Slightly more mature
}

export const textToSpeechService = {
  generate: generateSpeech,
  play: playAudioFromBase64,
  speak: speakText,
  getRecommendedVoice,
};
