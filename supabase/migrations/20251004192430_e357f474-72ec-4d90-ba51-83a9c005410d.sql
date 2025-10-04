-- Create table for content moderation logs
CREATE TABLE public.content_moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  flag_reason TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_moderation_logs ENABLE ROW LEVEL SECURITY;

-- Parents can view moderation logs for their children
CREATE POLICY "Parents can view moderation logs for their children"
ON public.content_moderation_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = content_moderation_logs.child_id
    AND child_profiles.parent_id = auth.uid()
  )
);

-- System can insert logs
CREATE POLICY "System can insert moderation logs"
ON public.content_moderation_logs
FOR INSERT
WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_content_moderation_logs_child_id ON public.content_moderation_logs(child_id);
CREATE INDEX idx_content_moderation_logs_severity ON public.content_moderation_logs(severity);