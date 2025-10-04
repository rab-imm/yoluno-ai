-- Create topic packs table for pre-made content collections
CREATE TABLE public.topic_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  emoji text NOT NULL,
  topics text[] NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.topic_packs ENABLE ROW LEVEL SECURITY;

-- Everyone can view topic packs
CREATE POLICY "Topic packs are viewable by everyone"
ON public.topic_packs
FOR SELECT
USING (true);

-- Insert pre-made content packs
INSERT INTO public.topic_packs (name, description, emoji, topics) VALUES
  ('STEM Starter', 'Space, Science, Math, and Technology basics', '🔬', ARRAY['Space', 'Science', 'Math', 'Technology', 'Robots']),
  ('Islamic Learning', 'Quran Stories, Islamic History, and Arabic', '🕌', ARRAY['Quran Stories', 'Islamic History', 'Prophets', 'Arabic Language', 'Islamic Values']),
  ('Christian Learning', 'Bible Stories, Parables, and Christian Values', '✝️', ARRAY['Bible Stories', 'Parables', 'Christian History', 'Prayer', 'Christian Values']),
  ('Creative Arts', 'Art, Music, Drawing, and Creative Expression', '🎨', ARRAY['Art', 'Music', 'Drawing', 'Painting', 'Crafts', 'Dancing']),
  ('World Cultures', 'Geography, Languages, and Global Traditions', '🌍', ARRAY['Geography', 'Languages', 'World History', 'Cultures', 'Traditions']),
  ('Nature Explorer', 'Animals, Plants, Environment, and Earth Science', '🌿', ARRAY['Animals', 'Plants', 'Ocean Life', 'Dinosaurs', 'Weather', 'Environment']),
  ('Young Inventor', 'Engineering, Building, Problem Solving', '🔧', ARRAY['Engineering', 'Building', 'Inventions', 'How Things Work', 'Problem Solving']),
  ('Story Time', 'Stories, Books, Reading, and Writing', '📚', ARRAY['Stories', 'Books', 'Writing', 'Poetry', 'Fairy Tales', 'Mythology']);

-- Add conversation stats table for parent insights
CREATE TABLE public.conversation_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  topic text NOT NULL,
  message_count integer DEFAULT 1 NOT NULL,
  last_message_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(child_id, topic)
);

-- Enable RLS
ALTER TABLE public.conversation_stats ENABLE ROW LEVEL SECURITY;

-- Parents can view stats for their children
CREATE POLICY "Parents can view stats for their children"
ON public.conversation_stats
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM child_profiles
  WHERE child_profiles.id = conversation_stats.child_id
  AND child_profiles.parent_id = auth.uid()
));

-- System can create/update stats
CREATE POLICY "System can manage stats"
ON public.conversation_stats
FOR ALL
USING (true)
WITH CHECK (true);