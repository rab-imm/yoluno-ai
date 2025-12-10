/**
 * Form Types
 *
 * Types and Zod schemas for form validation across the application.
 */

import { z } from 'zod';
import type { PersonalityMode, StoryLength, StoryMood, RewardType, JourneyCategory } from './domain';

// ============================================================================
// Child Profile Forms
// ============================================================================

/** Schema for creating a child profile */
export const createChildSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  age: z
    .number()
    .int('Age must be a whole number')
    .min(3, 'Child must be at least 3 years old')
    .max(18, 'Child must be 18 or younger'),
  avatarLibraryId: z.string().uuid().optional(),
  personalityMode: z.enum(['curious_explorer', 'gentle_guide', 'fun_buddy', 'storyteller'] as const).optional(),
});

export type CreateChildFormData = z.infer<typeof createChildSchema>;

/** Schema for updating a child profile */
export const updateChildSchema = createChildSchema.partial();

export type UpdateChildFormData = z.infer<typeof updateChildSchema>;

/** Schema for child PIN */
export const childPinSchema = z.object({
  pin: z
    .string()
    .length(4, 'PIN must be exactly 4 digits')
    .regex(/^\d{4}$/, 'PIN must contain only numbers')
    .refine(
      (pin) => !['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999'].includes(pin),
      'PIN cannot be all the same digit'
    )
    .refine(
      (pin) => !['1234', '4321', '0123', '3210', '2345', '5432'].includes(pin),
      'PIN cannot be a simple sequence'
    ),
  confirmPin: z.string().length(4, 'Confirm PIN must be exactly 4 digits'),
}).refine((data) => data.pin === data.confirmPin, {
  message: 'PINs do not match',
  path: ['confirmPin'],
});

export type ChildPinFormData = z.infer<typeof childPinSchema>;

// ============================================================================
// Story Forms
// ============================================================================

/** Schema for creating a story */
export const createStorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  prompt: z
    .string()
    .min(10, 'Story prompt must be at least 10 characters')
    .max(500, 'Story prompt must be 500 characters or less'),
  childId: z.string().uuid('Invalid child ID'),
  theme: z.string().optional(),
  mood: z.enum(['adventurous', 'calm', 'funny', 'mysterious', 'heartwarming'] as const).optional(),
  storyLength: z.enum(['short', 'medium', 'long'] as const).optional(),
  illustrationStyle: z.string().optional(),
  values: z.array(z.string()).max(5, 'Maximum 5 values allowed').optional(),
  characterNames: z.array(z.string().max(50)).max(5, 'Maximum 5 characters allowed').optional(),
});

export type CreateStoryFormData = z.infer<typeof createStorySchema>;

// ============================================================================
// Family Forms
// ============================================================================

/** Schema for creating a family member */
export const createFamilyMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  relationship: z.string().optional(),
  specificLabel: z.string().max(50).optional(),
  birthDate: z.string().optional(),
  location: z.string().max(200).optional(),
  bio: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

export type CreateFamilyMemberFormData = z.infer<typeof createFamilyMemberSchema>;

/** Schema for creating a family relationship */
export const createRelationshipSchema = z.object({
  personId: z.string().uuid('Invalid person ID'),
  relatedPersonId: z.string().uuid('Invalid related person ID'),
  relationshipType: z.enum([
    'parent',
    'child',
    'sibling',
    'spouse',
    'grandparent',
    'grandchild',
    'aunt_uncle',
    'niece_nephew',
    'cousin',
  ] as const),
}).refine((data) => data.personId !== data.relatedPersonId, {
  message: 'A person cannot have a relationship with themselves',
  path: ['relatedPersonId'],
});

export type CreateRelationshipFormData = z.infer<typeof createRelationshipSchema>;

// ============================================================================
// Journey Forms
// ============================================================================

/** Schema for creating a journey */
export const createJourneySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z.string().max(500).optional(),
  childId: z.string().uuid('Invalid child ID'),
  journeyCategory: z.enum(['learning', 'habits', 'social', 'creativity', 'health', 'mindfulness'] as const),
  goalType: z.string().min(1, 'Goal type is required'),
  durationDays: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration must be 365 days or less'),
  totalSteps: z
    .number()
    .int()
    .min(1, 'Must have at least 1 step')
    .max(100, 'Maximum 100 steps allowed'),
  rewardType: z.enum(['badge', 'certificate', 'custom', 'none'] as const),
  rewardDetails: z.record(z.unknown()).optional(),
  allowSharing: z.boolean().optional(),
  missionScheduleTime: z.string().optional(),
});

export type CreateJourneyFormData = z.infer<typeof createJourneySchema>;

/** Schema for journey step */
export const journeyStepSchema = z.object({
  title: z.string().min(1, 'Step title is required').max(100),
  description: z.string().max(500).optional(),
  stepNumber: z.number().int().min(1),
});

export type JourneyStepFormData = z.infer<typeof journeyStepSchema>;

// ============================================================================
// Guardrail Settings Forms
// ============================================================================

/** Schema for guardrail settings */
export const guardrailSettingsSchema = z.object({
  strictnessLevel: z.enum(['low', 'medium', 'high', 'custom'] as const).optional(),
  blockOnYellow: z.boolean().optional(),
  notifyOnYellow: z.boolean().optional(),
  notifyOnGreen: z.boolean().optional(),
  messagesPerMinute: z.number().int().min(1).max(60).optional(),
  messagesPerHour: z.number().int().min(1).max(1000).optional(),
  maxResponseLength: z.number().int().min(50).max(2000).optional(),
  preferredAiTone: z.enum(['friendly', 'educational', 'encouraging', 'neutral'] as const).optional(),
  autoExpandTopics: z.boolean().optional(),
  learnFromApprovals: z.boolean().optional(),
  requireExplicitApproval: z.boolean().optional(),
  customBlockedKeywords: z.array(z.string().max(50)).optional(),
  customAllowedPhrases: z.array(z.string().max(100)).optional(),
});

export type GuardrailSettingsFormData = z.infer<typeof guardrailSettingsSchema>;

// ============================================================================
// Custom Content Forms
// ============================================================================

/** Schema for custom content (Q&A) */
export const customContentSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(100),
  question: z
    .string()
    .min(5, 'Question must be at least 5 characters')
    .max(500, 'Question must be 500 characters or less'),
  answer: z
    .string()
    .min(10, 'Answer must be at least 10 characters')
    .max(2000, 'Answer must be 2000 characters or less'),
  ageRange: z.enum(['3-5', '6-8', '9-12', '13-18', 'all'] as const),
  keywords: z.array(z.string().max(30)).max(10, 'Maximum 10 keywords').optional(),
  childId: z.string().uuid().optional(),
});

export type CustomContentFormData = z.infer<typeof customContentSchema>;

// ============================================================================
// Voice Vault Forms
// ============================================================================

/** Schema for voice clip */
export const voiceClipSchema = z.object({
  clipName: z
    .string()
    .min(1, 'Clip name is required')
    .max(100, 'Clip name must be 100 characters or less'),
  category: z.string().max(50).optional(),
  audioUrl: z.string().url('Invalid audio URL'),
  durationMs: z.number().int().min(0).optional(),
});

export type VoiceClipFormData = z.infer<typeof voiceClipSchema>;

// ============================================================================
// Authentication Forms
// ============================================================================

/** Schema for kids login */
export const kidsLoginSchema = z.object({
  childId: z.string().uuid('Invalid child selection'),
  pin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d{4}$/, 'PIN must contain only numbers'),
});

export type KidsLoginFormData = z.infer<typeof kidsLoginSchema>;

// ============================================================================
// Feedback Forms
// ============================================================================

/** Schema for child feedback */
export const childFeedbackSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be 1000 characters or less'),
  childId: z.string().uuid().optional(),
});

export type ChildFeedbackFormData = z.infer<typeof childFeedbackSchema>;
