/**
 * Journeys Query Hooks
 *
 * React Query hooks for journey data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from './keys';
import {
  getJourneysByChild,
  getActiveJourneys,
  getJourneyWithSteps,
  createJourney,
  updateJourneyProgress,
  completeJourney,
  deleteJourney,
  completeStep,
  addStepReflection,
  getJourneyTemplates,
  getTemplatesByCategory,
  getTemplate,
} from '@/services/journeys';
import type { TablesInsert } from '@/types/database';

type GoalJourneyInsert = TablesInsert<'goal_journeys'>;
type JourneyStepInsert = TablesInsert<'journey_steps'>;

/**
 * Get all journeys for a child
 */
export function useJourneysByChild(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.journeys.byChild(childId!),
    queryFn: () => getJourneysByChild(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get active journeys for a child
 */
export function useActiveJourneys(childId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.journeys.active(childId!),
    queryFn: () => getActiveJourneys(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent for active data
  });
}

/**
 * Get a journey with its steps
 */
export function useJourneyWithSteps(journeyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.journeys.withSteps(journeyId!),
    queryFn: () => getJourneyWithSteps(journeyId!),
    enabled: !!journeyId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get all journey templates
 */
export function useJourneyTemplates() {
  return useQuery({
    queryKey: queryKeys.journeys.templates,
    queryFn: getJourneyTemplates,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Get journey templates by category
 */
export function useTemplatesByCategory(category: string | undefined) {
  return useQuery({
    queryKey: queryKeys.journeys.templatesByCategory(category!),
    queryFn: () => getTemplatesByCategory(category!),
    enabled: !!category,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Get a single journey template
 */
export function useJourneyTemplate(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.journeys.template(id!),
    queryFn: () => getTemplate(id!),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Create a journey with steps
 */
export function useCreateJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journey,
      steps,
    }: {
      journey: Omit<GoalJourneyInsert, 'parent_id'>;
      steps: Omit<JourneyStepInsert, 'journey_id'>[];
    }) => createJourney(journey, steps),
    onSuccess: ({ journey }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.byChild(journey.child_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.active(journey.child_id),
      });
      toast.success('Journey started!');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Update journey progress
 */
export function useUpdateJourneyProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      journeyId,
      currentStep,
    }: {
      journeyId: string;
      currentStep: number;
    }) => updateJourneyProgress(journeyId, currentStep),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.journeys.byId(updated.id), updated);
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.withSteps(updated.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.byChild(updated.child_id),
      });
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Complete a journey
 */
export function useCompleteJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeJourney,
    onSuccess: (completed) => {
      queryClient.setQueryData(queryKeys.journeys.byId(completed.id), completed);
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.withSteps(completed.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.byChild(completed.child_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.active(completed.child_id),
      });
      toast.success('Journey completed! Great job!');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Delete a journey
 */
export function useDeleteJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJourney,
    onSuccess: (_, journeyId) => {
      // Get cached data for invalidation
      const cached = queryClient.getQueryData<{ journey: { child_id: string } }>(
        queryKeys.journeys.withSteps(journeyId)
      );

      queryClient.removeQueries({
        queryKey: queryKeys.journeys.byId(journeyId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.journeys.withSteps(journeyId),
      });

      if (cached?.journey?.child_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.journeys.byChild(cached.journey.child_id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.journeys.active(cached.journey.child_id),
        });
      }

      toast.success('Journey deleted');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Complete a journey step
 */
export function useCompleteStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepId,
      reflection,
    }: {
      stepId: string;
      journeyId: string;
      reflection?: string;
    }) => completeStep(stepId, reflection),
    onSuccess: (_, { journeyId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.withSteps(journeyId),
      });
      toast.success('Step completed!');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}

/**
 * Add reflection to a step
 */
export function useAddStepReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stepId,
      reflection,
    }: {
      stepId: string;
      journeyId: string;
      reflection: string;
    }) => addStepReflection(stepId, reflection),
    onSuccess: (_, { journeyId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journeys.withSteps(journeyId),
      });
      toast.success('Reflection saved');
    },
    onError: () => {
      // Error handled by service layer
    },
  });
}
