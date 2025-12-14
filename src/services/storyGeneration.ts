/**
 * Story Generation Service
 *
 * Client-side service for AI story generation.
 */

import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/errors';

export interface StoryGenerationRequest {
  childProfileId: string;
  theme: string;
  characters?: string[];
  mood?: string;
  values?: string[];
  storyLength?: 'short' | 'medium' | 'long';
  includeFamily?: boolean;
}

export interface GeneratedStory {
  id?: string;
  title: string;
  content: string;
  moral: string;
  wordCount: number;
  theme: string;
  mood: string;
  illustrationUrl?: string | null;
}

export interface StoryGenerationResponse {
  story: GeneratedStory;
  warning?: string;
  saveError?: string;
}

export async function generateStory(
  request: StoryGenerationRequest
): Promise<GeneratedStory & { warning?: string }> {
  const { data, error } = await supabase.functions.invoke('generate-story', {
    body: request,
  });

  if (error) {
    console.error('Story generation error:', error, data);
    throw handleError(error, {
      context: 'storyGeneration.generateStory',
      strategy: 'throw',
    });
  }

  // Check for error in response data
  if (data?.error) {
    console.error('Story generation API error:', data.error, data.details);
    throw new Error(data.details || data.error);
  }

  const response = data as StoryGenerationResponse;

  // Log warning if story wasn't saved
  if (response.warning) {
    console.warn('Story generation warning:', response.warning, response.saveError);
  }

  return {
    ...response.story,
    warning: response.warning,
  };
}

// Theme suggestions by age group
export function getThemeSuggestions(age: number): string[] {
  const baseThemes = ['friendship', 'kindness', 'adventure', 'animals', 'nature'];

  if (age <= 6) {
    return [...baseThemes, 'bedtime', 'colors', 'shapes', 'family'];
  }

  if (age <= 10) {
    return [...baseThemes, 'space', 'dinosaurs', 'magic', 'sports', 'science'];
  }

  return [...baseThemes, 'mystery', 'fantasy', 'history', 'invention', 'courage'];
}

// Mood options
export const storyMoods = [
  'adventurous',
  'calm',
  'funny',
  'magical',
  'exciting',
  'peaceful',
  'mysterious',
] as const;

export type StoryMood = (typeof storyMoods)[number];

// Values that can be incorporated
export const storyValues = [
  'kindness',
  'honesty',
  'courage',
  'friendship',
  'perseverance',
  'respect',
  'responsibility',
  'gratitude',
  'empathy',
  'creativity',
] as const;

export type StoryValue = (typeof storyValues)[number];

export const storyGenerationService = {
  generate: generateStory,
  getThemeSuggestions,
  moods: storyMoods,
  values: storyValues,
};
