-- Phase 1: Database Schema Enhancements

-- Create family_narratives table for rich stories per family member
CREATE TABLE public.family_narratives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  story_date date,
  media_urls text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on family_narratives
ALTER TABLE public.family_narratives ENABLE ROW LEVEL SECURITY;

-- RLS policies for family_narratives
CREATE POLICY "Parents can view their own narratives"
  ON public.family_narratives FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own narratives"
  ON public.family_narratives FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own narratives"
  ON public.family_narratives FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own narratives"
  ON public.family_narratives FOR DELETE
  USING (auth.uid() = parent_id);

-- Add tree positioning to family_relationships for visual layout
ALTER TABLE public.family_relationships 
ADD COLUMN tree_position_x integer,
ADD COLUMN tree_position_y integer;

-- Add trigger for updated_at on family_narratives
CREATE TRIGGER update_family_narratives_updated_at
  BEFORE UPDATE ON public.family_narratives
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_family_narratives_member_id ON public.family_narratives(member_id);
CREATE INDEX idx_family_narratives_parent_id ON public.family_narratives(parent_id);