/**
 * Services Index
 *
 * Barrel export for all data access services.
 */

// Child profiles
export * from './childProfiles';
export { childProfilesService } from './childProfiles';

// Stories
export * from './stories';
export { storiesService } from './stories';

// Family
export * from './family';
export { familyService } from './family';

// Journeys
export * from './journeys';
export { journeysService } from './journeys';

// Guardrails
export * from './guardrails';
export { guardrailsService } from './guardrails';

// Avatars
export * from './avatars';
export { avatarsService } from './avatars';

// Cache
export { IndexedDBCache, avatarCache, storyCache } from './cache/indexedDBCache';

// Text-to-Speech
export * from './textToSpeech';
export { textToSpeechService } from './textToSpeech';

// Story Generation
export * from './storyGeneration';
export { storyGenerationService } from './storyGeneration';

// Buddy Chat
export * from './buddyChat';
