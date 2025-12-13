-- Initial Database Schema
-- Migration: 20231201_initial_schema

-- ============================================================================
-- Table: avatar_library
-- ============================================================================
CREATE TABLE IF NOT EXISTS avatar_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text,
  is_animated boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  is_active boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Table: child_profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  avatar_id uuid REFERENCES avatar_library(id) ON DELETE SET NULL,
  personality_mode text,
  interests text[] DEFAULT '{}',
  learning_style text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz,
  pin_hash text
);

CREATE INDEX IF NOT EXISTS idx_child_profiles_user ON child_profiles(user_id);

-- ============================================================================
-- Table: stories
-- ============================================================================
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  theme text,
  mood text,
  "values" text[] DEFAULT '{}',
  word_count integer,
  illustration_style text,
  narration_voice text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stories_child ON stories(child_profile_id);

-- ============================================================================
-- Table: family_members
-- ============================================================================
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  relationship_type text,
  birth_date date,
  photo_url text,
  notes text,
  is_alive boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id);

-- ============================================================================
-- Table: family_relationships
-- ============================================================================
CREATE TABLE IF NOT EXISTS family_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member1_id uuid REFERENCES family_members(id) ON DELETE CASCADE NOT NULL,
  member2_id uuid REFERENCES family_members(id) ON DELETE CASCADE NOT NULL,
  relationship_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Table: journeys
-- ============================================================================
CREATE TABLE IF NOT EXISTS journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  template_id text,
  title text NOT NULL,
  description text,
  status text DEFAULT 'active',
  progress integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_journeys_child ON journeys(child_profile_id);

-- ============================================================================
-- Table: journey_steps
-- ============================================================================
CREATE TABLE IF NOT EXISTS journey_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id uuid REFERENCES journeys(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  status text DEFAULT 'pending',
  order_index integer NOT NULL,
  progress integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_journey_steps_journey ON journey_steps(journey_id);

-- ============================================================================
-- Table: guardrail_settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS guardrail_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  safety_level text DEFAULT 'moderate',
  allowed_topics text[] DEFAULT '{}',
  blocked_topics text[] DEFAULT '{}',
  max_session_minutes integer DEFAULT 30,
  require_breaks boolean DEFAULT true,
  break_interval_minutes integer DEFAULT 15,
  content_filters_enabled boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Table: chat_sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  message_count integer DEFAULT 0,
  summary text
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_child ON chat_sessions(child_profile_id);

-- ============================================================================
-- Table: chat_messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  safety_level text DEFAULT 'green',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- ============================================================================
-- Table: user_subscriptions
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  tier text DEFAULT 'free',
  status text DEFAULT 'active',
  stories_used integer DEFAULT 0,
  stories_limit integer DEFAULT 5,
  chat_messages_used integer DEFAULT 0,
  chat_messages_limit integer DEFAULT 100,
  period_start timestamptz NOT NULL DEFAULT now(),
  period_end timestamptz NOT NULL DEFAULT (now() + interval '1 month'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardrail_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_library ENABLE ROW LEVEL SECURITY;

-- Avatar Library (public read)
CREATE POLICY "Anyone can view avatars" ON avatar_library FOR SELECT USING (true);

-- Child Profiles
CREATE POLICY "Users can view their own child profiles" ON child_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own child profiles" ON child_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own child profiles" ON child_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own child profiles" ON child_profiles FOR DELETE USING (auth.uid() = user_id);

-- Stories
CREATE POLICY "Users can view their children's stories" ON stories FOR SELECT USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert stories for their children" ON stories FOR INSERT WITH CHECK (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their children's stories" ON stories FOR UPDATE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their children's stories" ON stories FOR DELETE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);

-- Family Members
CREATE POLICY "Users can view their own family members" ON family_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own family members" ON family_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own family members" ON family_members FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own family members" ON family_members FOR DELETE USING (auth.uid() = user_id);

-- Family Relationships
CREATE POLICY "Users can view their own family relationships" ON family_relationships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own family relationships" ON family_relationships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own family relationships" ON family_relationships FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own family relationships" ON family_relationships FOR DELETE USING (auth.uid() = user_id);

-- Journeys
CREATE POLICY "Users can view their children's journeys" ON journeys FOR SELECT USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert journeys for their children" ON journeys FOR INSERT WITH CHECK (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their children's journeys" ON journeys FOR UPDATE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their children's journeys" ON journeys FOR DELETE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);

-- Journey Steps
CREATE POLICY "Users can view their children's journey steps" ON journey_steps FOR SELECT USING (
  journey_id IN (SELECT id FROM journeys WHERE child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can insert journey steps for their children" ON journey_steps FOR INSERT WITH CHECK (
  journey_id IN (SELECT id FROM journeys WHERE child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can update their children's journey steps" ON journey_steps FOR UPDATE USING (
  journey_id IN (SELECT id FROM journeys WHERE child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can delete their children's journey steps" ON journey_steps FOR DELETE USING (
  journey_id IN (SELECT id FROM journeys WHERE child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid()))
);

-- Guardrail Settings
CREATE POLICY "Users can view their children's guardrail settings" ON guardrail_settings FOR SELECT USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert guardrail settings for their children" ON guardrail_settings FOR INSERT WITH CHECK (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their children's guardrail settings" ON guardrail_settings FOR UPDATE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their children's guardrail settings" ON guardrail_settings FOR DELETE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);

-- Chat Sessions
CREATE POLICY "Users can view their children's chat sessions" ON chat_sessions FOR SELECT USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert chat sessions for their children" ON chat_sessions FOR INSERT WITH CHECK (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their children's chat sessions" ON chat_sessions FOR UPDATE USING (
  child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid())
);

-- Chat Messages
CREATE POLICY "Users can view their children's chat messages" ON chat_messages FOR SELECT USING (
  session_id IN (SELECT id FROM chat_sessions WHERE child_profile_id IN (SELECT id FROM child_profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Service role can insert chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- User Subscriptions
CREATE POLICY "Users can view their own subscription" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- Triggers for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_child_profiles_updated_at
  BEFORE UPDATE ON child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_journeys_updated_at
  BEFORE UPDATE ON journeys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_guardrail_settings_updated_at
  BEFORE UPDATE ON guardrail_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Auto-create subscription on user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION create_subscription_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_subscription_for_new_user();
