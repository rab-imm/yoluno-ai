/**
 * Buddy Chat Service
 *
 * Data access layer for buddy chat operations.
 */

import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/errors';

export interface BuddyChatMessage {
  message: string;
  childId: string;
}

export interface BuddyResponse {
  id: string;
  content: string;
  safetyLevel: 'green' | 'yellow' | 'red';
  timestamp: string;
}

export interface BuddyMessage {
  id: string;
  chat_buddy_id: string;
  child_profile_id: string;
  role: 'child' | 'buddy' | 'system';
  content: string;
  safety_level: 'green' | 'yellow' | 'red';
  safety_flags: string[];
  safety_notes: string | null;
  created_at: string;
}

export interface ChatBuddy {
  id: string;
  child_profile_id: string;
  buddy_name: string;
  buddy_avatar_url: string | null;
  personality_traits: {
    curious: number;
    patient: number;
    playful: number;
    educational: number;
    empathetic: number;
  };
  conversation_context: any[];
  learned_preferences: Record<string, any>;
  total_messages: number;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SafetyReport {
  id: string;
  user_id: string;
  child_profile_id: string;
  message_id: string | null;
  report_type: 'real_time' | 'weekly_summary';
  severity: 'yellow' | 'red';
  issue_summary: string;
  message_excerpt: string | null;
  ai_analysis: string | null;
  reviewed: boolean;
  reviewed_at: string | null;
  parent_notes: string | null;
  created_at: string;
}

/**
 * Send a message to the buddy and get AI response
 */
export async function sendMessageToBuddy(
  params: BuddyChatMessage
): Promise<BuddyResponse> {
  const { data, error } = await supabase.functions.invoke('buddy-chat', {
    body: params,
  });

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.sendMessage',
      userMessage: 'Failed to send message to buddy',
      strategy: 'throw',
    });
  }

  return data;
}

/**
 * Get buddy messages for a child
 */
export async function getBuddyMessages(
  childId: string,
  limit = 50
): Promise<BuddyMessage[]> {
  const { data, error } = await supabase
    .from('buddy_messages')
    .select('*')
    .eq('child_profile_id', childId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.getMessages',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

/**
 * Get chat buddy for a child
 */
export async function getChatBuddy(childId: string): Promise<ChatBuddy | null> {
  const { data, error } = await supabase
    .from('chat_buddies')
    .select('*')
    .eq('child_profile_id', childId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, {
      context: 'buddyChat.getBuddy',
      strategy: 'throw',
    });
  }

  return data;
}

/**
 * Update buddy personality traits
 */
export async function updateBuddyPersonality(
  buddyId: string,
  traits: Partial<ChatBuddy['personality_traits']>
): Promise<ChatBuddy> {
  const { data, error } = await supabase
    .from('chat_buddies')
    .update({ personality_traits: traits })
    .eq('id', buddyId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.updatePersonality',
      strategy: 'throw',
    });
  }

  return data;
}

/**
 * Update buddy name
 */
export async function updateBuddyName(
  buddyId: string,
  name: string
): Promise<ChatBuddy> {
  const { data, error } = await supabase
    .from('chat_buddies')
    .update({ buddy_name: name })
    .eq('id', buddyId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.updateName',
      strategy: 'throw',
    });
  }

  return data;
}

/**
 * Get safety reports for a parent
 */
export async function getSafetyReports(
  userId: string,
  unreadOnly = false
): Promise<SafetyReport[]> {
  let query = supabase
    .from('safety_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.eq('reviewed', false);
  }

  const { data, error } = await query;

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.getSafetyReports',
      strategy: 'throw',
    });
  }

  return data ?? [];
}

/**
 * Mark safety report as reviewed
 */
export async function markSafetyReportReviewed(
  reportId: string,
  notes?: string
): Promise<SafetyReport> {
  const { data, error } = await supabase
    .from('safety_reports')
    .update({
      reviewed: true,
      reviewed_at: new Date().toISOString(),
      parent_notes: notes,
    })
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.markReviewed',
      strategy: 'throw',
    });
  }

  return data;
}

/**
 * Clear chat history (only keeps buddy context)
 */
export async function clearChatHistory(childId: string): Promise<void> {
  const { error } = await supabase
    .from('buddy_messages')
    .delete()
    .eq('child_profile_id', childId);

  if (error) {
    throw handleError(error, {
      context: 'buddyChat.clearHistory',
      strategy: 'throw',
    });
  }
}

export const buddyChatService = {
  sendMessage: sendMessageToBuddy,
  getMessages: getBuddyMessages,
  getBuddy: getChatBuddy,
  updatePersonality: updateBuddyPersonality,
  updateName: updateBuddyName,
  getSafetyReports,
  markReviewed: markSafetyReportReviewed,
  clearHistory: clearChatHistory,
};
