/**
 * Guardrails Service
 *
 * Data access layer for safety guardrail settings.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  GuardrailSettingsRow,
  GuardrailSettingsInsert,
  GuardrailSettingsUpdate,
} from '@/types/database';
import type { GuardrailSettings } from '@/types/domain';
import { DEFAULT_GUARDRAIL_SETTINGS } from '@/types/domain';
import { handleError } from '@/lib/errors';

export async function getGuardrailSettings(
  childId: string
): Promise<GuardrailSettings> {
  const { data, error } = await supabase
    .from('guardrail_settings')
    .select('*')
    .eq('child_profile_id', childId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { ...DEFAULT_GUARDRAIL_SETTINGS } as GuardrailSettings;
    }
    throw handleError(error, {
      context: 'guardrails.getGuardrailSettings',
      strategy: 'throw',
    });
  }

  return mapRowToSettings(data);
}

export async function createGuardrailSettings(
  settings: GuardrailSettingsInsert
): Promise<GuardrailSettingsRow> {
  const { data, error } = await supabase
    .from('guardrail_settings')
    .insert(settings)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'guardrails.createGuardrailSettings',
      strategy: 'throw',
    });
  }

  return data;
}

export async function updateGuardrailSettings(
  childId: string,
  updates: GuardrailSettingsUpdate
): Promise<GuardrailSettingsRow> {
  const { data: existing } = await supabase
    .from('guardrail_settings')
    .select('id')
    .eq('child_profile_id', childId)
    .single();

  if (!existing) {
    return createGuardrailSettings({
      child_profile_id: childId,
      ...updates,
    } as GuardrailSettingsInsert);
  }

  const { data, error } = await supabase
    .from('guardrail_settings')
    .update(updates)
    .eq('child_profile_id', childId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'guardrails.updateGuardrailSettings',
      strategy: 'throw',
    });
  }

  return data;
}

export async function resetGuardrailSettings(childId: string): Promise<GuardrailSettingsRow> {
  const defaults: GuardrailSettingsUpdate = {
    safety_level: 'strict',
    allowed_topics: [],
    blocked_topics: [],
    max_session_minutes: 30,
    require_breaks: true,
    break_interval_minutes: 15,
    content_filters_enabled: true,
  };

  return updateGuardrailSettings(childId, defaults);
}

export async function addBlockedTopic(
  childId: string,
  topic: string
): Promise<GuardrailSettingsRow> {
  const current = await getGuardrailSettings(childId);
  const blockedTopics = [...(current.blockedTopics ?? [])];

  if (!blockedTopics.includes(topic)) {
    blockedTopics.push(topic);
  }

  return updateGuardrailSettings(childId, { blocked_topics: blockedTopics });
}

export async function removeBlockedTopic(
  childId: string,
  topic: string
): Promise<GuardrailSettingsRow> {
  const current = await getGuardrailSettings(childId);
  const blockedTopics = (current.blockedTopics ?? []).filter((t) => t !== topic);

  return updateGuardrailSettings(childId, { blocked_topics: blockedTopics });
}

function mapRowToSettings(row: GuardrailSettingsRow): GuardrailSettings {
  return {
    safetyLevel: row.safety_level as GuardrailSettings['safetyLevel'],
    allowedTopics: row.allowed_topics ?? [],
    blockedTopics: row.blocked_topics ?? [],
    maxSessionMinutes: row.max_session_minutes ?? 30,
    requireBreaks: row.require_breaks ?? true,
    breakIntervalMinutes: row.break_interval_minutes ?? 15,
    contentFiltersEnabled: row.content_filters_enabled ?? true,
  };
}

export const guardrailsService = {
  get: getGuardrailSettings,
  create: createGuardrailSettings,
  update: updateGuardrailSettings,
  reset: resetGuardrailSettings,
  addBlockedTopic,
  removeBlockedTopic,
};
