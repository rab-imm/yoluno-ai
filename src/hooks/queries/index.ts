/**
 * Query Hooks Index
 *
 * Central export point for all React Query hooks.
 *
 * @example
 * ```ts
 * import {
 *   useChildProfiles,
 *   useCreateChildProfile,
 *   useStoriesByChild,
 *   queryKeys
 * } from '@/hooks/queries';
 * ```
 */

// Query key factory
export { queryKeys, type QueryKeys } from './keys';

// Child Profiles
export {
  useChildProfiles,
  useChildProfile,
  useChildProfileWithAvatar,
  useCreateChildProfile,
  useUpdateChildProfile,
  useDeleteChildProfile,
  useUpdateChildAvatar,
  useSetChildPin,
} from './useChildProfiles';

// Stories
export {
  useStoriesByChild,
  useStoriesWithChildData,
  useStory,
  useFavoriteStories,
  useBedtimeStories,
  useRecentStories,
  useStoryThemes,
  useCreateStory,
  useUpdateStory,
  useToggleFavorite,
  useDeleteStory,
} from './useStories';

// Journeys
export {
  useJourneysByChild,
  useActiveJourneys,
  useJourneyWithSteps,
  useJourneyTemplates,
  useTemplatesByCategory,
  useJourneyTemplate,
  useCreateJourney,
  useUpdateJourneyProgress,
  useCompleteJourney,
  useDeleteJourney,
  useCompleteStep,
  useAddStepReflection,
} from './useJourneys';

// Guardrails
export {
  useGuardrailSettings,
  useUpdateGuardrailSettings,
  useAddBlockedKeyword,
  useRemoveBlockedKeyword,
  useAddAllowedPhrase,
  useRemoveAllowedPhrase,
  useResetGuardrailSettings,
} from './useGuardrails';

// Avatars
export {
  useAvatarLibrary,
  useAvatarsByCategory,
  useAvatar,
  useAvatarCategories,
  useSearchAvatars,
  prefetchAvatarsByCategory,
  invalidateAvatarCache,
} from './useAvatars';

// Family
export {
  useFamilyMembers,
  useFamilyMember,
  useCreateFamilyMember,
  useUpdateFamilyMember,
  useDeleteFamilyMember,
  useFamilyRelationships,
  useMemberRelationships,
  useCreateRelationship,
  useDeleteRelationship,
  useFamilyMembersWithRelationships,
  useFamilyEvents,
} from './useFamily';
