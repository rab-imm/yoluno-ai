# Yoluno AI

AI-powered educational platform for children with personalized learning experiences, interactive chat, and story generation.

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard under Settings > API.

### 3. Supabase Edge Function Secrets

Set these secrets in Supabase Dashboard → Project Settings → Edge Functions → Secrets:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `OPENROUTER_API_KEY` | [OpenRouter](https://openrouter.ai) API key | AI Chat, Story Generation |
| `OPENAI_API_KEY` | [OpenAI](https://platform.openai.com) API key | Text-to-Speech |

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Project Structure

```
src/
├── types/           # Centralized type definitions
├── lib/             # Utilities and error handling
├── services/        # Data access layer (Supabase)
├── hooks/queries/   # React Query hooks
├── contexts/        # React contexts (Auth, Child, Chat)
├── integrations/    # External integrations (Supabase)
├── components/
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── shared/      # Reusable components
│   ├── chat/        # Chat interface
│   └── dashboard/   # Dashboard components
└── pages/           # Route pages
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack React Query
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Validation**: Zod
- **Icons**: Lucide React

## Features

- Parent dashboard for managing child profiles
- Kids mode with AI chat interface
- Story generation wizard
- Safety guardrails and content filtering
- Family tree management
- Learning journeys tracking
