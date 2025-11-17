-- Create message validation logs table
CREATE TABLE IF NOT EXISTS public.message_validation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  validation_stage TEXT NOT NULL CHECK (validation_stage IN ('request', 'response')),
  flag_level TEXT NOT NULL CHECK (flag_level IN ('green', 'yellow', 'red')),
  flag_reasons JSONB DEFAULT '[]'::jsonb,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('allowed', 'blocked', 'modified')),
  parent_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_validation_logs_child_id ON message_validation_logs(child_id);
CREATE INDEX idx_validation_logs_flag_level ON message_validation_logs(flag_level);
CREATE INDEX idx_validation_logs_created_at ON message_validation_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.message_validation_logs ENABLE ROW LEVEL SECURITY;

-- Parents can view validation logs for their children
CREATE POLICY "Parents can view validation logs for their children"
ON message_validation_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = message_validation_logs.child_id
    AND child_profiles.parent_id = auth.uid()
  )
);

-- System can insert validation logs
CREATE POLICY "System can insert validation logs"
ON message_validation_logs
FOR INSERT
WITH CHECK (true);