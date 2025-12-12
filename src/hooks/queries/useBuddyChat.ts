/**
 * Buddy Chat Query Hooks
 *
 * React Query hooks for buddy chat operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './keys';
import {
  buddyChatService,
  type BuddyChatMessage,
  type ChatBuddy,
} from '@/services/buddyChat';
import { handleError } from '@/lib/errors';

/**
 * Hook to fetch buddy messages for a child
 * Note: Real-time updates handled by Supabase subscriptions in BuddyChat component
 */
export function useBuddyMessages(childId: string | undefined, limit = 50) {
  return useQuery({
    queryKey: queryKeys.buddyChat.messages(childId ?? ''),
    queryFn: () => buddyChatService.getMessages(childId!, limit),
    enabled: !!childId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get the chat buddy profile for a child
 */
export function useChatBuddy(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.buddyChat.buddy(childId ?? ''),
    queryFn: () => buddyChatService.getBuddy(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get safety reports for a parent
 * Real-time updates recommended via Supabase subscriptions
 */
export function useSafetyReports(
  userId: string | undefined,
  unreadOnly = false
) {
  return useQuery({
    queryKey: queryKeys.buddyChat.safetyReports(userId ?? '', unreadOnly),
    queryFn: () => buddyChatService.getSafetyReports(userId!, unreadOnly),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Mutation hook to send a message to the buddy
 * Automatically invalidates message queries on success
 */
export function useSendBuddyMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: BuddyChatMessage) =>
      buddyChatService.sendMessage(params),
    onSuccess: (_, variables) => {
      // Invalidate messages to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.messages(variables.childId),
      });
      // Invalidate buddy to update stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.buddy(variables.childId),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useSendBuddyMessage',
        userMessage: 'Failed to send message to buddy',
      });
    },
  });
}

/**
 * Mutation hook to update buddy personality traits
 */
export function useUpdateBuddyPersonality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      buddyId,
      traits,
    }: {
      buddyId: string;
      traits: Partial<ChatBuddy['personality_traits']>;
    }) => buddyChatService.updatePersonality(buddyId, traits),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.buddy(data.child_profile_id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useUpdateBuddyPersonality',
        userMessage: 'Failed to update buddy personality',
      });
    },
  });
}

/**
 * Mutation hook to update buddy name
 */
export function useUpdateBuddyName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ buddyId, name }: { buddyId: string; name: string }) =>
      buddyChatService.updateName(buddyId, name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.buddy(data.child_profile_id),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useUpdateBuddyName',
        userMessage: 'Failed to update buddy name',
      });
    },
  });
}

/**
 * Mutation hook to mark a safety report as reviewed
 */
export function useMarkSafetyReportReviewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, notes }: { reportId: string; notes?: string }) =>
      buddyChatService.markReviewed(reportId, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.safetyReports(data.user_id, false),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.safetyReports(data.user_id, true),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useMarkSafetyReportReviewed',
        userMessage: 'Failed to mark safety report as reviewed',
      });
    },
  });
}

/**
 * Mutation hook to clear chat history
 */
export function useClearChatHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (childId: string) => buddyChatService.clearHistory(childId),
    onSuccess: (_, childId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.messages(childId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.buddyChat.buddy(childId),
      });
    },
    onError: (error) => {
      handleError(error, {
        context: 'useClearChatHistory',
        userMessage: 'Failed to clear chat history',
      });
    },
  });
}
