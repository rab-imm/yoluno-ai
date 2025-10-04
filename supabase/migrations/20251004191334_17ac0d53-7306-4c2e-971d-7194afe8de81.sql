-- Add custom avatar support to child_profiles
ALTER TABLE child_profiles
ADD COLUMN IF NOT EXISTS custom_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_expression TEXT DEFAULT 'neutral';

-- Add table for unlockable avatar accessories
CREATE TABLE IF NOT EXISTS avatar_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  accessory_type TEXT NOT NULL, -- 'hat', 'glasses', 'background', etc.
  accessory_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT false,
  UNIQUE(child_id, accessory_type, accessory_id)
);

-- Enable RLS
ALTER TABLE avatar_accessories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for avatar_accessories
CREATE POLICY "Users can view their children's accessories"
  ON avatar_accessories FOR SELECT
  USING (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert accessories for their children"
  ON avatar_accessories FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their children's accessories"
  ON avatar_accessories FOR UPDATE
  USING (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their children's accessories"
  ON avatar_accessories FOR DELETE
  USING (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );