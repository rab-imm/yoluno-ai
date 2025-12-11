/**
 * Journeys Service
 *
 * Data access layer for learning journey operations.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  JourneyRow,
  JourneyInsert,
  JourneyUpdate,
  JourneyStepRow,
  JourneyStepUpdate,
} from '@/types/database';
import type { JourneyWithSteps, JourneyStep } from '@/types/domain';
import { handleError } from '@/lib/errors';

export async function getActiveJourneys(childId: string): Promise<JourneyWithSteps[]> {
  const { data, error } = await supabase
    .from('journeys')
    .select(`
      *,
      journey_steps(*)
    `)
    .eq('child_profile_id', childId)
    .in('status', ['active', 'in_progress'])
    .order('created_at', { ascending: false });

  if (error) {
    throw handleError(error, {
      context: 'journeys.getActiveJourneys',
      strategy: 'throw',
    });
  }

  return (data ?? []).map(mapJourneyWithSteps);
}

export async function getJourneyById(id: string): Promise<JourneyWithSteps | null> {
  const { data, error } = await supabase
    .from('journeys')
    .select(`
      *,
      journey_steps(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw handleError(error, {
      context: 'journeys.getJourneyById',
      strategy: 'throw',
    });
  }

  return mapJourneyWithSteps(data);
}

export async function createJourney(journey: JourneyInsert): Promise<JourneyRow> {
  const { data, error } = await supabase
    .from('journeys')
    .insert(journey)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'journeys.createJourney',
      strategy: 'throw',
    });
  }

  return data;
}

export async function updateJourney(
  id: string,
  updates: JourneyUpdate
): Promise<JourneyRow> {
  const { data, error } = await supabase
    .from('journeys')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'journeys.updateJourney',
      strategy: 'throw',
    });
  }

  return data;
}

export async function completeStep(stepId: string): Promise<JourneyStepRow> {
  const updates: JourneyStepUpdate = {
    status: 'completed',
    completed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('journey_steps')
    .update(updates)
    .eq('id', stepId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'journeys.completeStep',
      strategy: 'throw',
    });
  }

  return data;
}

export async function updateStepProgress(
  stepId: string,
  progress: number
): Promise<JourneyStepRow> {
  const { data, error } = await supabase
    .from('journey_steps')
    .update({ progress })
    .eq('id', stepId)
    .select()
    .single();

  if (error) {
    throw handleError(error, {
      context: 'journeys.updateStepProgress',
      strategy: 'throw',
    });
  }

  return data;
}

export async function getCompletedJourneys(childId: string): Promise<JourneyWithSteps[]> {
  const { data, error } = await supabase
    .from('journeys')
    .select(`
      *,
      journey_steps(*)
    `)
    .eq('child_profile_id', childId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error) {
    throw handleError(error, {
      context: 'journeys.getCompletedJourneys',
      strategy: 'throw',
    });
  }

  return (data ?? []).map(mapJourneyWithSteps);
}

export async function getJourneyProgress(journeyId: string): Promise<{
  totalSteps: number;
  completedSteps: number;
  progressPercent: number;
}> {
  const { data, error } = await supabase
    .from('journey_steps')
    .select('status')
    .eq('journey_id', journeyId);

  if (error) {
    throw handleError(error, {
      context: 'journeys.getJourneyProgress',
      strategy: 'throw',
    });
  }

  const steps = data ?? [];
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return { totalSteps, completedSteps, progressPercent };
}

function mapJourneyWithSteps(
  data: JourneyRow & { journey_steps?: JourneyStepRow[] }
): JourneyWithSteps {
  const steps: JourneyStep[] = (data.journey_steps ?? [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description ?? '',
      type: step.type as JourneyStep['type'],
      status: step.status as JourneyStep['status'],
      order: step.order_index,
      progress: step.progress ?? 0,
      completedAt: step.completed_at ? new Date(step.completed_at) : undefined,
    }));

  return {
    id: data.id,
    title: data.title,
    description: data.description ?? '',
    status: data.status as JourneyWithSteps['status'],
    templateId: data.template_id ?? undefined,
    childProfileId: data.child_profile_id,
    steps,
    progress: calculateProgress(steps),
    createdAt: new Date(data.created_at),
    completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
  };
}

function calculateProgress(steps: JourneyStep[]): number {
  if (steps.length === 0) return 0;
  const completed = steps.filter((s) => s.status === 'completed').length;
  return Math.round((completed / steps.length) * 100);
}

export const journeysService = {
  getActive: getActiveJourneys,
  getById: getJourneyById,
  create: createJourney,
  update: updateJourney,
  completeStep,
  updateStepProgress,
  getCompleted: getCompletedJourneys,
  getProgress: getJourneyProgress,
};
