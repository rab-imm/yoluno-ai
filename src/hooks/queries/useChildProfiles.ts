/**
 * Child Profiles Query Hooks
 *
 * React Query hooks for child profile operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import {
  childProfilesService,
  type ChildProfileWithAvatar,
} from '@/services/childProfiles';
import type { ChildProfileInsert, ChildProfileUpdate } from '@/types/database';
import { handleError } from '@/lib/errors';

export function useChildProfiles(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.childProfiles.list(userId ?? ''),
    queryFn: () => childProfilesService.getAll(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useChildProfile(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.childProfiles.detail(id ?? ''),
    queryFn: () => childProfilesService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateChildProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: ChildProfileInsert) => childProfilesService.create(profile),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.lists(),
      });
      return data;
    },
    onError: (error) => {
      handleError(error, {
        context: 'useCreateChildProfile',
        userMessage: 'Failed to create child profile',
      });
    },
  });
}

export function useUpdateChildProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ChildProfileUpdate }) =>
      childProfilesService.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.detail(data.id),
      });
      return data;
    },
    onError: (error) => {
      handleError(error, {
        context: 'useUpdateChildProfile',
        userMessage: 'Failed to update child profile',
      });
    },
  });
}

export function useDeleteChildProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => childProfilesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.lists(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.childProfiles.detail(id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useDeleteChildProfile',
        userMessage: 'Failed to delete child profile',
      });
    },
  });
}

export function useUpdateChildAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, avatarId }: { id: string; avatarId: string }) =>
      childProfilesService.updateAvatar(id, avatarId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.detail(data.id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useUpdateChildAvatar',
        userMessage: 'Failed to update avatar',
      });
    },
  });
}

export function usePrefetchChildProfile() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.childProfiles.detail(id),
      queryFn: () => childProfilesService.getById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
