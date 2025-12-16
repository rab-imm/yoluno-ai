-- Add PIN authentication fields to child_profiles
ALTER TABLE child_profiles 
ADD COLUMN IF NOT EXISTS pin_code TEXT CHECK (length(pin_code) = 4 OR pin_code IS NULL),
ADD COLUMN IF NOT EXISTS pin_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_access_at TIMESTAMPTZ;

-- Create kids_sessions table for independent kid authentication
CREATE TABLE IF NOT EXISTS kids_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  device_info TEXT,
  last_activity_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on kids_sessions
ALTER TABLE kids_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Kids sessions are viewable by the parent who owns the child
CREATE POLICY "Parents can view their children's sessions"
  ON kids_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = kids_sessions.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

-- Policy: System can manage sessions (for the auth provider)
CREATE POLICY "System can manage kids sessions"
  ON kids_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create kids_invites table for shareable links
CREATE TABLE IF NOT EXISTS kids_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  used_count INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on kids_invites
ALTER TABLE kids_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Parents can manage invites for their children
CREATE POLICY "Parents can manage their children's invites"
  ON kids_invites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = kids_invites.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM child_profiles
      WHERE child_profiles.id = kids_invites.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

-- Policy: Anyone can read active invites (for the public /play route)
CREATE POLICY "Anyone can read active invites"
  ON kids_invites FOR SELECT
  USING (is_active = true);

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_kids_sessions_token ON kids_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_kids_sessions_child_id ON kids_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_kids_invites_code ON kids_invites(invite_code);