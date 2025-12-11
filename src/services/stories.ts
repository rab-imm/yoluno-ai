/**
 * Stories Service
 *
 * Data access layer for story operations.
 */

import { supabase } from '@/integrations/supabase/client';
import type { StoryRow, StoryInsert, StoryUpdate } from '@/types/database';
import { handleError } from '@/lib/errors';

export interface StoryWithDetails extends StoryRow {
  childName?: string;
  scenes?: StoryScene[];
}

export interface StoryScene {
  id: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  order: number;
}

export async function getStoriesByChild(childId: string): Promise<StoryWithDetails[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('child_profile_id', childId)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, {
      context: 'stories.getStoriesByChild',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

export async function getStoryById(id: string): Promise<StoryWithDetails | null> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, {
      context: 'stories.getStoryById',
      strategy: 'throw',
    });
  }

  return data;
}

export async function createStory(story: StoryInsert): Promise<StoryRow> {
  const { data, error } = await supabase
    .from('stories')
    .insert(story)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'stories.createStory',
      strategy: 'throw',
    });
  }

  return data;
}

export async function updateStory(
  id: string,
  updates: StoryUpdate
): Promise<StoryRow> {
  const { data, error } = await supabase
    .from('stories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'stories.updateStory',
      strategy: 'throw',
    });
  }

  return data;
}

export async function deleteStory(id: string): Promise<void> {
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      context: 'stories.deleteStory',
      strategy: 'throw',
    });
  }
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<StoryRow> {
  return updateStory(id, { is_favorite: isFavorite });
}

export async function getFavoriteStories(childId: string): Promise<StoryWithDetails[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('child_profile_id', childId)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, {
      context: 'stories.getFavoriteStories',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

export async function getRecentStories(
  userId: string,
  limit = 10
): Promise<StoryWithDetails[]> {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      child_profiles!inner(user_id, name)
    `)
    .eq('child_profiles.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw handleError(error, {
      context: 'stories.getRecentStories',
      strategy: 'throw',
    });
  }

  return (data ?? []).map((story) => ({
    ...story,
    childName: (story.child_profiles as { name: string })?.name,
  }));
}

export const storiesService = {
  getByChild: getStoriesByChild,
  getById: getStoryById,
  create: createStory,
  update: updateStory,
  delete: deleteStory,
  toggleFavorite,
  getFavorites: getFavoriteStories,
  getRecent: getRecentStories,
};
