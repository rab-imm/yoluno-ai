-- Create table for persistent child memory (key facts, preferences, learning progress)
CREATE TABLE public.child_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('preference', 'fact', 'achievement', 'interest', 'learning_progress')),
  memory_key TEXT NOT NULL,
  memory_value TEXT NOT NULL,
  importance_score INTEGER NOT NULL DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
  last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, memory_type, memory_key)
);

-- Create table for conversation summaries
CREATE TABLE public.conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  summary TEXT NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  topics_discussed TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, session_date)
);

-- Enable RLS
ALTER TABLE public.child_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_summaries ENABLE ROW LEVEL SECURITY;

-- Parents can view memory for their children
CREATE POLICY "Parents can view memory for their children"
ON public.child_memory
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = child_memory.child_id
    AND child_profiles.parent_id = auth.uid()
  )
);

-- System can manage memory
CREATE POLICY "System can manage memory"
ON public.child_memory
FOR ALL
USING (true)
WITH CHECK (true);

-- Parents can view summaries for their children
CREATE POLICY "Parents can view summaries for their children"
ON public.conversation_summaries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = conversation_summaries.child_id
    AND child_profiles.parent_id = auth.uid()
  )
);

-- System can manage summaries
CREATE POLICY "System can manage summaries"
ON public.conversation_summaries
FOR ALL
USING (true)
WITH CHECK (true);

-- Add indexes for faster queries
CREATE INDEX idx_child_memory_child_id ON public.child_memory(child_id);
CREATE INDEX idx_child_memory_importance ON public.child_memory(importance_score DESC);
CREATE INDEX idx_child_memory_accessed ON public.child_memory(last_accessed_at DESC);
CREATE INDEX idx_conversation_summaries_child_id ON public.conversation_summaries(child_id);
CREATE INDEX idx_conversation_summaries_date ON public.conversation_summaries(session_date DESC);