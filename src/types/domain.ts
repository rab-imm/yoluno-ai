/**
 * Domain Types
 *
 * Business domain types that extend or simplify database types.
 * Use these for application logic, UI components, and forms.
 */

import type {
  ChildProfileRow,
  ChildStoryRow,
  AvatarLibraryRow,
  FamilyMemberRow,
  FamilyRelationshipRow,
  GoalJourneyRow,
  JourneyStepRow,
  JourneyTemplateRow,
  GuardrailSettingsRow,
  ChatMessageRow,
  ChildBadgeRow,
  ParentAlertRow,
  Json,
} from './database';

// ============================================================================
// Child Profile Types
// ============================================================================

/** Full child profile from database */
export type ChildProfile = ChildProfileRow;

/** Personality modes available for children */
export type PersonalityMode =
  | 'curious_explorer'
  | 'gentle_guide'
  | 'fun_buddy'
  | 'storyteller';

/** Avatar expression states */
export type AvatarExpression = 'neutral' | 'happy' | 'thinking' | 'excited';

/** Avatar size variants used across components */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

/** Child profile with resolved avatar data */
export interface ChildProfileWithAvatar extends ChildProfile {
  avatarLibrary?: AvatarLibraryItem | null;
}

// ============================================================================
// Avatar Types
// ============================================================================

/** Avatar library item from database */
export type AvatarLibraryItem = AvatarLibraryRow;

/** Avatar with all expression URLs */
export interface AvatarExpressions {
  neutral: string;
  happy: string;
  thinking: string;
  excited: string;
}

/** Avatar category for filtering */
export type AvatarCategory =
  | 'animals'
  | 'fantasy'
  | 'robots'
  | 'nature'
  | 'space'
  | 'ocean';

// ============================================================================
// Story Types
// ============================================================================

/** Full story from database */
export type Story = ChildStoryRow;

/** Story character definition */
export interface StoryCharacter {
  name: string;
  role: string;
  description?: string;
}

/** Story scene with illustration */
export interface StoryScene {
  sceneNumber: number;
  content: string;
  illustrationUrl?: string;
  illustrationPrompt?: string;
}

/** Story illustration data */
export interface StoryIllustration {
  url: string;
  prompt: string;
  style: string;
}

/** Story length options */
export type StoryLength = 'short' | 'medium' | 'long';

/** Story mood options */
export type StoryMood =
  | 'adventurous'
  | 'calm'
  | 'funny'
  | 'mysterious'
  | 'heartwarming';

/** Story with parsed JSON fields */
export interface StoryWithParsedData extends Omit<Story, 'characters' | 'scenes' | 'illustrations'> {
  characters: StoryCharacter[] | null;
  scenes: StoryScene[] | null;
  illustrations: StoryIllustration[] | null;
}

// ============================================================================
// Family Types
// ============================================================================

/** Family member from database */
export type FamilyMember = FamilyMemberRow;

/** Family relationship from database */
export type FamilyRelationship = FamilyRelationshipRow;

/** Relationship type options */
export type RelationshipType =
  | 'parent'
  | 'child'
  | 'sibling'
  | 'spouse'
  | 'grandparent'
  | 'grandchild'
  | 'aunt_uncle'
  | 'niece_nephew'
  | 'cousin';

/** Family member with relationships resolved */
export interface FamilyMemberWithRelationships extends FamilyMember {
  relationships: FamilyRelationship[];
  relatedMembers: FamilyMember[];
}

/** Family tree node for visualization */
export interface FamilyTreeNode {
  id: string;
  data: FamilyMember;
  position: { x: number; y: number };
  type?: string;
}

/** Family tree edge for visualization */
export interface FamilyTreeEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

// ============================================================================
// Journey Types
// ============================================================================

/** Goal journey from database */
export type GoalJourney = GoalJourneyRow;

/** Journey step from database */
export type JourneyStep = JourneyStepRow;

/** Journey template from database */
export type JourneyTemplate = JourneyTemplateRow;

/** Journey status options */
export type JourneyStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

/** Journey category options */
export type JourneyCategory =
  | 'learning'
  | 'habits'
  | 'social'
  | 'creativity'
  | 'health'
  | 'mindfulness';

/** Reward type options */
export type RewardType = 'badge' | 'certificate' | 'custom' | 'none';

/** Journey with steps resolved */
export interface JourneyWithSteps extends GoalJourney {
  steps: JourneyStep[];
}

/** Journey step template for creating journeys */
export interface JourneyStepTemplate {
  stepNumber: number;
  title: string;
  description?: string;
}

/** Parsed journey template with typed steps */
export interface JourneyTemplateWithSteps extends Omit<JourneyTemplate, 'steps_template'> {
  steps_template: JourneyStepTemplate[];
}

// ============================================================================
// Guardrail & Safety Types
// ============================================================================

/** Guardrail settings from database */
export type GuardrailSettings = GuardrailSettingsRow;

/** Strictness level options */
export type StrictnessLevel = 'low' | 'medium' | 'high' | 'custom';

/** AI tone options */
export type AiTone =
  | 'friendly'
  | 'educational'
  | 'encouraging'
  | 'neutral';

/** Default guardrail settings */
export const DEFAULT_GUARDRAIL_SETTINGS: Partial<GuardrailSettings> = {
  strictness_level: 'medium',
  block_on_yellow: false,
  notify_on_yellow: true,
  notify_on_green: false,
  messages_per_minute: 10,
  messages_per_hour: 100,
  max_response_length: 500,
  preferred_ai_tone: 'friendly',
  auto_expand_topics: true,
  learn_from_approvals: true,
  require_explicit_approval: false,
  custom_blocked_keywords: [],
  custom_allowed_phrases: [],
};

// ============================================================================
// Chat Types
// ============================================================================

/** Chat message from database */
export type ChatMessage = ChatMessageRow;

/** Chat message role */
export type ChatRole = 'user' | 'assistant' | 'system';

/** Chat message for display */
export interface DisplayChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
  isLoading?: boolean;
}

// ============================================================================
// Badge & Gamification Types
// ============================================================================

/** Child badge from database */
export type ChildBadge = ChildBadgeRow;

/** Badge type categories */
export type BadgeType =
  | 'streak'
  | 'milestone'
  | 'achievement'
  | 'journey'
  | 'story'
  | 'special';

/** Badge display info */
export interface BadgeInfo {
  name: string;
  type: BadgeType;
  description: string;
  iconUrl?: string;
  earnedAt?: string;
}

// ============================================================================
// Alert Types
// ============================================================================

/** Parent alert from database */
export type ParentAlert = ParentAlertRow;

/** Alert severity levels */
export type AlertSeverity = 'info' | 'warning' | 'critical';

/** Alert type categories */
export type AlertType =
  | 'content_flag'
  | 'usage_limit'
  | 'streak_milestone'
  | 'journey_complete'
  | 'system';

// ============================================================================
// Activity & Analytics Types
// ============================================================================

/** Activity item for dashboard feed */
export interface ActivityItem {
  id: string;
  type: 'story' | 'badge' | 'journey' | 'chat' | 'milestone';
  title: string;
  description?: string;
  childId?: string;
  childName?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/** Child activity summary */
export interface ActivitySummary {
  childId: string;
  childName: string;
  totalMessages: number;
  storiesCreated: number;
  badgesEarned: number;
  journeysCompleted: number;
  currentStreak: number;
  lastActiveAt?: string;
}

/** Topic analytics data */
export interface TopicEngagement {
  topic: string;
  messageCount: number;
  engagementScore: number;
  lastUsedAt?: string;
}
