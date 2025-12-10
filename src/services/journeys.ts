/**
 * Journeys Service
 *
 * Data access layer for goal journeys and journey steps.
 */

import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from '@/lib/errors';
import type {
  GoalJourneyRow,
  JourneyStepRow,
  JourneyTemplateRow,
  TablesInsert,
} from '@/types/database';

const handleError = createErrorHandler('journeysService');

type GoalJourneyInsert = TablesInsert<'goal_journeys'>;
type JourneyStepInsert = TablesInsert<'journey_steps'>;

// ============================================================================
// Goal Journeys
// ============================================================================

/**
 * Get all journeys for a child
 */
export async function getJourneysByChild(childId: string): Promise<GoalJourneyRow[]> {
  const { data, error } = await supabase
    .from('goal_journeys')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get active journeys for a child
 */
export async function getActiveJourneys(childId: string): Promise<GoalJourneyRow[]> {
  const { data, error } = await supabase
    .from('goal_journeys')
    .select('*')
    .eq('child_id', childId)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get a journey with its steps
 */
export async function getJourneyWithSteps(journeyId: string): Promise<{
  journey: GoalJourneyRow;
  steps: JourneyStepRow[];
} | null> {
  const [journeyResult, stepsResult] = await Promise.all([
    supabase
      .from('goal_journeys')
      .select('*')
      .eq('id', journeyId)
      .single(),
    supabase
      .from('journey_steps')
      .select('*')
      .eq('journey_id', journeyId)
      .order('step_number'),
  ]);

  if (journeyResult.error) {
    if (journeyResult.error.code === 'PGRST116') {
      return null;
    }
    throw handleError(journeyResult.error, { strategy: 'throw' });
  }

  if (stepsResult.error) {
    throw handleError(stepsResult.error, { strategy: 'throw' });
  }

  return {
    journey: journeyResult.data,
    steps: stepsResult.data || [],
  };
}

/**
 * Create a journey with steps
 */
export async function createJourney(
  journey: Omit<GoalJourneyInsert, 'parent_id'>,
  steps: Omit<JourneyStepInsert, 'journey_id'>[]
): Promise<{ journey: GoalJourneyRow; steps: JourneyStepRow[] }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw handleError(new Error('Not authenticated'), { strategy: 'throw' });
  }

  // Create journey
  const { data: journeyData, error: journeyError } = await supabase
    .from('goal_journeys')
    .insert({
      ...journey,
      parent_id: user.id,
    })
    .select()
    .single();

  if (journeyError) {
    throw handleError(journeyError, {
      strategy: 'throw',
      userMessage: 'Failed to create journey',
    });
  }

  // Create steps
  const stepsWithJourneyId = steps.map((step) => ({
    ...step,
    journey_id: journeyData.id,
  }));

  const { data: stepsData, error: stepsError } = await supabase
    .from('journey_steps')
    .insert(stepsWithJourneyId)
    .select();

  if (stepsError) {
    // Rollback journey creation
    await supabase.from('goal_journeys').delete().eq('id', journeyData.id);
    throw handleError(stepsError, {
      strategy: 'throw',
      userMessage: 'Failed to create journey steps',
    });
  }

  return {
    journey: journeyData,
    steps: stepsData || [],
  };
}

/**
 * Update journey progress
 */
export async function updateJourneyProgress(
  journeyId: string,
  currentStep: number
): Promise<GoalJourneyRow> {
  const { data, error } = await supabase
    .from('goal_journeys')
    .update({
      current_step: currentStep,
      updated_at: new Date().toISOString(),
    })
    .eq('id', journeyId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to update progress',
    });
  }

  return data;
}

/**
 * Complete a journey
 */
export async function completeJourney(journeyId: string): Promise<GoalJourneyRow> {
  const { data, error } = await supabase
    .from('goal_journeys')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', journeyId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to complete journey',
    });
  }

  return data;
}

/**
 * Delete a journey
 */
export async function deleteJourney(journeyId: string): Promise<void> {
  // Steps are deleted via cascade
  const { error } = await supabase
    .from('goal_journeys')
    .delete()
    .eq('id', journeyId);

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to delete journey',
    });
  }
}

// ============================================================================
// Journey Steps
// ============================================================================

/**
 * Complete a journey step
 */
export async function completeStep(
  stepId: string,
  reflection?: string
): Promise<JourneyStepRow> {
  const { data, error } = await supabase
    .from('journey_steps')
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
      reflection,
    })
    .eq('id', stepId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to complete step',
    });
  }

  return data;
}

/**
 * Add reflection to a step
 */
export async function addStepReflection(
  stepId: string,
  reflection: string
): Promise<JourneyStepRow> {
  const { data, error } = await supabase
    .from('journey_steps')
    .update({ reflection })
    .eq('id', stepId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      strategy: 'throw',
      userMessage: 'Failed to save reflection',
    });
  }

  return data;
}

// ============================================================================
// Journey Templates
// ============================================================================

/**
 * Get all journey templates
 */
export async function getJourneyTemplates(): Promise<JourneyTemplateRow[]> {
  const { data, error } = await supabase
    .from('journey_templates')
    .select('*')
    .eq('is_public', true)
    .order('download_count', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(
  category: string
): Promise<JourneyTemplateRow[]> {
  const { data, error } = await supabase
    .from('journey_templates')
    .select('*')
    .eq('category', category)
    .eq('is_public', true)
    .order('rating', { ascending: false });

  if (error) {
    throw handleError(error, { strategy: 'throw' });
  }

  return data || [];
}

/**
 * Get a single template
 */
export async function getTemplate(id: string): Promise<JourneyTemplateRow | null> {
  const { data, error } = await supabase
    .from('journey_templates')
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
 * Increment template download count
 */
export async function incrementTemplateDownloads(templateId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_download_count', {
    template_id: templateId,
  });

  if (error) {
    // Don't throw, just log - this is not critical
    handleError(error, { strategy: 'log' });
  }
}

// Export as a service object
export const journeysService = {
  // Journeys
  getByChild: getJourneysByChild,
  getActive: getActiveJourneys,
  getWithSteps: getJourneyWithSteps,
  create: createJourney,
  updateProgress: updateJourneyProgress,
  complete: completeJourney,
  delete: deleteJourney,

  // Steps
  completeStep,
  addReflection: addStepReflection,

  // Templates
  getTemplates: getJourneyTemplates,
  getTemplatesByCategory,
  getTemplate,
  incrementDownloads: incrementTemplateDownloads,
};
