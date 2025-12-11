/**
 * Guardrails Query Hooks
 *
 * React Query hooks for safety guardrail settings.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import { guardrailsService } from '@/services/guardrails';
import type { GuardrailSettingsUpdate } from '@/types/database';
import { handleError } from '@/lib/errors';

export function useGuardrailSettings(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.guardrails.settings(childId ?? ''),
    queryFn: () => guardrailsService.get(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateGuardrailSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ childId, updates }: { childId: string; updates: GuardrailSettingsUpdate }) =>
      guardrailsService.update(childId, updates),
    onSuccess: (_, { childId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guardrails.settings(childId),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useUpdateGuardrailSettings',
        userMessage: 'Failed to update safety settings',
      });
    },
  });
}

export function useResetGuardrailSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (childId: string) => guardrailsService.reset(childId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guardrails.settings(data.child_profile_id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useResetGuardrailSettings',
        userMessage: 'Failed to reset safety settings',
      });
    },
  });
}

export function useAddBlockedTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ childId, topic }: { childId: string; topic: string }) =>
      guardrailsService.addBlockedTopic(childId, topic),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guardrails.settings(data.child_profile_id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useAddBlockedTopic',
        userMessage: 'Failed to block topic',
      });
    },
  });
}

export function useRemoveBlockedTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ childId, topic }: { childId: string; topic: string }) =>
      guardrailsService.removeBlockedTopic(childId, topic),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guardrails.settings(data.child_profile_id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useRemoveBlockedTopic',
        userMessage: 'Failed to unblock topic',
      });
    },
  });
}
