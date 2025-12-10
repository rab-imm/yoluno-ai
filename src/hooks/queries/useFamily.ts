/**
 * Family Query Hooks
 *
 * React Query hooks for family members and relationships.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './keys';
import {
  getFamilyMembers,
  getFamilyMember,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getFamilyRelationships,
  getMemberRelationships,
  createRelationship,
  deleteRelationship,
  getFamilyMembersWithRelationships,
  getFamilyEvents,
} from '@/services/family';
import type { FamilyMemberInsert, FamilyMemberUpdate, FamilyRelationshipInsert } from '@/types/database';

// ============================================================================
// Family Members Hooks
// ============================================================================

/**
 * Get all family members
 */
export function useFamilyMembers() {
  return useQuery({
    queryKey: queryKeys.family.members,
    queryFn: getFamilyMembers,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get a single family member
 */
export function useFamilyMember(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.family.member(id!),
    queryFn: () => getFamilyMember(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a family member
 */
export function useCreateFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<FamilyMemberInsert, 'parent_id'>) =>
      createFamilyMember(data),
    onSuccess: (newMember) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.family.members });
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.withRelationships,
      });
      toast.success(`Added ${newMember.name} to family tree`);
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Update a family member
 */
export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: FamilyMemberUpdate }) =>
      updateFamilyMember(id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.family.member(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.family.members });
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.withRelationships,
      });
      toast.success('Family member updated');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Delete a family member
 */
export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFamilyMember,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.family.member(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.family.members });
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.relationships,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.withRelationships,
      });
      toast.success('Family member removed');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

// ============================================================================
// Relationships Hooks
// ============================================================================

/**
 * Get all family relationships
 */
export function useFamilyRelationships() {
  return useQuery({
    queryKey: queryKeys.family.relationships,
    queryFn: getFamilyRelationships,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get relationships for a specific member
 */
export function useMemberRelationships(memberId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.family.memberRelationships(memberId!),
    queryFn: () => getMemberRelationships(memberId!),
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a relationship
 */
export function useCreateRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<FamilyRelationshipInsert, 'parent_id'>) =>
      createRelationship(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.relationships,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.withRelationships,
      });
      toast.success('Relationship created');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Delete a relationship
 */
export function useDeleteRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRelationship,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.relationships,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.family.withRelationships,
      });
      toast.success('Relationship removed');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

// ============================================================================
// Combined Data Hooks
// ============================================================================

/**
 * Get family members with their relationships
 */
export function useFamilyMembersWithRelationships() {
  return useQuery({
    queryKey: queryKeys.family.withRelationships,
    queryFn: getFamilyMembersWithRelationships,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get family events
 */
export function useFamilyEvents() {
  return useQuery({
    queryKey: queryKeys.family.events,
    queryFn: getFamilyEvents,
    staleTime: 5 * 60 * 1000,
  });
}
