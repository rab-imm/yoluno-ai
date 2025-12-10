/**
 * Guardrails Query Hooks
 *
 * React Query hooks for guardrail settings.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './keys';
import {
  getGuardrailSettings,
  getOrCreateGuardrailSettings,
  updateGuardrailSettings,
  addBlockedKeyword,
  removeBlockedKeyword,
  addAllowedPhrase,
  removeAllowedPhrase,
  resetToDefaults,
} from '@/services/guardrails';
import type { GuardrailSettingsUpdate } from '@/types/database';

/**
 * Get guardrail settings
 */
export function useGuardrailSettings() {
  return useQuery({
    queryKey: queryKeys.guardrails.settings,
    queryFn: getOrCreateGuardrailSettings,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Update guardrail settings
 */
export function useUpdateGuardrailSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: GuardrailSettingsUpdate) =>
      updateGuardrailSettings(updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.guardrails.settings, updated);
      toast.success('Settings saved');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Add a blocked keyword
 */
export function useAddBlockedKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBlockedKeyword,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.guardrails.settings, updated);
      toast.success('Keyword added to blocklist');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Remove a blocked keyword
 */
export function useRemoveBlockedKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBlockedKeyword,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.guardrails.settings, updated);
      toast.success('Keyword removed from blocklist');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Add an allowed phrase
 */
export function useAddAllowedPhrase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAllowedPhrase,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.guardrails.settings, updated);
      toast.success('Phrase added to allowlist');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Remove an allowed phrase
 */
export function useRemoveAllowedPhrase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAllowedPhrase,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.guardrails.settings, updated);
      toast.success('Phrase removed from allowlist');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Reset settings to defaults
 */
export function useResetGuardrailSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetToDefaults,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.guardrails.settings, updated);
      toast.success('Settings reset to defaults');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}
