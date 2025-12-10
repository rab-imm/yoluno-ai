/**
 * Child Profiles Query Hooks
 *
 * React Query hooks for child profile data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './keys';
import {
  childProfilesService,
  getChildProfiles,
  getChildProfile,
  getChildProfileWithAvatar,
  createChildProfile,
  updateChildProfile,
  deleteChildProfile,
  updateChildAvatar,
  setChildPin,
} from '@/services/childProfiles';
import type { ChildProfileRow, ChildProfileInsert, ChildProfileUpdate } from '@/types/database';

/**
 * Get all child profiles for the current user
 */
export function useChildProfiles() {
  return useQuery({
    queryKey: queryKeys.childProfiles.all,
    queryFn: getChildProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get a single child profile by ID
 */
export function useChildProfile(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.childProfiles.byId(id!),
    queryFn: () => getChildProfile(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get a child profile with avatar library data
 */
export function useChildProfileWithAvatar(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.childProfiles.withAvatar(id!),
    queryFn: () => getChildProfileWithAvatar(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new child profile
 */
export function useCreateChildProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ChildProfileInsert, 'parent_id'>) =>
      createChildProfile(data),
    onSuccess: (newProfile) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.childProfiles.all });
      toast.success(`Created profile for ${newProfile.name}!`);
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Update a child profile
 */
export function useUpdateChildProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ChildProfileUpdate }) =>
      updateChildProfile(id, updates),
    onSuccess: (updatedProfile) => {
      // Update cache directly
      queryClient.setQueryData(
        queryKeys.childProfiles.byId(updatedProfile.id),
        updatedProfile
      );
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.childProfiles.all });
      toast.success('Profile updated');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Delete a child profile
 */
export function useDeleteChildProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChildProfile,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.childProfiles.byId(deletedId),
      });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.childProfiles.all });
      toast.success('Profile deleted');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Update a child's avatar
 */
export function useUpdateChildAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      childId,
      options,
    }: {
      childId: string;
      options: {
        avatarLibraryId?: string | null;
        customAvatarUrl?: string | null;
        useLibraryAvatar?: boolean;
      };
    }) => updateChildAvatar(childId, options),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        queryKeys.childProfiles.byId(updatedProfile.id),
        updatedProfile
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.withAvatar(updatedProfile.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.childProfiles.all });
      toast.success('Avatar updated');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}

/**
 * Set or update a child's PIN
 */
export function useSetChildPin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      childId,
      pin,
      enabled = true,
    }: {
      childId: string;
      pin: string;
      enabled?: boolean;
    }) => setChildPin(childId, pin, enabled),
    onSuccess: (_, { childId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.childProfiles.byId(childId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.childProfiles.all });
      toast.success('PIN updated');
    },
    onError: () => {
      // Error is already handled by service layer
    },
  });
}
