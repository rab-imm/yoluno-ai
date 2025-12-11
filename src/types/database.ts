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

// Chat Messages
export type ChatMessageRow = Tables<'chat_messages'>;
export type ChatMessageInsert = TablesInsert<'chat_messages'>;

// Child Memory
export type ChildMemoryRow = Tables<'child_memory'>;
export type ChildMemoryInsert = TablesInsert<'child_memory'>;

// Child Stories
export type ChildStoryRow = Tables<'child_stories'>;
export type ChildStoryInsert = TablesInsert<'child_stories'>;
export type ChildStoryUpdate = TablesUpdate<'child_stories'>;

// Family Members
export type FamilyMemberRow = Tables<'family_members'>;
export type FamilyMemberInsert = TablesInsert<'family_members'>;
export type FamilyMemberUpdate = TablesUpdate<'family_members'>;

// Family Relationships
export type FamilyRelationshipRow = Tables<'family_relationships'>;
export type FamilyRelationshipInsert = TablesInsert<'family_relationships'>;

// Family Events
export type FamilyEventRow = Tables<'family_events'>;
export type FamilyEventInsert = TablesInsert<'family_events'>;

// Family Photos
export type FamilyPhotoRow = Tables<'family_photos'>;
export type FamilyPhotoInsert = TablesInsert<'family_photos'>;

// Family Stories
export type FamilyStoryRow = Tables<'family_stories'>;
export type FamilyStoryInsert = TablesInsert<'family_stories'>;

// Goal Journeys
export type GoalJourneyRow = Tables<'goal_journeys'>;
export type GoalJourneyInsert = TablesInsert<'goal_journeys'>;
export type GoalJourneyUpdate = TablesUpdate<'goal_journeys'>;

// Journey Steps
export type JourneyStepRow = Tables<'journey_steps'>;
export type JourneyStepInsert = TablesInsert<'journey_steps'>;
export type JourneyStepUpdate = TablesUpdate<'journey_steps'>;

// Journey Templates
export type JourneyTemplateRow = Tables<'journey_templates'>;

// Guardrail Settings
export type GuardrailSettingsRow = Tables<'guardrail_settings'>;
export type GuardrailSettingsInsert = TablesInsert<'guardrail_settings'>;
export type GuardrailSettingsUpdate = TablesUpdate<'guardrail_settings'>;

// Topic Content
export type TopicContentRow = Tables<'topic_content'>;
export type TopicContentInsert = TablesInsert<'topic_content'>;

// Child Topics
export type ChildTopicRow = Tables<'child_topics'>;
export type ChildTopicInsert = TablesInsert<'child_topics'>;

// Avatar Library
export type AvatarLibraryRow = Tables<'avatar_library'>;

// Child Badges
export type ChildBadgeRow = Tables<'child_badges'>;

// Voice Vault Clips
export type VoiceVaultClipRow = Tables<'voice_vault_clips'>;
export type VoiceVaultClipInsert = TablesInsert<'voice_vault_clips'>;

// Kids Sessions
export type KidsSessionRow = Tables<'kids_sessions'>;
export type KidsSessionInsert = TablesInsert<'kids_sessions'>;

// Parent Alerts
export type ParentAlertRow = Tables<'parent_alerts'>;

// Content Moderation Logs
export type ContentModerationLogRow = Tables<'content_moderation_logs'>;
