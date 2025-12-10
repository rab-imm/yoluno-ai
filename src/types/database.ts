/**
 * Database Types
 *
 * Re-exports and extends the auto-generated Supabase types.
 * Use these types throughout the application for type safety.
 */

// Re-export the core utility types from Supabase
export type {
  Json,
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from '@/integrations/supabase/types';

// Re-export constants for enum values
export { Constants } from '@/integrations/supabase/types';

// Convenience type aliases for Row types (read operations)
export type AvatarAccessoryRow = Tables<'avatar_accessories'>;
export type AvatarLibraryRow = Tables<'avatar_library'>;
export type ChatMessageRow = Tables<'chat_messages'>;
export type ChatSessionMetricsRow = Tables<'chat_session_metrics'>;
export type ChildBadgeRow = Tables<'child_badges'>;
export type ChildFeedbackRow = Tables<'child_feedback'>;
export type ChildMemoryRow = Tables<'child_memory'>;
export type ChildProfileRow = Tables<'child_profiles'>;
export type ChildStoryRow = Tables<'child_stories'>;
export type ChildTopicRow = Tables<'child_topics'>;
export type ContentModerationLogRow = Tables<'content_moderation_logs'>;
export type ConversationStatsRow = Tables<'conversation_stats'>;
export type ConversationSummaryRow = Tables<'conversation_summaries'>;
export type CustomContentRow = Tables<'custom_content'>;
export type CustomTopicPackRow = Tables<'custom_topic_packs'>;
export type FamilyEventRow = Tables<'family_events'>;
export type FamilyHistoryAccessRow = Tables<'family_history_access'>;
export type FamilyMemberRow = Tables<'family_members'>;
export type FamilyNarrativeRow = Tables<'family_narratives'>;
export type FamilyPhotoRow = Tables<'family_photos'>;
export type FamilyRelationshipRow = Tables<'family_relationships'>;
export type FamilyStoryRow = Tables<'family_stories'>;
export type GoalJourneyRow = Tables<'goal_journeys'>;
export type GuardrailLearningEventRow = Tables<'guardrail_learning_events'>;
export type GuardrailSettingsRow = Tables<'guardrail_settings'>;
export type JourneyProgressLogRow = Tables<'journey_progress_log'>;
export type JourneyShareRow = Tables<'journey_shares'>;
export type JourneyStepRow = Tables<'journey_steps'>;
export type JourneyTemplateRow = Tables<'journey_templates'>;
export type KidsInviteRow = Tables<'kids_invites'>;
export type KidsSessionRow = Tables<'kids_sessions'>;
export type MessageRateLimitRow = Tables<'message_rate_limits'>;
export type MessageValidationLogRow = Tables<'message_validation_logs'>;
export type ParentAlertRow = Tables<'parent_alerts'>;
export type ParentApprovedContentRow = Tables<'parent_approved_content'>;
export type ParentSubscriptionRow = Tables<'parent_subscriptions'>;
export type StoryThemeRow = Tables<'story_themes'>;
export type StoryUsageRow = Tables<'story_usage'>;
export type TopicAnalyticsRow = Tables<'topic_analytics'>;
export type TopicContentRow = Tables<'topic_content'>;
export type TopicFeedbackRow = Tables<'topic_feedback'>;
export type TopicPackRow = Tables<'topic_packs'>;
export type UiIconRow = Tables<'ui_icons'>;
export type VoiceVaultClipRow = Tables<'voice_vault_clips'>;

// Convenience type aliases for Insert types (create operations)
export type AvatarAccessoryInsert = TablesInsert<'avatar_accessories'>;
export type AvatarLibraryInsert = TablesInsert<'avatar_library'>;
export type ChatMessageInsert = TablesInsert<'chat_messages'>;
export type ChildBadgeInsert = TablesInsert<'child_badges'>;
export type ChildFeedbackInsert = TablesInsert<'child_feedback'>;
export type ChildMemoryInsert = TablesInsert<'child_memory'>;
export type ChildProfileInsert = TablesInsert<'child_profiles'>;
export type ChildStoryInsert = TablesInsert<'child_stories'>;
export type ChildTopicInsert = TablesInsert<'child_topics'>;
export type CustomContentInsert = TablesInsert<'custom_content'>;
export type CustomTopicPackInsert = TablesInsert<'custom_topic_packs'>;
export type FamilyEventInsert = TablesInsert<'family_events'>;
export type FamilyMemberInsert = TablesInsert<'family_members'>;
export type FamilyNarrativeInsert = TablesInsert<'family_narratives'>;
export type FamilyPhotoInsert = TablesInsert<'family_photos'>;
export type FamilyRelationshipInsert = TablesInsert<'family_relationships'>;
export type FamilyStoryInsert = TablesInsert<'family_stories'>;
export type GoalJourneyInsert = TablesInsert<'goal_journeys'>;
export type GuardrailSettingsInsert = TablesInsert<'guardrail_settings'>;
export type JourneyStepInsert = TablesInsert<'journey_steps'>;
export type JourneyTemplateInsert = TablesInsert<'journey_templates'>;
export type ParentAlertInsert = TablesInsert<'parent_alerts'>;
export type TopicContentInsert = TablesInsert<'topic_content'>;
export type VoiceVaultClipInsert = TablesInsert<'voice_vault_clips'>;

// Convenience type aliases for Update types (update operations)
export type AvatarAccessoryUpdate = TablesUpdate<'avatar_accessories'>;
export type AvatarLibraryUpdate = TablesUpdate<'avatar_library'>;
export type ChatMessageUpdate = TablesUpdate<'chat_messages'>;
export type ChildBadgeUpdate = TablesUpdate<'child_badges'>;
export type ChildProfileUpdate = TablesUpdate<'child_profiles'>;
export type ChildStoryUpdate = TablesUpdate<'child_stories'>;
export type CustomContentUpdate = TablesUpdate<'custom_content'>;
export type FamilyEventUpdate = TablesUpdate<'family_events'>;
export type FamilyMemberUpdate = TablesUpdate<'family_members'>;
export type FamilyRelationshipUpdate = TablesUpdate<'family_relationships'>;
export type GoalJourneyUpdate = TablesUpdate<'goal_journeys'>;
export type GuardrailSettingsUpdate = TablesUpdate<'guardrail_settings'>;
export type JourneyStepUpdate = TablesUpdate<'journey_steps'>;
export type JourneyTemplateUpdate = TablesUpdate<'journey_templates'>;
export type ParentAlertUpdate = TablesUpdate<'parent_alerts'>;
export type TopicContentUpdate = TablesUpdate<'topic_content'>;
export type VoiceVaultClipUpdate = TablesUpdate<'voice_vault_clips'>;

// Enum type aliases
export type AgeRestrictionLevel = Enums<'age_restriction_level'>;
export type FamilyStoryType = Enums<'family_story_type'>;
export type SubscriptionStatus = Enums<'subscription_status'>;
export type SubscriptionType = Enums<'subscription_type'>;
