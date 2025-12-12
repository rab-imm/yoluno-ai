-- Child Chat Buddy Database Schema
-- Migration: 20231215_child_chat_buddy

-- ============================================================================
-- Table: chat_buddies
-- Description: Stores unique AI buddy configuration for each child
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_buddies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Buddy Customization
  buddy_name text NOT NULL DEFAULT 'Buddy',
  buddy_avatar_url text,
  personality_traits jsonb NOT NULL DEFAULT '{
    "curious": 5,
    "patient": 5,
    "playful": 5,
    "educational": 5,
    "empathetic": 5
  }'::jsonb,

  -- AI Context (stores last 20 messages for conversation memory)
  conversation_context jsonb NOT NULL DEFAULT '[]'::jsonb,
  learned_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Stats
  total_messages integer NOT NULL DEFAULT 0,
  last_interaction_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for chat_buddies
CREATE INDEX IF NOT EXISTS idx_chat_buddies_child ON chat_buddies(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_chat_buddies_last_interaction ON chat_buddies(last_interaction_at DESC);

-- ============================================================================
-- Table: buddy_messages
-- Description: Stores all chat messages between child and buddy
-- ============================================================================
CREATE TABLE IF NOT EXISTS buddy_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_buddy_id uuid REFERENCES chat_buddies(id) ON DELETE CASCADE NOT NULL,
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,

  -- Message Content
  role text NOT NULL CHECK (role IN ('child', 'buddy', 'system')),
  content text NOT NULL,

  -- Safety Analysis
  safety_level text NOT NULL DEFAULT 'green' CHECK (safety_level IN ('green', 'yellow', 'red')),
  safety_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  safety_notes text,

  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for buddy_messages
CREATE INDEX IF NOT EXISTS idx_buddy_messages_chat ON buddy_messages(chat_buddy_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_buddy_messages_child ON buddy_messages(child_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_buddy_messages_safety ON buddy_messages(child_profile_id, safety_level, created_at DESC) WHERE safety_level IN ('yellow', 'red');

-- ============================================================================
-- Table: safety_reports
-- Description: Stores safety reports for parent review
-- ============================================================================
CREATE TABLE IF NOT EXISTS safety_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_profile_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  message_id uuid REFERENCES buddy_messages(id) ON DELETE SET NULL,

  -- Report Details
  report_type text NOT NULL CHECK (report_type IN ('real_time', 'weekly_summary')),
  severity text NOT NULL CHECK (severity IN ('yellow', 'red')),

  -- Content
  issue_summary text NOT NULL,
  message_excerpt text,
  ai_analysis text,

  -- Status
  reviewed boolean NOT NULL DEFAULT false,
  reviewed_at timestamptz,
  parent_notes text,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for safety_reports
CREATE INDEX IF NOT EXISTS idx_safety_reports_parent ON safety_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_reports_child ON safety_reports(child_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_reports_unreviewed ON safety_reports(user_id, reviewed) WHERE NOT reviewed;
CREATE INDEX IF NOT EXISTS idx_safety_reports_severity ON safety_reports(user_id, severity, created_at DESC);

-- ============================================================================
-- Table: buddy_personality_suggestions
-- Description: AI-generated personality adjustment suggestions for parents
-- ============================================================================
CREATE TABLE IF NOT EXISTS buddy_personality_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_buddy_id uuid REFERENCES chat_buddies(id) ON DELETE CASCADE NOT NULL,

  -- AI Suggestion
  suggested_traits jsonb NOT NULL,
  reason text NOT NULL,
  based_on_interactions integer NOT NULL,

  -- Parent Response
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  parent_feedback text,

  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);

-- Indexes for buddy_personality_suggestions
CREATE INDEX IF NOT EXISTS idx_personality_suggestions_buddy ON buddy_personality_suggestions(chat_buddy_id, status, created_at DESC);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE chat_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_personality_suggestions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies: chat_buddies
-- ============================================================================

-- Parents can view/manage their children's buddies
CREATE POLICY "Parents can view their children's buddies"
  ON chat_buddies FOR SELECT
  USING (
    child_profile_id IN (
      SELECT id FROM child_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update their children's buddies"
  ON chat_buddies FOR UPDATE
  USING (
    child_profile_id IN (
      SELECT id FROM child_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert buddies for their children"
  ON chat_buddies FOR INSERT
  WITH CHECK (
    child_profile_id IN (
      SELECT id FROM child_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS Policies: buddy_messages
-- ============================================================================

-- Parents can view their children's messages
CREATE POLICY "Parents can view their children's buddy messages"
  ON buddy_messages FOR SELECT
  USING (
    child_profile_id IN (
      SELECT id FROM child_profiles WHERE user_id = auth.uid()
    )
  );

-- Service role (Edge Functions) can insert messages
CREATE POLICY "Service role can insert buddy messages"
  ON buddy_messages FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- RLS Policies: safety_reports
-- ============================================================================

-- Parents can view their own safety reports
CREATE POLICY "Parents can view their safety reports"
  ON safety_reports FOR SELECT
  USING (user_id = auth.uid());

-- Parents can update their safety reports (mark as reviewed)
CREATE POLICY "Parents can update their safety reports"
  ON safety_reports FOR UPDATE
  USING (user_id = auth.uid());

-- Service role can insert safety reports
CREATE POLICY "Service role can insert safety reports"
  ON safety_reports FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- RLS Policies: buddy_personality_suggestions
-- ============================================================================

-- Parents can view suggestions for their children's buddies
CREATE POLICY "Parents can view personality suggestions"
  ON buddy_personality_suggestions FOR SELECT
  USING (
    chat_buddy_id IN (
      SELECT id FROM chat_buddies WHERE child_profile_id IN (
        SELECT id FROM child_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Parents can update suggestions (accept/reject)
CREATE POLICY "Parents can update personality suggestions"
  ON buddy_personality_suggestions FOR UPDATE
  USING (
    chat_buddy_id IN (
      SELECT id FROM chat_buddies WHERE child_profile_id IN (
        SELECT id FROM child_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Service role can insert suggestions
CREATE POLICY "Service role can insert personality suggestions"
  ON buddy_personality_suggestions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- Trigger: Update chat_buddies.updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_chat_buddies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_chat_buddies_updated_at
  BEFORE UPDATE ON chat_buddies
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_buddies_updated_at();

-- ============================================================================
-- Function: Auto-create buddy when child profile is created
-- ============================================================================
CREATE OR REPLACE FUNCTION create_buddy_for_new_child()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO chat_buddies (child_profile_id, buddy_name)
  VALUES (NEW.id, 'Buddy');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_buddy
  AFTER INSERT ON child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_buddy_for_new_child();

-- ============================================================================
-- Function: Increment buddy message count
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_buddy_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_buddies
  SET
    total_messages = total_messages + 1,
    last_interaction_at = NEW.created_at
  WHERE id = NEW.chat_buddy_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_buddy_stats
  AFTER INSERT ON buddy_messages
  FOR EACH ROW
  EXECUTE FUNCTION increment_buddy_message_count();

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE chat_buddies IS 'Stores AI buddy configuration for each child with personality traits and conversation context';
COMMENT ON TABLE buddy_messages IS 'Stores all chat messages between children and their AI buddies with safety analysis';
COMMENT ON TABLE safety_reports IS 'Stores safety reports for parent review with severity levels and status';
COMMENT ON TABLE buddy_personality_suggestions IS 'AI-generated suggestions for buddy personality adjustments based on interactions';
