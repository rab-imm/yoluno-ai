/**
 * Avatars Query Hooks
 *
 * React Query hooks for avatar library data with IndexedDB caching.
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';
import {
  getAllAvatars,
  getAvatarsByCategory,
  getAvatar,
  getAvatarCategories,
  searchAvatars,
} from '@/services/avatars';
import { avatarLibraryCache } from '@/services/cache';
import type { AvatarLibraryRow } from '@/types/database';

/**
 * Get all avatars from library with IndexedDB caching
 */
export function useAvatarLibrary() {
  return useQuery({
    queryKey: queryKeys.avatars.all,
    queryFn: async () => {
      // Check IndexedDB cache first
      const cached = await avatarLibraryCache.get('all-avatars');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached as AvatarLibraryRow[];
      }

      // Fetch from API
      const avatars = await getAllAvatars();

      // Cache in IndexedDB
      await avatarLibraryCache.set('all-avatars', avatars);

      return avatars;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Get avatars by category
 */
export function useAvatarsByCategory(category: string | undefined) {
  return useQuery({
    queryKey: queryKeys.avatars.byCategory(category!),
    queryFn: async () => {
      // Check IndexedDB cache
      const cacheKey = `category-${category}`;
      const cached = await avatarLibraryCache.get(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached as AvatarLibraryRow[];
      }

      // Fetch from API
      const avatars = await getAvatarsByCategory(category!);

      // Cache
      await avatarLibraryCache.set(cacheKey, avatars);

      return avatars;
    },
    enabled: !!category,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Get a single avatar by ID
 */
export function useAvatar(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.avatars.byId(id!),
    queryFn: () => getAvatar(id!),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Get all avatar categories
 */
export function useAvatarCategories() {
  return useQuery({
    queryKey: queryKeys.avatars.categories,
    queryFn: getAvatarCategories,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Search avatars
 */
export function useSearchAvatars(query: string | undefined) {
  return useQuery({
    queryKey: queryKeys.avatars.search(query!),
    queryFn: () => searchAvatars(query!),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes for search results
  });
}

/**
 * Prefetch avatars for a category
 */
export async function prefetchAvatarsByCategory(
  queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>,
  category: string
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.avatars.byCategory(category),
    queryFn: () => getAvatarsByCategory(category),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Invalidate avatar cache (both React Query and IndexedDB)
 */
export async function invalidateAvatarCache(
  queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>
): Promise<void> {
  // Clear IndexedDB cache
  await avatarLibraryCache.clear();

  // Invalidate React Query cache
  await queryClient.invalidateQueries({ queryKey: queryKeys.avatars.all });
}
