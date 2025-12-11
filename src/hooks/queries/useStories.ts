/**
 * Stories Query Hooks
 *
 * React Query hooks for story operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { storiesService, type StoryWithDetails } from '@/services/stories';
import type { StoryInsert, StoryUpdate } from '@/types/database';
import { handleError } from '@/lib/errors';

export function useStoriesByChild(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.listByChild(childId ?? ''),
    queryFn: () => storiesService.getByChild(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStory(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.detail(id ?? ''),
    queryFn: () => storiesService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFavoriteStories(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.stories.favorites(childId ?? ''),
    queryFn: () => storiesService.getFavorites(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRecentStories(userId: string | undefined, limit = 10) {
  return useQuery({
    queryKey: queryKeys.stories.recent(userId ?? ''),
    queryFn: () => storiesService.getRecent(userId!, limit),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (story: StoryInsert) => storiesService.create(story),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.listByChild(data.child_profile_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.recent(''),
        exact: false,
      });
      return data;
    },
    onError: (error) => {
      handleError(error, {
        context: 'useCreateStory',
        userMessage: 'Failed to create story',
      });
    },
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: StoryUpdate }) =>
      storiesService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.listByChild(data.child_profile_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.detail(data.id),
      });
      return data;
    },
    onError: (error) => {
      handleError(error, {
        context: 'useUpdateStory',
        userMessage: 'Failed to update story',
      });
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storiesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.lists(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.stories.detail(id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useDeleteStory',
        userMessage: 'Failed to delete story',
      });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      storiesService.toggleFavorite(id, isFavorite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.listByChild(data.child_profile_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.favorites(data.child_profile_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.stories.detail(data.id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useToggleFavorite',
        userMessage: 'Failed to update favorite status',
      });
    },
  });
}
