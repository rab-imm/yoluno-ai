-- Create voice_vault_clips table for storing parent voice recordings
CREATE TABLE voice_vault_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  clip_name TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_ms INTEGER DEFAULT 1000,
  category TEXT DEFAULT 'encouragement' CHECK (category IN ('encouragement', 'praise', 'celebration')),
  is_active BOOLEAN DEFAULT true,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE voice_vault_clips ENABLE ROW LEVEL SECURITY;

-- Parents can manage their own voice clips
CREATE POLICY "Parents can view their own voice clips"
  ON voice_vault_clips FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own voice clips"
  ON voice_vault_clips FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own voice clips"
  ON voice_vault_clips FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own voice clips"
  ON voice_vault_clips FOR DELETE
  USING (auth.uid() = parent_id);

-- Add trigger for updated_at
CREATE TRIGGER update_voice_vault_clips_updated_at
  BEFORE UPDATE ON voice_vault_clips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();