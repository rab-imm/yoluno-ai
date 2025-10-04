-- Enhance child_stories table with new fields for Story Buddy
ALTER TABLE child_stories
ADD COLUMN IF NOT EXISTS theme text,
ADD COLUMN IF NOT EXISTS mood text,
ADD COLUMN IF NOT EXISTS values text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS characters jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS narration_voice text DEFAULT 'alloy',
ADD COLUMN IF NOT EXISTS illustration_style text DEFAULT 'cartoon',
ADD COLUMN IF NOT EXISTS audio_url text,
ADD COLUMN IF NOT EXISTS audio_content text,
ADD COLUMN IF NOT EXISTS illustrations jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS parent_intro_url text,
ADD COLUMN IF NOT EXISTS duration_seconds integer,
ADD COLUMN IF NOT EXISTS bedtime_ready boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS story_length text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS scenes jsonb DEFAULT '[]';

-- Create story_themes table for predefined themes
CREATE TABLE IF NOT EXISTS story_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  description text NOT NULL,
  age_appropriate text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE story_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story themes are viewable by everyone"
ON story_themes FOR SELECT
USING (true);

-- Create story_usage table for tier enforcement
CREATE TABLE IF NOT EXISTS story_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL, -- format: YYYY-MM
  story_count integer DEFAULT 0,
  tier text DEFAULT 'free',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(parent_id, month)
);

ALTER TABLE story_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own usage"
ON story_usage FOR SELECT
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own usage"
ON story_usage FOR UPDATE
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own usage"
ON story_usage FOR INSERT
WITH CHECK (auth.uid() = parent_id);

-- Insert predefined story themes
INSERT INTO story_themes (name, emoji, description, age_appropriate) VALUES
('Space', '🚀', 'Adventures among the stars and planets', ARRAY['5-7', '8-10', '11-12']),
('Dinosaurs', '🦕', 'Journey back to the time of dinosaurs', ARRAY['5-7', '8-10', '11-12']),
('Animals', '🦁', 'Stories about amazing creatures', ARRAY['5-7', '8-10', '11-12']),
('Friendship', '🤝', 'Tales about making and keeping friends', ARRAY['5-7', '8-10', '11-12']),
('Adventure', '⛰️', 'Exciting quests and explorations', ARRAY['5-7', '8-10', '11-12']),
('Nature', '🌳', 'Discover the wonders of the natural world', ARRAY['5-7', '8-10', '11-12']),
('Ocean', '🌊', 'Dive into underwater adventures', ARRAY['5-7', '8-10', '11-12']),
('Magic', '✨', 'Enchanted worlds and magical creatures', ARRAY['5-7', '8-10', '11-12'])
ON CONFLICT DO NOTHING;

-- Add trigger for story_usage updated_at
CREATE TRIGGER update_story_usage_updated_at
BEFORE UPDATE ON story_usage
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();