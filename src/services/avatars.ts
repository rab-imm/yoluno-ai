/**
 * Avatars Service
 *
 * Data access layer for avatar library and management.
 */

import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/lib/errors';
import type { AvatarLibraryRow } from '@/types/database';

const handleError = createErrorHandler('avatarsService');

/**
 * Get all avatars from the library
 */
export async function getAllAvatars(): Promise<AvatarLibraryRow[]> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .order('category')
    .order('character_name');

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get avatars by category
 */
export async function getAvatarsByCategory(
  category: string
): Promise<AvatarLibraryRow[]> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .eq('category', category)
    .order('character_name');

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get a single avatar by ID
 */
export async function getAvatar(id: string): Promise<AvatarLibraryRow | null> {
  const { data, error } = await supabase
    .from('avatar_library')
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
 * Get avatar by character slug
 */
export async function getAvatarBySlug(slug: string): Promise<AvatarLibraryRow | null> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .eq('character_slug', slug)
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
 * Get available avatar categories
 */
export async function getAvatarCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('category')
    .order('category');

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  // Get unique categories
  const categories = [...new Set(data?.map((item) => item.category) || [])];
  return categories;
}

/**
 * Search avatars by name or description
 */
export async function searchAvatars(query: string): Promise<AvatarLibraryRow[]> {
  const { data, error } = await supabase
    .from('avatar_library')
    .select('*')
    .or(`character_name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('character_name');

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get avatar expression URL
 */
export function getAvatarExpressionUrl(
  avatar: AvatarLibraryRow,
  expression: 'neutral' | 'happy' | 'thinking' | 'excited'
): string {
  const expressionMap = {
    neutral: avatar.avatar_neutral,
    happy: avatar.avatar_happy,
    thinking: avatar.avatar_thinking,
    excited: avatar.avatar_excited,
  };

  return expressionMap[expression] || avatar.avatar_neutral;
}

/**
 * Get all expression URLs for an avatar
 */
export function getAllExpressionUrls(avatar: AvatarLibraryRow): {
  neutral: string;
  happy: string;
  thinking: string;
  excited: string;
} {
  return {
    neutral: avatar.avatar_neutral,
    happy: avatar.avatar_happy,
    thinking: avatar.avatar_thinking,
    excited: avatar.avatar_excited,
  };
}

// Export as a service object
export const avatarsService = {
  getAll: getAllAvatars,
  getByCategory: getAvatarsByCategory,
  getById: getAvatar,
  getBySlug: getAvatarBySlug,
  getCategories: getAvatarCategories,
  search: searchAvatars,
  getExpressionUrl: getAvatarExpressionUrl,
  getAllExpressionUrls,
};
