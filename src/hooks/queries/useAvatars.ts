/**
 * Avatars Query Hooks
 *
 * React Query hooks for avatar library operations.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { avatarsService } from '@/services/avatars';
import type { AvatarCategory } from '@/types/domain';

export function useAllAvatars() {
  return useQuery({
    queryKey: queryKeys.avatars.listAll(),
    queryFn: () => avatarsService.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes (avatars rarely change)
  });
}

export function useAvatarsByCategory(category: AvatarCategory | undefined) {
  return useQuery({
    queryKey: queryKeys.avatars.listByCategory(category ?? ''),
    queryFn: () => avatarsService.getByCategory(category!),
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
  });
}

export function useAvatar(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.avatars.detail(id ?? ''),
    queryFn: () => avatarsService.getById(id!),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useAvatarCategories() {
  return useQuery({
    queryKey: queryKeys.avatars.categories(),
    queryFn: () => avatarsService.getCategories(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSearchAvatars(query: string) {
  return useQuery({
    queryKey: queryKeys.avatars.search(query),
    queryFn: () => avatarsService.search(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePrefetchAvatarCategory() {
  const queryClient = useQueryClient();

  return (category: AvatarCategory) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.avatars.listByCategory(category),
      queryFn: () => avatarsService.getByCategory(category),
      staleTime: 30 * 60 * 1000,
    });
  };
}

export function useClearAvatarCache() {
  const queryClient = useQueryClient();

  return async () => {
    await avatarsService.clearCache();
    queryClient.invalidateQueries({
      queryKey: queryKeys.avatars.all,
    });
  };
}
