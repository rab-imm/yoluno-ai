/**
 * Child Profiles Service
 *
 * Data access layer for child profile operations.
 */

import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/lib/errors';
import type {
  ChildProfileRow,
  ChildProfileInsert,
  ChildProfileUpdate,
} from '@/types/database';

const handleError = createErrorHandler('childProfilesService');

/**
 * Get all child profiles for the current user
 */
export async function getChildProfiles(): Promise<ChildProfileRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get a single child profile by ID
 */
export async function getChildProfile(id: string): Promise<ChildProfileRow | null> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw handleError(error, { strategy: 'throw' });
  }

  return data;
}

/**
 * Get a child profile with avatar library data
 */
export async function getChildProfileWithAvatar(id: string): Promise<ChildProfileRow & { avatar_library?: unknown } | null> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select(`
      *,
      avatar_library (*)
    `)
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
 * Create a new child profile
 */
export async function createChildProfile(
  profile: Omit<ChildProfileInsert, 'parent_id'>
): Promise<ChildProfileRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('child_profiles')
    .insert({
      ...profile,
      parent_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to create child profile',
    });
  }

  return data;
}

/**
 * Update a child profile
 */
export async function updateChildProfile(
  id: string,
  updates: ChildProfileUpdate
): Promise<ChildProfileRow> {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update child profile',
    });
  }

  return data;
}

/**
 * Delete a child profile
 */
export async function deleteChildProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from('child_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to delete child profile',
    });
  }
}

/**
 * Update child's streak
 */
export async function updateChildStreak(childId: string): Promise<void> {
  const { error } = await supabase.rpc('update_child_streak', {
    p_child_id: childId,
  });

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update streak',
    });
  }
}

/**
 * Update child's last chat date
 */
export async function updateLastChatDate(childId: string): Promise<void> {
  const { error } = await supabase
    .from('child_profiles')
    .update({
      last_chat_date: new Date().toISOString().split('T')[0],
      last_access_at: new Date().toISOString(),
    })
    .eq('id', childId);

  if (error) {
    throw handleError(error, { strategy: 'log' });
  }
}

/**
 * Set or update child's PIN
 */
export async function setChildPin(
  childId: string,
  pinCode: string,
  enabled: boolean = true
): Promise<void> {
  const { error } = await supabase
    .from('child_profiles')
    .update({
      pin_code: pinCode,
      pin_enabled: enabled,
    })
    .eq('id', childId);

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to set PIN',
    });
  }
}

/**
 * Verify child's PIN
 */
export async function verifyChildPin(
  childId: string,
  pinCode: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('pin_code')
    .eq('id', childId)
    .single();

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data?.pin_code === pinCode;
}

/**
 * Update child's avatar
 */
export async function updateChildAvatar(
  childId: string,
  options: {
    avatarLibraryId?: string | null;
    customAvatarUrl?: string | null;
    useLibraryAvatar?: boolean;
  }
): Promise<ChildProfileRow> {
  const { data, error } = await supabase
    .from('child_profiles')
    .update({
      avatar_library_id: options.avatarLibraryId,
      custom_avatar_url: options.customAvatarUrl,
      use_library_avatar: options.useLibraryAvatar ?? !!options.avatarLibraryId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', childId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update avatar',
    });
  }

  return data;
}

// Export as a service object for convenience
export const childProfilesService = {
  getAll: getChildProfiles,
  getById: getChildProfile,
  getWithAvatar: getChildProfileWithAvatar,
  create: createChildProfile,
  update: updateChildProfile,
  delete: deleteChildProfile,
  updateStreak: updateChildStreak,
  updateLastChatDate,
  setPin: setChildPin,
  verifyPin: verifyChildPin,
  updateAvatar: updateChildAvatar,
};
