# Paliyo - AI-Powered Family Storytelling Platform

## Project Overview

Paliyo is a comprehensive family storytelling and child engagement platform that combines AI-powered story generation, family history preservation, learning journeys, and interactive chat experiences for children.

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling with custom design system
- **React Router** for navigation
- **Framer Motion** for animations
- **Radix UI** for accessible component primitives
- **React Query** for data fetching and caching
- **Sonner** for toast notifications

### Backend (Lovable Cloud/Supabase)
- **Supabase** for authentication, database, and storage
- **Edge Functions** for serverless AI processing
- **Row Level Security (RLS)** for data protection
- **PostgreSQL** database

### AI Integration
- **OpenAI API** for:
  - Story generation (GPT-4)
  - Text-to-speech narration (TTS)
  - Audio transcription (Whisper)
  - Chat interactions
- **Image Generation** for story illustrations
- **AI Gateway** (Lovable AI) for additional AI capabilities

### Special Libraries
- **@xyflow/react** for family tree visualization
- **@dagrejs/dagre** for graph layout algorithms
- **html-to-image** & **jspdf** for export functionality
- **react-dropzone** for file uploads
- **canvas-confetti** for gamification effects

---

## Core Features

### 1. Story Generation & Narration
**Location**: `/stories`, `/dashboard/stories`

#### Components
- `StoryWizard.tsx` - Multi-step story creation wizard
- `EnhancedStoryBuilder.tsx` - Advanced story customization
- `StoryPreview.tsx` - Story preview with editing
- `StoriesLibrary.tsx` - Browse saved stories
- `BedtimeMode.tsx` - Bedtime story player

#### Capabilities
- AI-generated stories based on themes, characters, and values
- Customizable story length, mood, and illustration style
- Multiple narration voices (alloy, echo, fable, onyx, nova, shimmer)
- Scene-by-scene illustration generation
- Text-to-speech narration with audio playback
- Bedtime mode with auto-play functionality
- Story editing and re-generation

#### Edge Functions
- `generate-story/index.ts` - Creates story content
- `generate-enhanced-story/index.ts` - Advanced story generation
- `generate-story-illustrations/index.ts` - Creates scene illustrations
- `generate-story-narration/index.ts` - Generates audio narration
- `text-to-speech/index.ts` - TTS conversion
- `inject-habit-into-story/index.ts` - Adds learning themes

---

### 2. Family History & Tree Builder
**Location**: `/dashboard/family`

#### Components
- `FamilyTreeBuilder.tsx` - Interactive family tree editor
- `FamilyTreeFlow.tsx` - React Flow visualization
- `MemberDetailDialog.tsx` - Family member profiles
- `RelationshipEditor.tsx` - Manage family relationships
- `TreeControls.tsx` - Zoom, pan, fullscreen controls
- `TreeExportPanel.tsx` - Export to PNG/JPEG/PDF/JSON
- `NarrativeEditor.tsx` - Rich text family narratives
- `PhotoLibraryPanel.tsx` - Family photo management
- `FamilyStoryRecorder.tsx` - Audio recording
- `FamilyDocumentUploader.tsx` - Document scanning

#### Capabilities
- Drag-and-drop family tree building
- Relationship type management (parent, spouse, sibling, grandparent, extended)
- Photo uploads with AI-powered metadata extraction
- Audio story recording with AI transcription
- Document scanning and processing
- Export family tree in multiple formats
- Custom positioning and layout algorithms
- Zoom, pan, and fullscreen viewing

#### Edge Functions
- `process-family-photo/index.ts` - Extracts metadata from photos
- `process-family-document/index.ts` - OCR and document processing
- `transcribe-family-story/index.ts` - Audio-to-text transcription
- `get-family-context/index.ts` - Retrieves family data for AI

---

### 3. Learning Journeys
**Location**: `/journeys`, `/dashboard/journeys`

#### Components
- `JourneyWizard.tsx` - Create custom learning journeys
- `JourneyProgressWidget.tsx` - Progress tracking
- `JourneyProgressDashboard.tsx` - Detailed analytics
- `DailyMissionCard.tsx` - Daily tasks
- `MissionCompletionDialog.tsx` - Completion celebration
- `ReflectionDialog.tsx` - Post-journey reflection
- `JourneyShareManager.tsx` - Share journeys
- `JourneyTemplateSelector.tsx` - Pre-built templates
- `GoalJourneyManager.tsx` - Goal setting

#### Capabilities
- Multi-day learning journeys with daily missions
- AI-generated journey steps based on goals
- Progress tracking with badges and streaks
- Reflection prompts for learning consolidation
- Parent insights and analytics
- Shareable journey templates
- Gamification with rewards

#### Edge Functions
- `generate-journey-steps/index.ts` - Creates journey content
- `buddy-mission-encouragement/index.ts` - Motivational messages

---

### 4. AI Chat Buddy
**Location**: `/child-chat`, `/kids-launcher`

#### Components
- `ChatInterface.tsx` - Main chat UI
- `ChatMessage.tsx` - Message rendering
- `BuddyAvatar.tsx` - Animated avatar
- `PersonalitySelector.tsx` - Choose buddy personality
- `BottomModeBar.tsx` - Mode switching
- `DesktopModeSwitcher.tsx` - Desktop navigation

#### Capabilities
- Safe, age-appropriate AI conversations
- Multiple buddy personalities
- Context-aware responses using family history
- Topic filtering and content moderation
- Voice expression animations
- Mode switching (Stories, Learning, Chat)

#### Edge Functions
- `child-chat/index.ts` - Handles chat conversations
- `match-content/index.ts` - Content appropriateness checking

---

### 5. Parent Dashboard
**Location**: `/dashboard`

#### Main Sections

##### Overview (`/dashboard/overview`)
- Child profile management
- Activity feed
- Quick stats
- Recent stories and journeys

##### Content Library (`/dashboard/library`)
- Browse stories, journeys, and learning packs
- Content filtering and search
- Preview functionality

##### Topics Management (`/dashboard/topics`)
- Create custom learning topics
- Topic analytics
- Bulk topic management
- Content pack editor

##### Safety & Moderation (`/dashboard/safety`)
- Content moderation logs
- Topic filtering
- Activity monitoring
- Safety settings

##### Insights (`/dashboard/insights`)
- Engagement analytics
- Learning progress
- Time spent analysis
- Topic interests

##### Avatar Customization (`/dashboard/generate-avatars`)
- AI avatar generation
- Avatar library
- Accessory management
- Expression customization

#### Key Components
- `ChildProfileCard.tsx` - Child account management
- `CreateChildDialog.tsx` - Add new child profiles
- `ParentInsights.tsx` - Analytics dashboard
- `ContentModerationLog.tsx` - Safety monitoring
- `TopicManager.tsx` - Learning content curation
- `AvatarCustomizer.tsx` - Visual customization
- `WelcomeDialog.tsx` - Onboarding flow

---

### 6. Authentication & User Management

#### Features
- Email/password authentication
- Auto-confirm email signups (enabled)
- Row Level Security (RLS) policies
- Child profile management
- Parent account controls

#### Security
- All tables protected with RLS
- User-specific data isolation
- Content moderation pipeline
- Safe AI interactions

---

## Database Schema

### Core Tables

#### `profiles`
- User profile information
- Parent accounts
- Settings and preferences

#### `child_profiles`
- Child accounts linked to parents
- Age, interests, avatar settings
- Learning preferences

#### `child_stories`
- Generated stories
- Audio content
- Illustrations
- Metadata (theme, mood, values)

#### `family_members`
- Family tree nodes
- Photos, birth dates
- Tree positioning data

#### `family_relationships`
- Relationship types
- Graph edges

#### `family_photos`
- Photo library
- AI-extracted metadata
- Tags and dates

#### `family_stories`
- Recorded audio narratives
- Transcriptions
- Associated members

#### `journeys`
- Learning journey definitions
- Goals and durations
- Templates

#### `journey_steps`
- Daily missions
- Completion tracking
- Reflections

#### `topics`
- Learning topic library
- Parent-created content
- Age ranges

#### `chat_messages`
- Conversation history
- AI responses
- Context references

#### `badges`
- Achievement definitions
- Award criteria

#### `child_badges`
- Earned badges
- Timestamps

---

## Edge Functions

### Story Generation
1. **`generate-story`** - Basic story creation
2. **`generate-enhanced-story`** - Advanced story with customization
3. **`generate-story-illustrations`** - Scene illustrations
4. **`generate-story-narration`** - Full narration generation
5. **`inject-habit-into-story`** - Embed learning themes

### Voice & Audio
6. **`text-to-speech`** - TTS conversion
7. **`transcribe-family-story`** - Audio transcription (Whisper)

### Family Features
8. **`process-family-photo`** - Photo metadata extraction
9. **`process-family-document`** - Document OCR
10. **`get-family-context`** - Family data retrieval

### Chat & Interaction
11. **`child-chat`** - AI conversation handler
12. **`buddy-mission-encouragement`** - Motivational messages
13. **`match-content`** - Content filtering

### Utilities
14. **`generate-avatar`** - Single avatar creation
15. **`generate-avatar-library`** - Batch avatar generation
16. **`generate-website-image`** - Marketing imagery

---

## Design System

### Color Tokens (HSL)
Defined in `src/index.css` and `tailwind.config.ts`

#### Core Colors
- `--background` - Main background
- `--foreground` - Main text
- `--card` - Card backgrounds
- `--primary` - Brand color
- `--secondary` - Secondary actions
- `--accent` - Highlights
- `--muted` - Subtle elements
- `--destructive` - Error states

#### Chart Colors
- `--chart-1` through `--chart-5` for data visualization

### Component Variants
All UI components use semantic tokens, never direct colors:
- Buttons: default, secondary, outline, ghost, destructive
- Cards: elevated, outlined, interactive
- Badges: default, secondary, outline, destructive

---

## Key Hooks

### Dashboard Hooks (`src/hooks/dashboard/`)
- `useChildProfiles.ts` - Manage child accounts
- `useChildContext.ts` - Current child state
- `useChildActivities.ts` - Activity tracking
- `useStories.ts` - Story CRUD operations
- `useAvatarLibrary.ts` - Avatar management
- `useDashboardGreeting.ts` - Dynamic greetings

### Feature Hooks
- `useJourneyData.ts` - Journey progress
- `useStoryUsage.ts` - Story analytics
- `useTextToSpeech.ts` - Audio playback
- `useAvatarExpression.ts` - Avatar animations
- `use-mobile.tsx` - Responsive detection

---

## Recent Updates

### 2024-01-XX: OpenAI API Key Configuration
- Updated `OPENAI_API_KEY` secret in Supabase
- Verified edge function configurations
- All AI features ready for production use

### Key Configurations
- TTS Voice Options: alloy, echo, fable, onyx, nova, shimmer
- Story Lengths: short, medium, long
- Illustration Styles: watercolor, digital-art, pencil-sketch, cartoon
- Moods: cheerful, calm, adventurous, mysterious, educational

---

## Environment Variables

Managed automatically via Lovable Cloud:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

Secrets (backend only):
- `OPENAI_API_KEY` - OpenAI API access
- `LOVABLE_API_KEY` - AI Gateway access (auto-provisioned)

---

## File Structure

```
src/
├── components/
│   ├── chat/              # AI buddy chat
│   ├── dashboard/         # Parent dashboard
│   │   ├── family/        # Family tree components
│   │   └── layout/        # Dashboard layout
│   ├── gamification/      # Badges, streaks
│   ├── journey/           # Learning journeys
│   ├── landing/           # Marketing pages
│   ├── modes/             # App mode switching
│   ├── stories/           # Story generation
│   └── ui/                # shadcn components
├── contexts/
│   └── ModeContext.tsx    # App mode state
├── hooks/                 # Custom React hooks
├── integrations/
│   └── supabase/          # Supabase client (auto-generated)
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── storyValidation.ts # Story validation
│   └── familyTreeLayout.ts # Tree algorithms
├── pages/
│   ├── dashboard/         # Dashboard routes
│   ├── features/          # Feature pages
│   └── legal/             # Legal pages
└── assets/                # Images and media

supabase/
├── functions/             # Edge functions
└── config.toml           # Supabase configuration
```

---

## Testing Checklist

### Story Features
- ✅ Story generation with custom themes
- ✅ Illustration generation
- ✅ Audio narration with TTS
- ✅ Bedtime mode playback
- ✅ Story editing and saving

### Family Features
- ✅ Family tree building
- ✅ Photo upload and processing
- ✅ Audio recording and transcription
- ✅ Export functionality
- ✅ Relationship management

### Journey Features
- ✅ Journey creation wizard
- ✅ Daily mission tracking
- ✅ Progress analytics
- ✅ Badge system

### Chat Features
- ✅ AI conversation
- ✅ Content moderation
- ✅ Personality switching
- ✅ Context awareness

### Dashboard Features
- ✅ Child profile management
- ✅ Activity monitoring
- ✅ Content library
- ✅ Safety controls

---

## Next Steps & Recommendations

### Performance Optimization
- Implement lazy loading for images
- Add caching for frequently accessed stories
- Optimize family tree rendering for large trees

### Feature Enhancements
- Add multi-language support
- Implement voice input for chat
- Add collaborative family tree editing
- Create shareable story links
- Add print-optimized story layouts

### Content Expansion
- More journey templates
- Additional story themes
- Expanded topic library
- More avatar customization options

### Analytics
- Enhanced engagement tracking
- Learning outcome metrics
- Usage pattern analysis
- A/B testing framework

---

## Support & Documentation

### Key Documentation
- Design system: `src/index.css`, `tailwind.config.ts`
- Database schema: Supabase dashboard
- API integration: Edge function implementations
- Component library: `src/components/ui/`

### Testing URLs
- Main app: `/`
- Kids launcher: `/kids-launcher`
- Parent dashboard: `/dashboard`
- Story builder: `/stories`
- Family tree: `/dashboard/family`
- Learning journeys: `/journeys`

---

## Security & Compliance

### Data Protection
- RLS policies on all tables
- User data isolation
- Secure file storage
- Content moderation

### Child Safety
- Age-appropriate content filtering
- Parent oversight controls
- Activity monitoring
- Safe AI interactions

### Compliance
- COPPA compliance features
- Privacy policy implementation
- Terms of service
- Data export capabilities

---

## Credits & Technology

Built with:
- React & TypeScript
- Tailwind CSS
- Supabase (via Lovable Cloud)
- OpenAI API
- Radix UI
- Framer Motion
- React Flow

Developed on Lovable platform with AI-assisted development.

---

*Last Updated: 2024-01-XX*
*Project: Paliyo Family Storytelling Platform*
*Status: Active Development*
