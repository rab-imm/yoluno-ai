/**
 * Family Service
 *
 * Data access layer for family members and relationships.
 */

import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/lib/errors';
import type {
  FamilyMemberRow,
  FamilyMemberInsert,
  FamilyMemberUpdate,
  FamilyRelationshipRow,
  FamilyRelationshipInsert,
} from '@/types/database';

const handleError = createErrorHandler('familyService');

// ============================================================================
// Family Members
// ============================================================================

/**
 * Get all family members for the current user
 */
export async function getFamilyMembers(): Promise<FamilyMemberRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('parent_id', user.id)
    .order('name');

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get a family member by ID
 */
export async function getFamilyMember(id: string): Promise<FamilyMemberRow | null> {
  const { data, error } = await supabase
    .from('family_members')
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
 * Create a family member
 */
export async function createFamilyMember(
  member: Omit<FamilyMemberInsert, 'parent_id'>
): Promise<FamilyMemberRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('family_members')
    .insert({
      ...member,
      parent_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to add family member',
    });
  }

  return data;
}

/**
 * Update a family member
 */
export async function updateFamilyMember(
  id: string,
  updates: FamilyMemberUpdate
): Promise<FamilyMemberRow> {
  const { data, error } = await supabase
    .from('family_members')
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
      userMessage: 'Failed to update family member',
    });
  }

  return data;
}

/**
 * Delete a family member
 */
export async function deleteFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to delete family member',
    });
  }
}

/**
 * Update family member's tree position
 */
export async function updateMemberPosition(
  id: string,
  position: { x: number; y: number }
): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .update({
      tree_position_x: position.x,
      tree_position_y: position.y,
    })
    .eq('id', id);

  if (error) {
    throw handleError(error, { strategy: 'log' });
  }
}

// ============================================================================
// Family Relationships
// ============================================================================

/**
 * Get all relationships for the current user
 */
export async function getFamilyRelationships(): Promise<FamilyRelationshipRow[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('family_relationships')
    .select('*')
    .eq('parent_id', user.id);

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get relationships for a specific member
 */
export async function getMemberRelationships(memberId: string): Promise<FamilyRelationshipRow[]> {
  const { data, error } = await supabase
    .from('family_relationships')
    .select('*')
    .or(`person_id.eq.${memberId},related_person_id.eq.${memberId}`);

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Create a relationship between two members
 */
export async function createRelationship(
  relationship: Omit<FamilyRelationshipInsert, 'parent_id'>
): Promise<FamilyRelationshipRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('family_relationships')
    .insert({
      ...relationship,
      parent_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to create relationship',
    });
  }

  return data;
}

/**
 * Delete a relationship
 */
export async function deleteRelationship(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_relationships')
    .delete()
    .eq('id', id);

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to delete relationship',
    });
  }
}

/**
 * Get family members with their relationships
 */
export async function getFamilyMembersWithRelationships(): Promise<{
  members: FamilyMemberRow[];
  relationships: FamilyRelationshipRow[];
}> {
  const [members, relationships] = await Promise.all([
    getFamilyMembers(),
    getFamilyRelationships(),
  ]);

  return { members, relationships };
}

// ============================================================================
// Family Events
// ============================================================================

/**
 * Get family events
 */
export async function getFamilyEvents(): Promise<unknown[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('family_events')
    .select('*')
    .eq('parent_id', user.id)
    .order('event_date', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

// Export as a service object
export const familyService = {
  // Members
  getMembers: getFamilyMembers,
  getMember: getFamilyMember,
  createMember: createFamilyMember,
  updateMember: updateFamilyMember,
  deleteMember: deleteFamilyMember,
  updateMemberPosition,

  // Relationships
  getRelationships: getFamilyRelationships,
  getMemberRelationships,
  createRelationship,
  deleteRelationship,

  // Combined
  getMembersWithRelationships: getFamilyMembersWithRelationships,

  // Events
  getEvents: getFamilyEvents,
};
