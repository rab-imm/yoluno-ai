/**
 * Dashboard Components
 *
 * This file re-exports all dashboard components from their organized subfolders.
 * Import from here for backwards compatibility, or import directly from subfolders.
 *
 * @example
 * // Backwards compatible import
 * import { CreateChildDialog } from '@/components/dashboard';
 *
 * // New direct import (preferred)
 * import { CreateChildDialog } from '@/components/dashboard/children';
 */

// Children Components
export {
  ChildProfileCard,
  CreateChildDialog,
  EditChildProfileDialog,
  EnhancedChildCard,
  PINInputGrid,
} from './children';

// Journey Components
export {
  GoalJourneyManager,
  JourneyProgressDashboard,
  JourneyReflectionPrompt,
  JourneyTemplateSelector,
  JourneyWizard,
} from './journeys';

// Story Components
export { StoryLibrary } from './stories';

// Safety Components
export {
  GuardrailSettingsPanel,
  ContentModerationLog,
  SessionMonitoringDashboard,
  ParentAlertsPanel,
} from './safety';

// Topic Components
export {
  TopicManager,
  TopicLibrary,
  TopicPackEditor,
  TopicReviewCard,
  BulkTopicManager,
  TopicAnalytics,
  ContentPackSelector,
  ContentLibrary,
  PackContentManager,
  CustomContentEditor,
  ContentPreviewDrawer,
} from './topics';

// Avatar Components
export {
  AvatarCustomizer,
  AvatarSelector,
  AccessoriesManager,
} from './avatars';

// Analytics Components
export {
  ParentInsights,
  ActivityFeed,
  ChildFeedbackPanel,
  EngagementPrompts,
} from './analytics';

// Root-level components (not categorized into subfolders)
export { DashboardHero } from './DashboardHero';
export { FamilyDocumentUploader } from './FamilyDocumentUploader';
export { FamilyHistoryManager } from './FamilyHistoryManager';
export { FamilyHistorySettings } from './FamilyHistorySettings';
export { FamilyPhotoLibrary } from './FamilyPhotoLibrary';
export { FamilyStoryArchive } from './FamilyStoryArchive';
export { FamilyStoryRecorder } from './FamilyStoryRecorder';
export { FamilyTreeBuilder } from './FamilyTreeBuilder';
export { ProductExplainerPanel } from './ProductExplainerPanel';
export { VoiceVaultManager } from './VoiceVaultManager';
export { VoiceVaultRecorder } from './VoiceVaultRecorder';
export { WelcomeDialog } from './WelcomeDialog';
