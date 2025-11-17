-- Phase 2: Session-level monitoring tables

-- Table 1: chat_session_metrics
-- Tracks conversation patterns and anomalies in real-time
CREATE TABLE chat_session_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_start timestamptz DEFAULT now(),
  session_end timestamptz,
  total_messages int DEFAULT 0,
  flagged_messages int DEFAULT 0,
  topics_discussed text[] DEFAULT '{}',
  topic_drift_score numeric DEFAULT 0,
  manipulation_attempts int DEFAULT 0,
  anomaly_score numeric DEFAULT 0,
  rapid_switching boolean DEFAULT false,
  parent_alerted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_session_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children's session metrics"
  ON chat_session_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = chat_session_metrics.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

CREATE POLICY "System can manage session metrics"
  ON chat_session_metrics FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_chat_session_metrics_child_id ON chat_session_metrics(child_id);
CREATE INDEX idx_chat_session_metrics_session_start ON chat_session_metrics(session_start DESC);

-- Table 2: message_rate_limits
-- Tracks message frequency to prevent spam
CREATE TABLE message_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  window_start timestamptz DEFAULT now(),
  message_count int DEFAULT 0,
  blocked_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, window_start)
);

ALTER TABLE message_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System manages rate limits"
  ON message_rate_limits FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_message_rate_limits_window_start ON message_rate_limits(window_start);
CREATE INDEX idx_message_rate_limits_child_id ON message_rate_limits(child_id);

-- Table 3: parent_alerts
-- Queue system for notifying parents
CREATE TABLE parent_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parent_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own alerts"
  ON parent_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.parent_id = auth.uid()
      AND child_profiles.parent_id = parent_alerts.parent_id
    )
  );

CREATE POLICY "Parents can update their own alerts"
  ON parent_alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.parent_id = auth.uid()
      AND child_profiles.parent_id = parent_alerts.parent_id
    )
  );

CREATE POLICY "System can create alerts"
  ON parent_alerts FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_parent_alerts_parent_id ON parent_alerts(parent_id);
CREATE INDEX idx_parent_alerts_created_at ON parent_alerts(created_at DESC);
CREATE INDEX idx_parent_alerts_is_read ON parent_alerts(is_read);

-- Phase 3: Adaptive guardrails tables

-- Table 4: guardrail_settings
-- Per-family customizable guardrail configuration
CREATE TABLE guardrail_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL UNIQUE,
  strictness_level text DEFAULT 'medium',
  block_on_yellow boolean DEFAULT false,
  notify_on_yellow boolean DEFAULT true,
  notify_on_green boolean DEFAULT false,
  custom_blocked_keywords text[] DEFAULT '{}',
  custom_allowed_phrases text[] DEFAULT '{}',
  require_explicit_approval boolean DEFAULT false,
  auto_expand_topics boolean DEFAULT true,
  messages_per_minute int DEFAULT 5,
  messages_per_hour int DEFAULT 50,
  max_response_length int DEFAULT 300,
  preferred_ai_tone text DEFAULT 'friendly',
  learn_from_approvals boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE guardrail_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage their own guardrail settings"
  ON guardrail_settings FOR ALL
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

-- Table 5: guardrail_learning_events
-- Tracks parent overrides to learn from their decisions
CREATE TABLE guardrail_learning_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  original_flag_level text,
  parent_decision text NOT NULL,
  message_content text,
  message_topic text,
  validation_reasoning jsonb,
  parent_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guardrail_learning_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own learning events"
  ON guardrail_learning_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.parent_id = auth.uid()
      AND child_profiles.parent_id = guardrail_learning_events.parent_id
    )
  );

CREATE POLICY "System can insert learning events"
  ON guardrail_learning_events FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_guardrail_learning_events_parent ON guardrail_learning_events(parent_id);
CREATE INDEX idx_guardrail_learning_events_child ON guardrail_learning_events(child_id);