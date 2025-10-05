-- Create enum types
CREATE TYPE family_story_type AS ENUM ('text', 'audio', 'document');
CREATE TYPE age_restriction_level AS ENUM ('all', 'age_8_plus', 'age_12_plus');
CREATE TYPE subscription_type AS ENUM ('family_history_basic', 'family_history_plus', 'family_history_pro');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');

-- Create family_members table
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT,
  birth_date DATE,
  location TEXT,
  bio TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own family members"
  ON public.family_members FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own family members"
  ON public.family_members FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own family members"
  ON public.family_members FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own family members"
  ON public.family_members FOR DELETE
  USING (auth.uid() = parent_id);

-- Create family_stories table
CREATE TABLE public.family_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  story_type family_story_type NOT NULL,
  content TEXT,
  file_url TEXT,
  ai_summary TEXT,
  related_member_ids UUID[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  is_age_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.family_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own stories"
  ON public.family_stories FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own stories"
  ON public.family_stories FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own stories"
  ON public.family_stories FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own stories"
  ON public.family_stories FOR DELETE
  USING (auth.uid() = parent_id);

-- Create family_photos table
CREATE TABLE public.family_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  ai_caption TEXT,
  linked_member_ids UUID[] DEFAULT '{}',
  date_taken DATE,
  location TEXT,
  description TEXT,
  file_size_bytes INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.family_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own photos"
  ON public.family_photos FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own photos"
  ON public.family_photos FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own photos"
  ON public.family_photos FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own photos"
  ON public.family_photos FOR DELETE
  USING (auth.uid() = parent_id);

-- Create family_relationships table
CREATE TABLE public.family_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  related_person_id UUID NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.family_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own relationships"
  ON public.family_relationships FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own relationships"
  ON public.family_relationships FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own relationships"
  ON public.family_relationships FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own relationships"
  ON public.family_relationships FOR DELETE
  USING (auth.uid() = parent_id);

-- Create family_history_access table
CREATE TABLE public.family_history_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT false,
  age_restriction age_restriction_level DEFAULT 'all',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

ALTER TABLE public.family_history_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own access settings"
  ON public.family_history_access FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own access settings"
  ON public.family_history_access FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own access settings"
  ON public.family_history_access FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own access settings"
  ON public.family_history_access FOR DELETE
  USING (auth.uid() = parent_id);

-- Create parent_subscriptions table
CREATE TABLE public.parent_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type subscription_type NOT NULL,
  status subscription_status NOT NULL DEFAULT 'active',
  storage_limit_mb INTEGER NOT NULL,
  transcription_limit_minutes INTEGER NOT NULL,
  storage_used_mb NUMERIC(10,2) DEFAULT 0,
  transcription_used_minutes NUMERIC(10,2) DEFAULT 0,
  billing_cycle_start DATE NOT NULL,
  billing_cycle_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id)
);

ALTER TABLE public.parent_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own subscription"
  ON public.parent_subscriptions FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own subscription"
  ON public.parent_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own subscription"
  ON public.parent_subscriptions FOR UPDATE
  USING (auth.uid() = parent_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('family_photos', 'family_photos', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('family_documents', 'family_documents', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('family_audio', 'family_audio', false);

-- Storage policies for family_photos bucket
CREATE POLICY "Parents can view their own photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'family_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can upload their own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'family_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can update their own photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'family_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can delete their own photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'family_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for family_documents bucket
CREATE POLICY "Parents can view their own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'family_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'family_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can delete their own documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'family_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for family_audio bucket
CREATE POLICY "Parents can view their own audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'family_audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can upload their own audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'family_audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Parents can delete their own audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'family_audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to check storage quota
CREATE OR REPLACE FUNCTION public.check_storage_quota(
  p_parent_id UUID,
  p_file_size_bytes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_storage_limit_mb INTEGER;
  v_storage_used_mb NUMERIC;
  v_file_size_mb NUMERIC;
BEGIN
  -- Get subscription limits
  SELECT storage_limit_mb, storage_used_mb
  INTO v_storage_limit_mb, v_storage_used_mb
  FROM parent_subscriptions
  WHERE parent_id = p_parent_id AND status = 'active';
  
  -- If no subscription, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Convert file size to MB
  v_file_size_mb := p_file_size_bytes / 1024.0 / 1024.0;
  
  -- Check if adding this file would exceed limit
  RETURN (v_storage_used_mb + v_file_size_mb) <= v_storage_limit_mb;
END;
$$;

-- Function to check transcription quota
CREATE OR REPLACE FUNCTION public.check_transcription_quota(
  p_parent_id UUID,
  p_duration_minutes NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transcription_limit INTEGER;
  v_transcription_used NUMERIC;
BEGIN
  -- Get subscription limits
  SELECT transcription_limit_minutes, transcription_used_minutes
  INTO v_transcription_limit, v_transcription_used
  FROM parent_subscriptions
  WHERE parent_id = p_parent_id AND status = 'active';
  
  -- If no subscription, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if adding this transcription would exceed limit
  RETURN (v_transcription_used + p_duration_minutes) <= v_transcription_limit;
END;
$$;

-- Function to reset monthly transcription usage (for cron job)
CREATE OR REPLACE FUNCTION public.reset_monthly_transcription_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE parent_subscriptions
  SET 
    transcription_used_minutes = 0,
    billing_cycle_start = billing_cycle_end,
    billing_cycle_end = billing_cycle_end + INTERVAL '1 month'
  WHERE status = 'active' AND billing_cycle_end <= CURRENT_DATE;
END;
$$;

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_stories_updated_at
  BEFORE UPDATE ON public.family_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_photos_updated_at
  BEFORE UPDATE ON public.family_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_history_access_updated_at
  BEFORE UPDATE ON public.family_history_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parent_subscriptions_updated_at
  BEFORE UPDATE ON public.parent_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();