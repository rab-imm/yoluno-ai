/**
 * Avatars Service
 *
 * Data access layer for avatar library operations.
 */

import { supabase } from '@/integrations/supabase/client';
import type { AvatarLibraryRow } from '@/types/database';
import type { AvatarLibraryItem, AvatarCategory } from '@/types/domain';
import { handleError } from '@/lib/errors';
import { avatarCache } from './cache/indexedDBCache';

export async function getAllAvatars(): Promise<AvatarLibraryItem[]> {
  const cacheKey = 'all-avatars';
  const cached = await avatarCache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached) as AvatarLibraryItem[];
  }

  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw handleError(error, {
      context: 'avatars.getAllAvatars',
      strategy: 'throw',
    });
  }

  const avatars = (data ?? []).map(mapRowToAvatar);
  await avatarCache.set(cacheKey, JSON.stringify(avatars));

  return avatars;
}

export async function getAvatarsByCategory(
  category: AvatarCategory
): Promise<AvatarLibraryItem[]> {
  const cacheKey = `avatars-${category}`;
  const cached = await avatarCache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached) as AvatarLibraryItem[];
  }

  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    throw handleError(error, {
      context: 'avatars.getAvatarsByCategory',
      strategy: 'throw',
    });
  }

  const avatars = (data ?? []).map(mapRowToAvatar);
  await avatarCache.set(cacheKey, JSON.stringify(avatars));

  return avatars;
}

export async function getAvatarById(id: string): Promise<AvatarLibraryItem | null> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, {
      context: 'avatars.getAvatarById',
      strategy: 'throw',
    });
  }

  return mapRowToAvatar(data);
}

export async function getAvatarUrl(id: string): Promise<string | null> {
  const avatar = await getAvatarById(id);
  return avatar?.imageUrl ?? null;
}

export async function getCategories(): Promise<AvatarCategory[]> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('category')
    .eq('is_active', true);

  if (error) {
    throw handleError(error, {
      context: 'avatars.getCategories',
      strategy: 'throw',
    });
  }

  const categories = [...new Set((data ?? []).map((d) => d.category))];
  return categories as AvatarCategory[];
}

export async function searchAvatars(query: string): Promise<AvatarLibraryItem[]> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(20);

  if (error) {
    throw handleError(error, {
      context: 'avatars.searchAvatars',
      strategy: 'throw',
    });
  }

  return (data ?? []).map(mapRowToAvatar);
}

export async function clearAvatarCache(): Promise<void> {
  await avatarCache.clear();
}

function mapRowToAvatar(row: AvatarLibraryRow): AvatarLibraryItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category as AvatarCategory,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url ?? row.image_url,
    isAnimated: row.is_animated ?? false,
    isPremium: row.is_premium ?? false,
    tags: row.tags ?? [],
  };
}

export const avatarsService = {
  getAll: getAllAvatars,
  getByCategory: getAvatarsByCategory,
  getById: getAvatarById,
  getUrl: getAvatarUrl,
  getCategories,
  search: searchAvatars,
  clearCache: clearAvatarCache,
};
