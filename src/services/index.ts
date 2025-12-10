/**
 * Services Index
 *
 * Central export point for all service modules.
 * Import from '@/services' for convenient access.
 *
 * @example
 * ```ts
 * import { childProfilesService, storiesService } from '@/services';
 *
 * const profiles = await childProfilesService.getAll();
 * const stories = await storiesService.getByChild(childId);
 * ```
 */

export { childProfilesService } from './childProfiles';
export { storiesService } from './stories';
export { familyService } from './family';
export { journeysService } from './journeys';
export { guardrailsService } from './guardrails';
export { avatarsService } from './avatars';

// Also export individual functions for tree-shaking
export * from './childProfiles';
export * from './stories';
export * from './family';
export * from './journeys';
export * from './guardrails';
export * from './avatars';
