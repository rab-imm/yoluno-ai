/**
 * Database Types
 *
 * Type aliases for Supabase database tables.
 * These provide clean imports and better type inference.
 */

import type { Database } from '@/integrations/supabase/types';

// Table row types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Child Profile
export type ChildProfileRow = Tables<'child_profiles'>;
export type ChildProfileInsert = TablesInsert<'child_profiles'>;
export type ChildProfileUpdate = TablesUpdate<'child_profiles'>;

// Stories
export type StoryRow = Tables<'stories'>;
export type StoryInsert = TablesInsert<'stories'>;
export type StoryUpdate = TablesUpdate<'stories'>;

// Chat Sessions
export type ChatSessionRow = Tables<'chat_sessions'>;
export type ChatSessionInsert = TablesInsert<'chat_sessions'>;

// Chat Messages
export type ChatMessageRow = Tables<'chat_messages'>;
export type ChatMessageInsert = TablesInsert<'chat_messages'>;

// Family Members
export type FamilyMemberRow = Tables<'family_members'>;
export type FamilyMemberInsert = TablesInsert<'family_members'>;
export type FamilyMemberUpdate = TablesUpdate<'family_members'>;

// Family Relationships
export type FamilyRelationshipRow = Tables<'family_relationships'>;
export type FamilyRelationshipInsert = TablesInsert<'family_relationships'>;

// Journeys
export type JourneyRow = Tables<'journeys'>;
export type JourneyInsert = TablesInsert<'journeys'>;
export type JourneyUpdate = TablesUpdate<'journeys'>;

// Journey Steps
export type JourneyStepRow = Tables<'journey_steps'>;
export type JourneyStepInsert = TablesInsert<'journey_steps'>;
export type JourneyStepUpdate = TablesUpdate<'journey_steps'>;

// Guardrail Settings
export type GuardrailSettingsRow = Tables<'guardrail_settings'>;
export type GuardrailSettingsInsert = TablesInsert<'guardrail_settings'>;
export type GuardrailSettingsUpdate = TablesUpdate<'guardrail_settings'>;

// Avatar Library
export type AvatarLibraryRow = Tables<'avatar_library'>;

// User Subscriptions
export type UserSubscriptionRow = Tables<'user_subscriptions'>;
export type UserSubscriptionInsert = TablesInsert<'user_subscriptions'>;
export type UserSubscriptionUpdate = TablesUpdate<'user_subscriptions'>;
