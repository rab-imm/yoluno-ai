# Yoluno AI - Architecture & Technical Documentation

> A children's learning companion platform with AI-powered conversations, story generation, and family history integration.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture Diagram](#architecture-diagram)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture (Supabase)](#backend-architecture-supabase)
- [AI Integration](#ai-integration)
- [Database Schema](#database-schema)
- [Safety & Content Moderation](#safety--content-moderation)
- [Refactoring Status](#refactoring-status)
- [Project Specifications](#project-specifications)

---

## Overview

Yoluno AI is a child-safe learning companion that provides:

- **AI Chat Companion**: Conversational AI with adaptive memory and personality modes
- **Story Generation**: Personalized stories with AI-generated illustrations and narration
- **Family History**: Connect children to their family heritage with photos, stories, and relationships
- **Goal Journeys**: Habit-building and learning journeys with milestone tracking
- **Parent Dashboard**: Complete oversight with guardrails, analytics, and content moderation

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 5.4.19 | Build Tool |
| TanStack Query | 5.90.2 | Server State Management |
| React Router | 6.30.1 | Routing |
| Tailwind CSS | 3.4.17 | Styling |
| shadcn/ui | - | Component Library (Radix UI) |
| Framer Motion | 12.23.22 | Animations |
| React Hook Form | 7.61.1 | Form Management |
| Zod | 4.1.11 | Schema Validation |

### Backend

| Technology | Purpose |
|------------|---------|
| Supabase | BaaS (Database, Auth, Storage, Edge Functions) |
| PostgreSQL | Primary Database |
| Deno | Edge Functions Runtime |

### AI Services

| Provider | Models | Usage |
|----------|--------|-------|
| Google Gemini (via OpenRouter) | gemini-2.5-flash | Buddy Chat Conversations |
| Google Gemini (via OpenRouter) | gemini-3-pro-image-preview | Story Generation & Illustrations |
| OpenAI | tts-1 | Text-to-Speech |
| OpenAI | whisper-1 | Speech-to-Text |

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Pages     │  │ Components  │  │   Hooks     │  │  Services   │       │
│  │             │  │             │  │             │  │             │       │
│  │ • Dashboard │  │ • Chat      │  │ • Queries   │  │ • Child     │       │
│  │ • Play      │  │ • Stories   │  │ • Mutations │  │ • Stories   │       │
│  │ • Auth      │  │ • Journey   │  │ • Keys      │  │ • Family    │       │
│  │ • Features  │  │ • Family    │  │             │  │ • Journeys  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    State Management                                  │  │
│  │  • TanStack Query (Server State)  • Context API (Auth, Mode)        │  │
│  │  • IndexedDB Cache (Avatars)      • localStorage (Sessions)         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE BACKEND                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      Edge Functions (24)                             │  │
│  │                                                                      │  │
│  │  AI-POWERED                        NON-AI                           │  │
│  │  ├─ child-chat (Core)              ├─ check-rate-limit              │  │
│  │  ├─ generate-story                 ├─ analyze-session-patterns      │  │
│  │  ├─ generate-story-illustrations   ├─ get-guardrail-settings        │  │
│  │  ├─ generate-story-narration       ├─ get-family-context            │  │
│  │  ├─ generate-avatar                └─ match-content                 │  │
│  │  ├─ validate-child-message                                          │  │
│  │  ├─ text-to-speech                                                  │  │
│  │  ├─ transcribe-family-story                                         │  │
│  │  ├─ process-family-photo                                            │  │
│  │  └─ buddy-mission-encouragement                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐     │
│  │    PostgreSQL     │  │     Storage       │  │   Authentication  │     │
│  │                   │  │                   │  │                   │     │
│  │ • 40+ Tables      │  │ • family_photos   │  │ • JWT Auth        │     │
│  │ • RPC Functions   │  │ • family_audio    │  │ • Service Roles   │     │
│  │ • Row-Level Sec   │  │ • avatars         │  │ • Kids Sessions   │     │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘     │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL AI SERVICES                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │   OPENROUTER AI GATEWAY         │  │         OPENAI API              │ │
│  │   (Google Gemini Models)        │  │                                 │ │
│  │                                 │  │  • TTS (tts-1)                  │ │
│  │  • gemini-2.5-flash             │  │    - Story narration            │ │
│  │    - Buddy chat conversations   │  │    - Reward voice clips         │ │
│  │    - Content validation         │  │                                 │ │
│  │                                 │  │  • Whisper (whisper-1)          │ │
│  │  • gemini-3-pro-image-preview   │  │    - Family story transcription │ │
│  │    - Story generation           │  │    - Audio processing           │ │
│  │    - Story illustrations        │  │                                 │ │
│  │    - Avatar generation          │  │                                 │ │
│  │                                 │  │                                 │ │
│  └─────────────────────────────────┘  └─────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (48 files)
│   ├── shared/                # NEW: Reusable patterns
│   │   ├── dialogs/           # FormDialog, ConfirmDialog
│   │   └── feedback/          # LoadingState, ErrorState, QueryState
│   ├── dashboard/             # Parent dashboard (61 files)
│   │   ├── family/            # Family tree components
│   │   └── layout/            # Dashboard layout
│   ├── chat/                  # Chat interface
│   ├── stories/               # Story components
│   ├── journey/               # Journey/goals components
│   ├── kids/                  # Child-facing UI
│   ├── landing/               # Marketing pages
│   └── gamification/          # Badges, streaks
│
├── pages/                     # Route pages (18+)
│   ├── dashboard/             # Parent dashboard routes
│   ├── features/              # Feature pages
│   └── legal/                 # Legal pages
│
├── hooks/
│   ├── queries/               # NEW: Standardized React Query hooks
│   │   ├── keys.ts            # Query key factory
│   │   ├── useChildProfiles.ts
│   │   ├── useStories.ts
│   │   ├── useJourneys.ts
│   │   ├── useGuardrails.ts
│   │   ├── useAvatars.ts
│   │   └── useFamily.ts
│   └── dashboard/             # Legacy hooks (to migrate)
│
├── services/                  # NEW: Data access layer
│   ├── childProfiles.ts       # Child profile CRUD
│   ├── stories.ts             # Story operations
│   ├── family.ts              # Family members & relationships
│   ├── journeys.ts            # Goal journeys
│   ├── guardrails.ts          # Safety settings
│   ├── avatars.ts             # Avatar library
│   └── cache/
│       └── indexedDBCache.ts  # Unified caching
│
├── types/                     # NEW: Centralized types
│   ├── database.ts            # Supabase type aliases
│   ├── domain.ts              # Business domain types
│   ├── api.ts                 # API & async state types
│   └── forms.ts               # Zod schemas
│
├── lib/
│   ├── utils.ts               # Utility functions
│   ├── errors/                # NEW: Error handling
│   │   ├── types.ts           # AppError, ErrorCode
│   │   └── handler.ts         # handleError utility
│   └── validation/            # Validation helpers
│
├── contexts/
│   ├── KidsAuthContext.tsx    # Kids session management
│   └── ModeContext.tsx        # Learning/Story mode toggle
│
└── integrations/
    └── supabase/
        ├── client.ts          # Supabase client config
        └── types.ts           # Auto-generated DB types (2090 lines)
```

### State Management

| Type | Technology | Usage |
|------|------------|-------|
| Server State | TanStack Query | Data fetching, caching, mutations |
| Auth State | React Context | Kids sessions, parent auth |
| UI State | React useState | Forms, modals, local UI |
| Persistent Cache | IndexedDB | Avatar library, offline data |
| Session Storage | localStorage | Kids session tokens |

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChatInterface` | `/components/chat/` | Main child chat UI |
| `BuddyAvatar` | `/components/chat/` | Animated avatar with expressions |
| `EnhancedStoryBuilder` | `/components/stories/` | Multi-step story wizard |
| `FamilyTreeBuilder` | `/components/dashboard/family/` | Family tree visualization |
| `JourneyProgressDashboard` | `/components/journey/` | Journey tracking |
| `GuardrailSettingsPanel` | `/components/dashboard/` | Safety configuration |

---

## Backend Architecture (Supabase)

### Edge Functions (24 Total)

#### AI-Powered Functions

| Function | AI Provider | Purpose |
|----------|-------------|---------|
| `buddy-chat` | Gemini 2.5 Flash (OpenRouter) | Main conversational AI with memory |
| `generate-story` | Gemini 3 Pro Image Preview (OpenRouter) | Create personalized stories with illustrations |
| `generate-story-narration` | OpenAI TTS | Audio narration for stories |
| `generate-avatar` | Gemini 3 Pro Image Preview (OpenRouter) | Custom avatar generation |
| `validate-child-message` | Gemini 2.5 Flash (OpenRouter) | Content safety validation |
| `text-to-speech` | OpenAI TTS | General TTS conversion |
| `transcribe-family-story` | OpenAI Whisper + Gemini | Audio transcription & summarization |
| `transcribe-family-member` | OpenAI Whisper | Voice recording transcription |
| `process-family-photo` | Gemini 2.5 Flash (OpenRouter) | Photo captions |
| `buddy-mission-encouragement` | Gemini 2.5 Flash (OpenRouter) | Motivational messages |
| `inject-habit-into-story` | Gemini 2.5 Flash (OpenRouter) | Habit integration in stories |
| `generate-journey-steps` | Gemini 2.5 Flash (OpenRouter) | Journey step creation |

#### Non-AI Functions

| Function | Purpose |
|----------|---------|
| `check-rate-limit` | Message rate limiting |
| `analyze-session-patterns` | Behavior anomaly detection (rule-based) |
| `get-guardrail-settings` | Retrieve parent safety settings |
| `get-family-context` | Family history for conversations |
| `match-content` | Pre-written content matching |
| `adapt-guardrails` | Dynamic guardrail adjustment |
| `get-reward-voice-clip` | Parent voice clip retrieval |
| `process-family-document` | Document processing |
| `generate-website-image` | Marketing images |

### Database Tables (Key Tables)

#### Child & Profile
```sql
child_profiles        -- Child accounts (age, personality, avatar, streak)
child_memory          -- Persistent memories (type, key, value, importance)
child_badges          -- Earned achievements
child_topics          -- Parent-approved topics
avatar_library        -- Pre-designed avatars (4 expressions each)
avatar_accessories    -- Unlockable cosmetics
```

#### Conversations
```sql
chat_messages         -- Message history (role, content, created_at)
chat_session_metrics  -- Session analytics (anomaly_score, manipulation_attempts)
conversation_summaries -- Daily AI-generated summaries
conversation_stats    -- Topic engagement statistics
```

#### Family History
```sql
family_members        -- Family tree nodes (name, relationship, bio)
family_relationships  -- Connections between members
family_events         -- Timeline events
family_photos         -- Photos with AI captions
family_stories        -- Written/audio/document stories
family_narratives     -- Member life stories
family_history_access -- Child access control with age restrictions
```

#### Content & Safety
```sql
topic_content         -- Pre-approved Q&A content (reviewed by parents)
custom_content        -- Parent-created custom Q&A
guardrail_settings    -- Safety configuration per parent
message_validation_logs -- Validation audit trail
content_moderation_logs -- Flagged content
parent_alerts         -- Safety notifications
guardrail_learning_events -- Parent override decisions
```

#### Journeys & Stories
```sql
goal_journeys         -- Active learning/habit journeys
journey_steps         -- Individual journey milestones
journey_templates     -- Reusable journey blueprints
journey_progress_log  -- Step completion with reflections
child_stories         -- Generated stories (content, scenes, illustrations)
story_themes          -- Available story themes
story_usage           -- Monthly generation quotas
```

#### Voice & Audio
```sql
voice_vault_clips     -- Parent voice recordings for rewards
```

### Storage Buckets

| Bucket | Purpose |
|--------|---------|
| `family_photos` | Family photo uploads |
| `family_audio` | Audio recordings for transcription |
| `avatars` | Generated avatar images |

### RPC Functions

```sql
check_transcription_quota(p_parent_id, p_duration_minutes) -- Quota check
check_storage_quota(p_parent_id, p_file_size_bytes)        -- Storage check
update_child_streak(p_child_id)                            -- Streak update
check_and_award_badges(p_child_id)                         -- Badge check
check_and_award_journey_badges(p_child_id)                 -- Journey badges
```

---

## AI Integration

### Child Chat System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHILD CHAT FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CHILD MESSAGE                                                │
│     │                                                            │
│     ▼                                                            │
│  2. PRE-VALIDATION (validate-child-message)                      │
│     ├─ Custom blocked keywords                                   │
│     ├─ AI-based intent analysis                                  │
│     ├─ Manipulation detection                                    │
│     └─ Returns: GREEN / YELLOW / RED                             │
│     │                                                            │
│     ▼                                                            │
│  3. CONTEXT ASSEMBLY                                             │
│     ├─ Child profile & personality mode                          │
│     ├─ Persistent memories (top 10 by importance)                │
│     ├─ Recent conversation history (3-day window)                │
│     ├─ Daily conversation summaries                              │
│     ├─ Approved topics list                                      │
│     ├─ Family context (if family query detected)                 │
│     └─ Pre-matched content (if available)                        │
│     │                                                            │
│     ▼                                                            │
│  4. AI GENERATION (Gemini 2.5 Flash via OpenRouter)              │
│     ├─ System prompt with personality mode                       │
│     ├─ Age-appropriate language guidance                         │
│     ├─ Topic adherence instructions                              │
│     └─ Temperature: 0.8 (creative but controlled)                │
│     │                                                            │
│     ▼                                                            │
│  5. RESPONSE VALIDATION                                          │
│     ├─ Topic adherence check                                     │
│     ├─ Age-appropriateness verification                          │
│     └─ Returns: GREEN / YELLOW / RED                             │
│     │                                                            │
│     ▼                                                            │
│  6. BACKGROUND TASKS                                             │
│     ├─ Extract new memories                                      │
│     ├─ Update session metrics                                    │
│     └─ Generate daily summary (if 4+ messages)                   │
│     │                                                            │
│     ▼                                                            │
│  7. RESPONSE TO CHILD                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Personality Modes

| Mode | Behavior |
|------|----------|
| `curious_explorer` | Asks "Why?" and "What if?" questions |
| `patient_teacher` | Breaks answers into numbered steps |
| `playful_friend` | Uses jokes, emojis, and fun examples |
| `storyteller` | Weaves knowledge into narratives |

### Age Adaptations

| Age Range | Language Style |
|-----------|----------------|
| 5-7 years | Simple words (1-2 syllables), short sentences, 40-60 words |
| 8-10 years | Moderate vocabulary, medium sentences, 60-80 words |
| 11-12 years | Advanced vocabulary, complex explanations, 80-100 words |

### Memory System

```typescript
// Persistent memories extracted from conversations
interface ChildMemory {
  type: 'preference' | 'fact' | 'interest' | 'learning_progress' | 'achievement';
  key: string;           // e.g., "favorite_animal"
  value: string;         // e.g., "dinosaurs"
  importance_score: 1-10;
  last_accessed_at: Date;
}

// Top 10 memories loaded per conversation
// Importance score increased when referenced
```

### Story Generation Pipeline

```
1. Parent submits story form (theme, characters, mood, values)
       │
       ▼
2. Check usage limits (story_usage table)
       │
       ▼
3. If journey active → inject-habit-into-story
       │
       ▼
4. generate-enhanced-story
   ├─ Title
   ├─ Full story content
   └─ 3 scene descriptions
       │
       ▼
5. generate-story-illustrations (per scene)
   ├─ Style: cartoon / watercolor / storybook / minimalist
   └─ Child-safe prompts enforced
       │
       ▼
6. generate-story-narration
   ├─ OpenAI TTS (tts-1)
   └─ Voice: alloy / nova / shimmer
       │
       ▼
7. Save to child_stories table
       │
       ▼
8. Display in StoryPreview component
```

---

## Safety & Content Moderation

### Three-Layer Validation System

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAFETY LAYERS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LAYER 1: PRE-AI FILTERING                                       │
│  ├─ Custom blocked keywords (parent-defined)                     │
│  ├─ Custom allowed phrases (parent-defined)                      │
│  └─ Rate limiting (messages/minute, messages/hour)               │
│                                                                  │
│  LAYER 2: AI INPUT VALIDATION                                    │
│  ├─ Topic relevance analysis                                     │
│  ├─ Intent classification (genuine vs. manipulation)             │
│  ├─ Jailbreak attempt detection                                  │
│  └─ Age-appropriateness check                                    │
│                                                                  │
│  LAYER 3: AI OUTPUT VALIDATION                                   │
│  ├─ Topic adherence verification                                 │
│  ├─ Response safety scoring                                      │
│  └─ Content appropriateness check                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Flag Levels

| Level | Color | Action |
|-------|-------|--------|
| Safe | GREEN | Proceed normally |
| Ambiguous | YELLOW | Proceed with caution, may notify parent |
| Dangerous | RED | Block completely, notify parent |

### Guardrail Settings (Parent Controls)

| Setting | Type | Description |
|---------|------|-------------|
| `strictness_level` | enum | low / medium / high |
| `block_on_yellow` | boolean | Block ambiguous content |
| `notify_on_yellow` | boolean | Alert parent on yellow flags |
| `notify_on_green` | boolean | Log all interactions |
| `messages_per_minute` | int | Rate limit |
| `messages_per_hour` | int | Rate limit |
| `max_response_length` | int | Character limit |
| `preferred_ai_tone` | string | friendly / educational / encouraging |
| `custom_blocked_keywords` | string[] | Parent-defined blocklist |
| `custom_allowed_phrases` | string[] | Parent-defined allowlist |
| `auto_expand_topics` | boolean | Allow topic exploration |
| `learn_from_approvals` | boolean | Train from parent overrides |

### Built-in Content Keywords

```javascript
const CONCERNING_KEYWORDS = [
  'violence', 'weapon', 'hurt', 'kill', 'die', 'death',
  'scary', 'nightmare', 'monster', 'blood',
  'hate', 'stupid', 'dumb', 'idiot',
  'drug', 'alcohol', 'beer', 'wine'
];
```

---

## Refactoring Status

### Completed Phases

| Phase | Description | Files Created |
|-------|-------------|---------------|
| **Phase 1** | Centralized Types | `/src/types/` (5 files) |
| **Phase 2** | Service Layer | `/src/services/` (8 files) |
| **Phase 3** | Query Hooks | `/src/hooks/queries/` (8 files) |
| **Phase 4** | Shared Components | `/src/components/shared/` (9 files) |

#### Phase 1: Centralized Types (`/src/types/`)

```
types/
├── database.ts    # Re-exports from Supabase with aliases
│                  # ChildProfileRow, ChildStoryRow, etc.
├── domain.ts      # Business types: PersonalityMode, AvatarExpression,
│                  # StoryCharacter, JourneyWithSteps, etc.
├── api.ts         # AsyncState<T>, ApiResponse, PaginatedResponse
├── forms.ts       # Zod schemas: createChildSchema, createStorySchema
└── index.ts       # Barrel export
```

#### Phase 2: Service Layer (`/src/services/`)

```
services/
├── childProfiles.ts  # getChildProfiles, createChildProfile, updateChildAvatar
├── stories.ts        # getStoriesByChild, createStory, toggleFavorite
├── family.ts         # getFamilyMembers, createRelationship
├── journeys.ts       # getActiveJourneys, completeStep
├── guardrails.ts     # getGuardrailSettings, updateGuardrailSettings
├── avatars.ts        # getAllAvatars, getAvatarsByCategory
├── cache/
│   └── indexedDBCache.ts  # Generic IndexedDB cache class
└── index.ts          # Barrel export
```

#### Phase 3: Query Hooks (`/src/hooks/queries/`)

```
hooks/queries/
├── keys.ts               # Query key factory: queryKeys.childProfiles.all
├── useChildProfiles.ts   # useChildProfiles, useCreateChildProfile
├── useStories.ts         # useStoriesByChild, useToggleFavorite
├── useJourneys.ts        # useActiveJourneys, useCompleteStep
├── useGuardrails.ts      # useGuardrailSettings, useUpdateGuardrailSettings
├── useAvatars.ts         # useAvatarLibrary (with IndexedDB caching)
├── useFamily.ts          # useFamilyMembers, useCreateRelationship
└── index.ts              # Barrel export
```

#### Phase 4: Shared Components (`/src/components/shared/`)

```
components/shared/
├── dialogs/
│   ├── FormDialog.tsx       # Reusable form dialog wrapper
│   ├── ConfirmDialog.tsx    # Confirmation dialog (destructive actions)
│   └── index.ts
├── feedback/
│   ├── LoadingState.tsx     # Consistent loading indicator
│   ├── ErrorState.tsx       # Error display with retry
│   ├── EmptyState.tsx       # Empty state with action
│   ├── QueryState.tsx       # React Query wrapper component
│   └── index.ts
└── index.ts
```

### Remaining Phases

#### Phase 5: Standardize Error Handling

**Status:** Pending

**Tasks:**
- [ ] Update 35+ components to use `handleError()` from `/src/lib/errors`
- [ ] Replace 114 direct `toast.error()` calls with centralized handler
- [ ] Replace 44 `console.error()` calls with proper error logging
- [ ] Add error boundaries to major dashboard sections

**Files to Update:**
```
/src/components/dashboard/CreateChildDialog.tsx
/src/components/dashboard/EditChildProfileDialog.tsx
/src/components/dashboard/family/*.tsx (14 files)
/src/components/journey/*.tsx (6 files)
/src/hooks/dashboard/*.tsx (9 files)
```

**Error Handler Usage:**
```typescript
import { handleError } from '@/lib/errors';

// Instead of:
toast.error("Failed to save");
console.error(error);

// Use:
handleError(error, { userMessage: "Failed to save" });
```

#### Phase 6: Dashboard Reorganization

**Status:** Pending

**Current:** 61 files in `/src/components/dashboard/`

**Target Structure:**
```
/src/components/dashboard/
├── children/           # Child profile management (8 files)
│   ├── ChildProfileCard.tsx
│   ├── EnhancedChildCard.tsx
│   ├── CreateChildDialog.tsx
│   ├── EditChildProfileDialog.tsx
│   └── index.ts
├── family/             # Already exists (14 files)
├── journeys/           # Journey components (4 files)
│   ├── JourneyProgressDashboard.tsx
│   ├── GoalJourneyManager.tsx
│   └── index.ts
├── stories/            # Story management (3 files)
│   ├── StoryLibrary.tsx
│   └── index.ts
├── safety/             # Guardrails & moderation (5 files)
│   ├── GuardrailSettingsPanel.tsx
│   ├── ContentModerationLog.tsx
│   ├── ParentAlertsPanel.tsx
│   └── index.ts
├── topics/             # Topic management (4 files)
│   ├── TopicManager.tsx
│   ├── TopicLibrary.tsx
│   └── index.ts
├── avatars/            # Avatar components (6 files)
│   ├── AvatarSelector.tsx
│   ├── AvatarCustomizer.tsx
│   └── index.ts
├── analytics/          # Insights & reports (5 files)
│   ├── SessionMonitoringDashboard.tsx
│   └── index.ts
├── layout/             # Already exists (2 files)
└── index.ts            # Re-exports for backwards compatibility
```

**Migration Strategy:**
```typescript
// Old imports continue to work via re-exports:
import { CreateChildDialog } from '@/components/dashboard/CreateChildDialog';

// New imports also work:
import { CreateChildDialog } from '@/components/dashboard/children';
```

---

## Project Specifications

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Bundle Size (gzipped) | < 500KB initial |

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Child-friendly UI patterns

### Security

- Row-Level Security (RLS) on all tables
- JWT-based authentication
- Service role separation (client vs. server keys)
- Content validation on all AI inputs/outputs
- Rate limiting on all API endpoints
- PIN-protected child sessions

### Subscription Tiers

| Feature | Free | Basic | Plus | Pro |
|---------|------|-------|------|-----|
| Stories/month | 5 | 20 | 50 | Unlimited |
| Family photos | 10 | 100 | 500 | Unlimited |
| Audio transcription | 5 min | 30 min | 120 min | 300 min |
| Child profiles | 1 | 3 | 5 | 10 |
| Custom content | 5 | 25 | 100 | Unlimited |

---

## Environment Variables

### Frontend (Vite)
```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=[project-id]
```

### Edge Functions (Deno)
```env
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENROUTER_API_KEY=sk-or-...
OPENAI_API_KEY=sk-...
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Deploy Supabase functions
supabase functions deploy
```

---

## Key Dependencies

### Frontend
```json
{
  "@supabase/supabase-js": "^2.58.0",
  "@tanstack/react-query": "^5.90.2",
  "react": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "framer-motion": "^12.23.22",
  "tailwindcss": "^3.4.17",
  "@xyflow/react": "^12.8.6",
  "recharts": "^2.x",
  "zod": "^4.1.11",
  "react-hook-form": "^7.61.1"
}
```

### Edge Functions (Deno)
```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
```

---

## Contributing

1. Follow established patterns in `/src/services/` for data access
2. Use `/src/hooks/queries/` for React Query hooks
3. Use `/src/types/` for type definitions
4. Use `/src/components/shared/` for reusable UI patterns
5. Use `/src/lib/errors/` for error handling
6. Run `npm run lint` before committing

---

*Last updated: December 2024*
