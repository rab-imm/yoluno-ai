/**
 * Family Service
 *
 * Data access layer for family member operations.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  FamilyMemberRow,
  FamilyMemberInsert,
  FamilyMemberUpdate,
  FamilyRelationshipRow,
  FamilyRelationshipInsert,
} from '@/types/database';
import { handleError } from '@/lib/errors';

export interface FamilyMemberWithRelations extends FamilyMemberRow {
  relationships?: FamilyRelationshipRow[];
}

export async function getFamilyMembers(userId: string): Promise<FamilyMemberWithRelations[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    throw handleError(error, {
      context: 'family.getFamilyMembers',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

export async function getFamilyMemberById(id: string): Promise<FamilyMemberWithRelations | null> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, {
      context: 'family.getFamilyMemberById',
      strategy: 'throw',
    });
  }

  return data;
}

export async function createFamilyMember(
  member: FamilyMemberInsert
): Promise<FamilyMemberRow> {
  const { data, error } = await supabase
    .from('family_members')
    .insert(member)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'family.createFamilyMember',
      strategy: 'throw',
    });
  }

  return data;
}

export async function updateFamilyMember(
  id: string,
  updates: FamilyMemberUpdate
): Promise<FamilyMemberRow> {
  const { data, error } = await supabase
    .from('family_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'family.updateFamilyMember',
      strategy: 'throw',
    });
  }

  return data;
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      context: 'family.deleteFamilyMember',
      strategy: 'throw',
    });
  }
}

export async function getRelationships(userId: string): Promise<FamilyRelationshipRow[]> {
  const { data, error } = await supabase
    .from('family_relationships')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw handleError(error, {
      context: 'family.getRelationships',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

export async function createRelationship(
  relationship: FamilyRelationshipInsert
): Promise<FamilyRelationshipRow> {
  const { data, error } = await supabase
    .from('family_relationships')
    .insert(relationship)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'family.createRelationship',
      strategy: 'throw',
    });
  }

  return data;
}

export async function deleteRelationship(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_relationships')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      context: 'family.deleteRelationship',
      strategy: 'throw',
    });
  }
}

export async function getFamilyTree(userId: string): Promise<{
  members: FamilyMemberWithRelations[];
  relationships: FamilyRelationshipRow[];
}> {
  const [members, relationships] = await Promise.all([
    getFamilyMembers(userId),
    getRelationships(userId),
  ]);

  return { members, relationships };
}

export const familyService = {
  getMembers: getFamilyMembers,
  getMemberById: getFamilyMemberById,
  createMember: createFamilyMember,
  updateMember: updateFamilyMember,
  deleteMember: deleteFamilyMember,
  getRelationships,
  createRelationship,
  deleteRelationship,
  getTree: getFamilyTree,
};
