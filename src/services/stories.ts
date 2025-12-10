/**
 * Stories Service
 *
 * Data access layer for child story operations.
 */

import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/lib/errors';
import type {
  ChildStoryRow,
  ChildStoryInsert,
  ChildStoryUpdate,
} from '@/types/database';

const handleError = createErrorHandler('storiesService');

/**
 * Get all stories for a child
 */
export async function getStoriesByChild(childId: string): Promise<ChildStoryRow[]> {
  const { data, error } = await supabase
    .from('child_stories')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get stories with child profile data
 */
export async function getStoriesWithChildData(childId: string): Promise<(ChildStoryRow & { child_profiles?: { name: string } })[]> {
  const { data, error } = await supabase
    .from('child_stories')
    .select(`
      *,
      child_profiles (name)
    `)
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get a single story by ID
 */
export async function getStory(id: string): Promise<ChildStoryRow | null> {
  const { data, error } = await supabase
    .from('child_stories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, { strategy: 'throw' });
  }

  return data;
}

/**
 * Get favorite stories for a child
 */
export async function getFavoriteStories(childId: string): Promise<ChildStoryRow[]> {
  const { data, error } = await supabase
    .from('child_stories')
    .select('*')
    .eq('child_id', childId)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get bedtime-ready stories for a child
 */
export async function getBedtimeStories(childId: string): Promise<ChildStoryRow[]> {
  const { data, error } = await supabase
    .from('child_stories')
    .select('*')
    .eq('child_id', childId)
    .eq('bedtime_ready', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get recent stories across all children (for parent dashboard)
 */
export async function getRecentStories(limit: number = 10): Promise<(ChildStoryRow & { child_profiles?: { name: string } })[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('child_stories')
    .select(`
      *,
      child_profiles!inner (name, parent_id)
    `)
    .eq('child_profiles.parent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Create a new story
 */
export async function createStory(story: ChildStoryInsert): Promise<ChildStoryRow> {
  const { data, error } = await supabase
    .from('child_stories')
    .insert(story)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to create story',
    });
  }

  return data;
}

/**
 * Update a story
 */
export async function updateStory(
  id: string,
  updates: ChildStoryUpdate
): Promise<ChildStoryRow> {
  const { data, error } = await supabase
    .from('child_stories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update story',
    });
  }

  return data;
}

/**
 * Toggle story favorite status
 */
export async function toggleFavorite(id: string): Promise<ChildStoryRow> {
  // First get current status
  const { data: current, error: fetchError } = await supabase
    .from('child_stories')
    .select('is_favorite')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw handleError(fetchError, { strategy: 'throw' });
  }

  // Toggle it
  const { data, error } = await supabase
    .from('child_stories')
    .update({ is_favorite: !current.is_favorite })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update favorite status',
    });
  }

  return data;
}

/**
 * Delete a story
 */
export async function deleteStory(id: string): Promise<void> {
  const { error } = await supabase
    .from('child_stories')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to delete story',
    });
  }
}

/**
 * Get story count for a child
 */
export async function getStoryCount(childId: string): Promise<number> {
  const { count, error } = await supabase
    .from('child_stories')
    .select('*', { count: 'exact', head: true })
    .eq('child_id', childId);

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return count || 0;
}

/**
 * Get story themes
 */
export async function getStoryThemes(): Promise<{ id: string; name: string; emoji: string; description: string }[]> {
  const { data, error } = await supabase
    .from('story_themes')
    .select('*')
    .order('name');

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

// Export as a service object
export const storiesService = {
  getByChild: getStoriesByChild,
  getWithChildData: getStoriesWithChildData,
  getById: getStory,
  getFavorites: getFavoriteStories,
  getBedtime: getBedtimeStories,
  getRecent: getRecentStories,
  create: createStory,
  update: updateStory,
  toggleFavorite,
  delete: deleteStory,
  getCount: getStoryCount,
  getThemes: getStoryThemes,
};
