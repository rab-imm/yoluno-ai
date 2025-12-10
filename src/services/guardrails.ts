/**
 * Guardrails Service
 *
 * Data access layer for parental guardrail settings.
 */

import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/lib/errors';
import type {
  GuardrailSettingsRow,
  GuardrailSettingsInsert,
  GuardrailSettingsUpdate,
} from '@/types/database';
import { DEFAULT_GUARDRAIL_SETTINGS } from '@/types/domain';

const handleError = createErrorHandler('guardrailsService');

/**
 * Get guardrail settings for the current user
 */
export async function getGuardrailSettings(): Promise<GuardrailSettingsRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('guardrail_settings')
    .select('*')
    .eq('parent_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found - use defaults
    }
    throw handleError(error, { strategy: 'throw' });
  }

  return data;
}

/**
 * Get guardrail settings or create with defaults
 */
export async function getOrCreateGuardrailSettings(): Promise<GuardrailSettingsRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  // Try to get existing
  const { data: existing, error: fetchError } = await supabase
    .from('guardrail_settings')
    .select('*')
    .eq('parent_id', user.id)
    .single();

  if (existing) {
    return existing;
  }

  // Not found, create with defaults
  if (fetchError && fetchError.code === 'PGRST116') {
    const { data: created, error: createError } = await supabase
      .from('guardrail_settings')
      .insert({
        parent_id: user.id,
        ...DEFAULT_GUARDRAIL_SETTINGS,
      } as GuardrailSettingsInsert)
      .select()
      .single();

    if (createError) {
      throw handleError(createError, {
        strategy: 'throw',
        userMessage: 'Failed to create guardrail settings',
      });
    }

    return created;
  }

  throw handleError(fetchError, { strategy: 'throw' });
}

/**
 * Update guardrail settings
 */
export async function updateGuardrailSettings(
  updates: GuardrailSettingsUpdate
): Promise<GuardrailSettingsRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  const { data, error } = await supabase
    .from('guardrail_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('parent_id', user.id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update guardrail settings',
    });
  }

  return data;
}

/**
 * Add blocked keyword
 */
export async function addBlockedKeyword(keyword: string): Promise<GuardrailSettingsRow> {
  const settings = await getOrCreateGuardrailSettings();
  const currentKeywords = settings.custom_blocked_keywords || [];

  if (currentKeywords.includes(keyword)) {
    return settings; // Already exists
  }

  return updateGuardrailSettings({
    custom_blocked_keywords: [...currentKeywords, keyword],
  });
}

/**
 * Remove blocked keyword
 */
export async function removeBlockedKeyword(keyword: string): Promise<GuardrailSettingsRow> {
  const settings = await getOrCreateGuardrailSettings();
  const currentKeywords = settings.custom_blocked_keywords || [];

  return updateGuardrailSettings({
    custom_blocked_keywords: currentKeywords.filter((k) => k !== keyword),
  });
}

/**
 * Add allowed phrase
 */
export async function addAllowedPhrase(phrase: string): Promise<GuardrailSettingsRow> {
  const settings = await getOrCreateGuardrailSettings();
  const currentPhrases = settings.custom_allowed_phrases || [];

  if (currentPhrases.includes(phrase)) {
    return settings;
  }

  return updateGuardrailSettings({
    custom_allowed_phrases: [...currentPhrases, phrase],
  });
}

/**
 * Remove allowed phrase
 */
export async function removeAllowedPhrase(phrase: string): Promise<GuardrailSettingsRow> {
  const settings = await getOrCreateGuardrailSettings();
  const currentPhrases = settings.custom_allowed_phrases || [];

  return updateGuardrailSettings({
    custom_allowed_phrases: currentPhrases.filter((p) => p !== phrase),
  });
}

/**
 * Reset settings to defaults
 */
export async function resetToDefaults(): Promise<GuardrailSettingsRow> {
  return updateGuardrailSettings(DEFAULT_GUARDRAIL_SETTINGS as GuardrailSettingsUpdate);
}

// Export as a service object
export const guardrailsService = {
  get: getGuardrailSettings,
  getOrCreate: getOrCreateGuardrailSettings,
  update: updateGuardrailSettings,
  addBlockedKeyword,
  removeBlockedKeyword,
  addAllowedPhrase,
  removeAllowedPhrase,
  resetToDefaults,
};
