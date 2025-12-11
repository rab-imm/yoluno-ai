/**
 * Child Profiles Service
 *
 * Data access layer for child profile operations.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  ChildProfileRow,
  ChildProfileInsert,
  ChildProfileUpdate,
} from '@/types/database';
import { handleError } from '@/lib/errors';

export interface ChildProfileWithAvatar extends ChildProfileRow {
  avatarUrl?: string;
}

export async function getChildProfiles(userId: string): Promise<ChildProfileWithAvatar[]> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, {
      context: 'childProfiles.getChildProfiles',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

export async function getChildProfileById(id: string): Promise<ChildProfileWithAvatar | null> {
  const { data, error } = await supabase
    .from('child_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, {
      context: 'childProfiles.getChildProfileById',
      strategy: 'throw',
    });
  }

  return data;
}

export async function createChildProfile(
  profile: ChildProfileInsert
): Promise<ChildProfileRow> {
  const { data, error } = await supabase
    .from('child_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'childProfiles.createChildProfile',
      strategy: 'throw',
    });
  }

  return data;
}

export async function updateChildProfile(
  id: string,
  updates: ChildProfileUpdate
): Promise<ChildProfileRow> {
  const { data, error } = await supabase
    .from('child_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'childProfiles.updateChildProfile',
      strategy: 'throw',
    });
  }

  return data;
}

export async function deleteChildProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from('child_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      context: 'childProfiles.deleteChildProfile',
      strategy: 'throw',
    });
  }
}

export async function updateChildAvatar(
  id: string,
  avatarId: string
): Promise<ChildProfileRow> {
  return updateChildProfile(id, { avatar_id: avatarId });
}

export async function updateLastActive(id: string): Promise<void> {
  const { error } = await supabase
    .from('child_profiles')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    handleError(error, {
      context: 'childProfiles.updateLastActive',
      strategy: 'log',
    });
  }
}

export const childProfilesService = {
  getAll: getChildProfiles,
  getById: getChildProfileById,
  create: createChildProfile,
  update: updateChildProfile,
  delete: deleteChildProfile,
  updateAvatar: updateChildAvatar,
  updateLastActive,
};
