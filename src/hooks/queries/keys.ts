/**
 * Query Keys Factory
 *
 * Centralized query key definitions for React Query.
 */

export const queryKeys = {
  // Child Profiles
  childProfiles: {
    all: ['child-profiles'] as const,
    lists: () => [...queryKeys.childProfiles.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.childProfiles.lists(), userId] as const,
    details: () => [...queryKeys.childProfiles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.childProfiles.details(), id] as const,
  },

  // Stories
  stories: {
    all: ['stories'] as const,
    lists: () => [...queryKeys.stories.all, 'list'] as const,
    listByChild: (childId: string) => [...queryKeys.stories.lists(), 'child', childId] as const,
    favorites: (childId: string) => [...queryKeys.stories.lists(), 'favorites', childId] as const,
    recent: (userId: string) => [...queryKeys.stories.lists(), 'recent', userId] as const,
    details: () => [...queryKeys.stories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.stories.details(), id] as const,
  },

  // Family
  family: {
    all: ['family'] as const,
    members: (userId: string) => [...queryKeys.family.all, 'members', userId] as const,
    member: (id: string) => [...queryKeys.family.all, 'member', id] as const,
    relationships: (userId: string) => [...queryKeys.family.all, 'relationships', userId] as const,
    tree: (userId: string) => [...queryKeys.family.all, 'tree', userId] as const,
  },

  // Journeys
  journeys: {
    all: ['journeys'] as const,
    lists: () => [...queryKeys.journeys.all, 'list'] as const,
    active: (childId: string) => [...queryKeys.journeys.lists(), 'active', childId] as const,
    completed: (childId: string) => [...queryKeys.journeys.lists(), 'completed', childId] as const,
    details: () => [...queryKeys.journeys.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.journeys.details(), id] as const,
    progress: (id: string) => [...queryKeys.journeys.all, 'progress', id] as const,
  },

  // Guardrails
  guardrails: {
    all: ['guardrails'] as const,
    settings: (childId: string) => [...queryKeys.guardrails.all, 'settings', childId] as const,
  },

  // Avatars
  avatars: {
    all: ['avatars'] as const,
    lists: () => [...queryKeys.avatars.all, 'list'] as const,
    listAll: () => [...queryKeys.avatars.lists(), 'all'] as const,
    listByCategory: (category: string) => [...queryKeys.avatars.lists(), 'category', category] as const,
    categories: () => [...queryKeys.avatars.all, 'categories'] as const,
    details: () => [...queryKeys.avatars.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.avatars.details(), id] as const,
    search: (query: string) => [...queryKeys.avatars.all, 'search', query] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // Chat
  chat: {
    all: ['chat'] as const,
    messages: (sessionId: string) => [...queryKeys.chat.all, 'messages', sessionId] as const,
    session: (childId: string) => [...queryKeys.chat.all, 'session', childId] as const,
  },
} as const;
