/**
 * Stories Query Hooks
 *
 * React Query hooks for story data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './keys';
import {
  getStoriesByChild,
  getStoriesWithChildData,
  getStory,
  getFavoriteStories,
  getBedtimeStories,
  getRecentStories,
  createStory,
  updateStory,
  toggleFavorite,
  deleteStory,
  getStoryThemes,
} from '@/services/stories';
import type { ChildStoryInsert, ChildStoryUpdate } from '@/types/database';

/**
 * Get all stories for a child
 */
export function useStoriesByChild(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.byChild(childId!),
    queryFn: () => getStoriesByChild(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get stories with child profile data
 */
export function useStoriesWithChildData(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.byChild(childId!),
    queryFn: () => getStoriesWithChildData(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get a single story by ID
 */
export function useStory(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.byId(id!),
    queryFn: () => getStory(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get favorite stories for a child
 */
export function useFavoriteStories(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.favorites(childId!),
    queryFn: () => getFavoriteStories(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get bedtime stories for a child
 */
export function useBedtimeStories(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.bedtime(childId!),
    queryFn: () => getBedtimeStories(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get recent stories across all children
 */
export function useRecentStories(limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.stories.recent(limit),
    queryFn: () => getRecentStories(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes for recent data
  });
}

/**
 * Get story themes
 */
export function useStoryThemes() {
  return useQuery({
    queryKey: queryKeys.stories.themes,
    queryFn: getStoryThemes,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - themes rarely change
  });
}

/**
 * Create a new story
 */
export function useCreateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChildStoryInsert) => createStory(data),
    onSuccess: (newStory) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.byChild(newStory.child_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.recent(),
      });
      toast.success('Story created!');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Update a story
 */
export function useUpdateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ChildStoryUpdate }) =>
      updateStory(id, updates),
    onSuccess: (updatedStory) => {
      // Update cache directly
      queryClient.setQueryData(
        queryKeys.stories.byId(updatedStory.id),
        updatedStory
      );
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.byChild(updatedStory.child_id),
      });
      toast.success('Story updated');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Toggle story favorite status
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (updatedStory) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.stories.byId(updatedStory.id),
        updatedStory
      );
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.byChild(updatedStory.child_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.favorites(updatedStory.child_id),
      });

      toast.success(
        updatedStory.is_favorite ? 'Added to favorites' : 'Removed from favorites'
      );
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Delete a story
 */
export function useDeleteStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStory,
    onSuccess: (_, storyId) => {
      // Get the story from cache to know the child_id for invalidation
      const cachedStory = queryClient.getQueryData<{ child_id: string }>(
        queryKeys.stories.byId(storyId)
      );

      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.stories.byId(storyId),
      });

      // Invalidate lists
      if (cachedStory?.child_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.stories.byChild(cachedStory.child_id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.stories.favorites(cachedStory.child_id),
        });
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.recent(),
      });

      toast.success('Story deleted');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}
