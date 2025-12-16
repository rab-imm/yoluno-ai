-- Create family events table
CREATE TABLE IF NOT EXISTS public.family_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'other',
  location TEXT,
  related_member_ids UUID[] DEFAULT '{}',
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_events ENABLE ROW LEVEL SECURITY;

-- Create policies for family_events
CREATE POLICY "Parents can view their own events"
  ON public.family_events
  FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own events"
  ON public.family_events
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own events"
  ON public.family_events
  FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own events"
  ON public.family_events
  FOR DELETE
  USING (auth.uid() = parent_id);

-- Create index for better query performance
CREATE INDEX idx_family_events_parent_date ON public.family_events(parent_id, event_date DESC);