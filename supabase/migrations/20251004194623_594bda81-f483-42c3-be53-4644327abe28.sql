-- Create custom_topic_packs table for parent-created packs
CREATE TABLE custom_topic_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  emoji text DEFAULT '📚',
  topics text[] NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE custom_topic_packs ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_topic_packs
CREATE POLICY "Parents can view their own custom packs"
  ON custom_topic_packs FOR SELECT
  USING (auth.uid() = parent_id OR is_public = true);

CREATE POLICY "Parents can create their own custom packs"
  ON custom_topic_packs FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own custom packs"
  ON custom_topic_packs FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own custom packs"
  ON custom_topic_packs FOR DELETE
  USING (auth.uid() = parent_id);

-- Create topic_analytics table for tracking topic performance
CREATE TABLE topic_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  message_count integer DEFAULT 0,
  last_used_at timestamptz,
  engagement_score numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic, child_id)
);

-- Enable RLS
ALTER TABLE topic_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for topic_analytics
CREATE POLICY "Parents can view analytics for their children"
  ON topic_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = topic_analytics.child_id
    AND child_profiles.parent_id = auth.uid()
  ));

CREATE POLICY "System can manage topic analytics"
  ON topic_analytics FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create topic_feedback table for parent feedback
CREATE TABLE topic_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, topic)
);

-- Enable RLS
ALTER TABLE topic_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for topic_feedback
CREATE POLICY "Parents can view their own feedback"
  ON topic_feedback FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create their own feedback"
  ON topic_feedback FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own feedback"
  ON topic_feedback FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own feedback"
  ON topic_feedback FOR DELETE
  USING (auth.uid() = parent_id);

-- Add trigger for custom_topic_packs updated_at
CREATE TRIGGER update_custom_topic_packs_updated_at
  BEFORE UPDATE ON custom_topic_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();