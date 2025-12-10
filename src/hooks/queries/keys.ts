/**
 * Query Keys Factory
 *
 * Centralized query key definitions for React Query.
 * Use these to ensure consistent cache invalidation.
 *
 * @example
 * ```ts
 * import { queryKeys } from '@/hooks/queries/keys';
 *
 * // In a query
 * useQuery({
 *   queryKey: queryKeys.childProfiles.all,
 *   queryFn: ...
 * });
 *
 * // For invalidation
 * queryClient.invalidateQueries({ queryKey: queryKeys.childProfiles.all });
 * ```
 */

export const queryKeys = {
  // Child Profiles
  childProfiles: {
    all: ['child-profiles'] as const,
    byId: (id: string) => ['child-profiles', id] as const,
    withAvatar: (id: string) => ['child-profiles', id, 'with-avatar'] as const,
  },

  // Stories
  stories: {
    all: ['stories'] as const,
    byChild: (childId: string) => ['stories', 'child', childId] as const,
    byId: (id: string) => ['stories', id] as const,
    favorites: (childId: string) => ['stories', 'child', childId, 'favorites'] as const,
    bedtime: (childId: string) => ['stories', 'child', childId, 'bedtime'] as const,
    recent: (limit?: number) => ['stories', 'recent', limit] as const,
    themes: ['stories', 'themes'] as const,
  },

  // Family
  family: {
    members: ['family', 'members'] as const,
    member: (id: string) => ['family', 'members', id] as const,
    relationships: ['family', 'relationships'] as const,
    memberRelationships: (memberId: string) =>
      ['family', 'relationships', memberId] as const,
    withRelationships: ['family', 'with-relationships'] as const,
    events: ['family', 'events'] as const,
  },

  // Journeys
  journeys: {
    all: ['journeys'] as const,
    byChild: (childId: string) => ['journeys', 'child', childId] as const,
    active: (childId: string) => ['journeys', 'child', childId, 'active'] as const,
    byId: (id: string) => ['journeys', id] as const,
    withSteps: (id: string) => ['journeys', id, 'with-steps'] as const,
    templates: ['journeys', 'templates'] as const,
    templatesByCategory: (category: string) =>
      ['journeys', 'templates', category] as const,
    template: (id: string) => ['journeys', 'templates', id] as const,
  },

  // Guardrails
  guardrails: {
    settings: ['guardrails', 'settings'] as const,
  },

  // Avatars
  avatars: {
    all: ['avatars'] as const,
    byCategory: (category: string) => ['avatars', 'category', category] as const,
    byId: (id: string) => ['avatars', id] as const,
    categories: ['avatars', 'categories'] as const,
    search: (query: string) => ['avatars', 'search', query] as const,
  },

  // Activity
  activity: {
    global: ['activity', 'global'] as const,
    byChild: (childId: string) => ['activity', 'child', childId] as const,
    summary: (childId: string) => ['activity', 'summary', childId] as const,
  },

  // Badges
  badges: {
    byChild: (childId: string) => ['badges', 'child', childId] as const,
  },

  // Chat
  chat: {
    messages: (childId: string) => ['chat', 'messages', childId] as const,
    summaries: (childId: string) => ['chat', 'summaries', childId] as const,
  },

  // Topics
  topics: {
    byChild: (childId: string) => ['topics', 'child', childId] as const,
    packs: ['topics', 'packs'] as const,
    customPacks: ['topics', 'custom-packs'] as const,
    analytics: (childId: string) => ['topics', 'analytics', childId] as const,
  },

  // Content
  content: {
    library: ['content', 'library'] as const,
    custom: ['content', 'custom'] as const,
    approved: (childId?: string) => ['content', 'approved', childId] as const,
  },

  // Voice Vault
  voiceVault: {
    clips: ['voice-vault', 'clips'] as const,
    clip: (id: string) => ['voice-vault', 'clips', id] as const,
  },

  // Alerts
  alerts: {
    all: ['alerts'] as const,
    unread: ['alerts', 'unread'] as const,
  },
} as const;

/**
 * Get query key for a specific resource
 */
export type QueryKeys = typeof queryKeys;
