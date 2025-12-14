-- Add illustration_url column to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS illustration_url text;

-- Create storage bucket for story illustrations (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-illustrations', 'story-illustrations', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (ignore errors)
DROP POLICY IF EXISTS "Public read access for story illustrations" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload story illustrations" ON storage.objects;
DROP POLICY IF EXISTS "Service role can manage story illustrations" ON storage.objects;

-- Allow public read access to story illustrations
CREATE POLICY "Public read access for story illustrations"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-illustrations');

-- Allow authenticated users to upload story illustrations
CREATE POLICY "Authenticated users can upload story illustrations"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'story-illustrations' AND auth.role() = 'authenticated');

-- Allow service role to manage story illustrations
CREATE POLICY "Service role can manage story illustrations"
ON storage.objects FOR ALL
USING (bucket_id = 'story-illustrations')
WITH CHECK (bucket_id = 'story-illustrations');
