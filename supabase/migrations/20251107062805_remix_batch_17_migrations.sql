
-- Migration: 20251004063512
-- Create child profiles table
CREATE TABLE public.child_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 3 AND age <= 12),
  avatar TEXT DEFAULT '👦',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for child profiles
CREATE POLICY "Parents can view their own children"
  ON public.child_profiles FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create children"
  ON public.child_profiles FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own children"
  ON public.child_profiles FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own children"
  ON public.child_profiles FOR DELETE
  USING (auth.uid() = parent_id);

-- Create child topics table
CREATE TABLE public.child_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(child_id, topic)
);

-- Enable Row Level Security
ALTER TABLE public.child_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for child topics
CREATE POLICY "Parents can view topics for their children"
  ON public.child_topics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = child_topics.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create topics for their children"
  ON public.child_topics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = child_topics.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete topics for their children"
  ON public.child_topics FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = child_topics.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Parents can view messages for their children"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = chat_messages.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

CREATE POLICY "System can create messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251004070019
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

-- Migration: 20251004070512
-- Create badges/achievements table
CREATE TABLE public.child_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type text NOT NULL,
  badge_name text NOT NULL,
  earned_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(child_id, badge_type)
);

-- Enable RLS
ALTER TABLE public.child_badges ENABLE ROW LEVEL SECURITY;

-- Parents can view badges for their children
CREATE POLICY "Parents can view badges for their children"
ON public.child_badges
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM child_profiles
  WHERE child_profiles.id = child_badges.child_id
  AND child_profiles.parent_id = auth.uid()
));

-- System can manage badges
CREATE POLICY "System can manage badges"
ON public.child_badges
FOR ALL
USING (true)
WITH CHECK (true);

-- Add personality mode and story mode to child profiles
ALTER TABLE public.child_profiles
ADD COLUMN personality_mode text DEFAULT 'curious_explorer' NOT NULL,
ADD COLUMN streak_days integer DEFAULT 0 NOT NULL,
ADD COLUMN last_chat_date date;

-- Create stories table
CREATE TABLE public.child_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  prompt text NOT NULL,
  is_favorite boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.child_stories ENABLE ROW LEVEL SECURITY;

-- Parents and children can view stories
CREATE POLICY "Users can view stories for their children"
ON public.child_stories
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM child_profiles
  WHERE child_profiles.id = child_stories.child_id
  AND child_profiles.parent_id = auth.uid()
));

-- System can create stories
CREATE POLICY "System can create stories"
ON public.child_stories
FOR INSERT
WITH CHECK (true);

-- Users can update favorite status
CREATE POLICY "Users can update their stories"
ON public.child_stories
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM child_profiles
  WHERE child_profiles.id = child_stories.child_id
  AND child_profiles.parent_id = auth.uid()
));

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_child_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_message_count integer;
  v_topic_count integer;
  v_story_count integer;
BEGIN
  -- Count total messages
  SELECT COUNT(*) INTO v_message_count
  FROM chat_messages
  WHERE child_id = p_child_id AND role = 'user';
  
  -- Count topics
  SELECT COUNT(*) INTO v_topic_count
  FROM child_topics
  WHERE child_id = p_child_id;
  
  -- Count stories
  SELECT COUNT(*) INTO v_story_count
  FROM child_stories
  WHERE child_id = p_child_id;
  
  -- Award "Curious Beginner" (5 questions)
  IF v_message_count >= 5 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'curious_beginner', 'Curious Beginner 🌱')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Question Master" (25 questions)
  IF v_message_count >= 25 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'question_master', 'Question Master 🎓')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Explorer" (50 questions)
  IF v_message_count >= 50 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'explorer', 'Explorer 🚀')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Topic Collector" (5+ topics)
  IF v_topic_count >= 5 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'topic_collector', 'Topic Collector 📚')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Story Lover" (3+ stories)
  IF v_story_count >= 3 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'story_lover', 'Story Lover 📖')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
END;
$$;

-- Create function to update streak
CREATE OR REPLACE FUNCTION public.update_child_streak(p_child_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_chat_date date;
  v_current_streak integer;
BEGIN
  SELECT last_chat_date, streak_days INTO v_last_chat_date, v_current_streak
  FROM child_profiles
  WHERE id = p_child_id;
  
  IF v_last_chat_date IS NULL THEN
    -- First time chatting
    UPDATE child_profiles
    SET streak_days = 1, last_chat_date = CURRENT_DATE
    WHERE id = p_child_id;
  ELSIF v_last_chat_date = CURRENT_DATE THEN
    -- Already chatted today, do nothing
    RETURN;
  ELSIF v_last_chat_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE child_profiles
    SET streak_days = v_current_streak + 1, last_chat_date = CURRENT_DATE
    WHERE id = p_child_id;
  ELSE
    -- Streak broken, reset to 1
    UPDATE child_profiles
    SET streak_days = 1, last_chat_date = CURRENT_DATE
    WHERE id = p_child_id;
  END IF;
END;
$$;

-- Migration: 20251004071333
-- Add custom avatar support to child_profiles
ALTER TABLE child_profiles
ADD COLUMN IF NOT EXISTS custom_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_expression TEXT DEFAULT 'neutral';

-- Add table for unlockable avatar accessories
CREATE TABLE IF NOT EXISTS avatar_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  accessory_type TEXT NOT NULL, -- 'hat', 'glasses', 'background', etc.
  accessory_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT false,
  UNIQUE(child_id, accessory_type, accessory_id)
);

-- Enable RLS
ALTER TABLE avatar_accessories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for avatar_accessories
CREATE POLICY "Users can view their children's accessories"
  ON avatar_accessories FOR SELECT
  USING (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert accessories for their children"
  ON avatar_accessories FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their children's accessories"
  ON avatar_accessories FOR UPDATE
  USING (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their children's accessories"
  ON avatar_accessories FOR DELETE
  USING (
    child_id IN (
      SELECT id FROM child_profiles WHERE parent_id = auth.uid()
    )
  );

-- Migration: 20251004072429
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

-- Migration: 20251004073335
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

-- Migration: 20251004074256
-- Insert comprehensive topic packs for children
INSERT INTO topic_packs (name, description, emoji, topics) VALUES
('Space & Astronomy', 'Explore the wonders of the universe', '🚀', ARRAY[
  'planets', 'stars', 'galaxies', 'black holes', 'astronauts', 'space stations',
  'moon phases', 'solar system', 'comets', 'asteroids', 'constellations', 'telescopes'
]),
('Animals & Nature', 'Discover amazing creatures and ecosystems', '🦁', ARRAY[
  'mammals', 'birds', 'reptiles', 'insects', 'ocean life', 'endangered species',
  'habitats', 'food chains', 'animal behavior', 'migration', 'camouflage', 'adaptations'
]),
('Science Experiments', 'Learn through fun scientific discoveries', '🔬', ARRAY[
  'chemistry', 'physics', 'magnets', 'electricity', 'light', 'sound',
  'states of matter', 'reactions', 'forces', 'energy', 'simple machines', 'density'
]),
('World Geography', 'Travel the globe and learn about places', '🌍', ARRAY[
  'continents', 'oceans', 'mountains', 'rivers', 'countries', 'capitals',
  'climate zones', 'landmarks', 'cultures', 'languages', 'flags', 'maps'
]),
('History & Civilization', 'Journey through time and ancient cultures', '🏛️', ARRAY[
  'ancient Egypt', 'Romans', 'Vikings', 'castles', 'inventions', 'explorers',
  'ancient Greece', 'Mesopotamia', 'Maya', 'prehistoric times', 'knights', 'pyramids'
]),
('Art & Creativity', 'Express yourself through artistic exploration', '🎨', ARRAY[
  'painting', 'drawing', 'sculpture', 'colors', 'famous artists', 'art styles',
  'pottery', 'origami', 'collage', 'murals', 'perspective', 'art history'
]),
('Music & Sound', 'Discover the world of music and rhythm', '🎵', ARRAY[
  'instruments', 'composers', 'genres', 'rhythms', 'melodies', 'orchestras',
  'singing', 'music theory', 'musical notes', 'bands', 'concerts', 'world music'
]),
('Technology & Innovation', 'Explore how technology shapes our world', '💻', ARRAY[
  'computers', 'robots', 'coding', 'internet', 'apps', 'artificial intelligence',
  'inventions', 'engineering', 'future tech', '3D printing', 'drones', 'virtual reality'
]),
('Human Body', 'Learn about how our bodies work', '🫀', ARRAY[
  'skeleton', 'muscles', 'brain', 'heart', 'lungs', 'digestive system',
  'senses', 'cells', 'blood', 'immune system', 'nervous system', 'organs'
]),
('Plants & Gardens', 'Discover the fascinating world of plants', '🌱', ARRAY[
  'photosynthesis', 'flowers', 'trees', 'seeds', 'roots', 'pollination',
  'vegetables', 'fruits', 'gardening', 'rainforests', 'plant life cycles', 'ecosystems'
]),
('Weather & Climate', 'Understand the forces that shape our weather', '⛅', ARRAY[
  'clouds', 'rain', 'snow', 'wind', 'storms', 'thunder',
  'seasons', 'temperature', 'water cycle', 'hurricanes', 'tornadoes', 'climate change'
]),
('Ocean Life', 'Dive into the mysteries of the sea', '🌊', ARRAY[
  'sharks', 'whales', 'dolphins', 'coral reefs', 'fish', 'octopus',
  'tides', 'ocean zones', 'seahorses', 'jellyfish', 'sea turtles', 'underwater volcanoes'
]),
('Dinosaurs', 'Meet the giants of the prehistoric world', '🦕', ARRAY[
  'T-Rex', 'Triceratops', 'Stegosaurus', 'Velociraptor', 'fossils', 'extinction',
  'herbivores', 'carnivores', 'paleontology', 'Jurassic period', 'dinosaur eggs', 'flying dinosaurs'
]),
('Sports & Games', 'Learn about physical activities and teamwork', '⚽', ARRAY[
  'soccer', 'basketball', 'swimming', 'gymnastics', 'tennis', 'baseball',
  'Olympics', 'teamwork', 'rules', 'famous athletes', 'exercise', 'fair play'
]),
('Math & Numbers', 'Make math fun and exciting', '🔢', ARRAY[
  'counting', 'addition', 'subtraction', 'multiplication', 'division', 'shapes',
  'patterns', 'fractions', 'measurements', 'time', 'money', 'geometry'
]),
('Stories & Literature', 'Explore the magic of reading and writing', '📚', ARRAY[
  'fairy tales', 'fables', 'poetry', 'authors', 'characters', 'plot',
  'writing stories', 'rhymes', 'books', 'libraries', 'imagination', 'storytelling'
]),
('Earth & Environment', 'Learn to care for our planet', '♻️', ARRAY[
  'recycling', 'pollution', 'conservation', 'renewable energy', 'forests', 'water',
  'wildlife protection', 'sustainability', 'climate', 'Earth Day', 'ecosystems', 'natural resources'
]),
('Food & Nutrition', 'Discover healthy eating and where food comes from', '🍎', ARRAY[
  'fruits', 'vegetables', 'grains', 'proteins', 'dairy', 'nutrition',
  'cooking', 'food groups', 'farming', 'healthy eating', 'food chains', 'recipes'
]),
('Transportation', 'Learn about how we travel and move things', '✈️', ARRAY[
  'cars', 'trains', 'planes', 'boats', 'bicycles', 'rockets',
  'buses', 'helicopters', 'submarines', 'hot air balloons', 'motorcycles', 'future transport'
]),
('Cultures & Traditions', 'Celebrate diversity around the world', '🎭', ARRAY[
  'festivals', 'holidays', 'customs', 'clothing', 'celebrations', 'traditions',
  'world cultures', 'languages', 'dance', 'food traditions', 'stories', 'beliefs'
]);


-- Migration: 20251004074622
-- Create custom_topic_packs table for parent-created packs
CREATE TABLE custom_topic_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  emoji text DEFAULT '📚',
  topics text[] NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE custom_topic_packs ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_topic_packs
CREATE POLICY "Parents can view their own custom packs"
  ON custom_topic_packs FOR SELECT
  USING (auth.uid() = parent_id OR is_public = true);

CREATE POLICY "Parents can create their own custom packs"
  ON custom_topic_packs FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own custom packs"
  ON custom_topic_packs FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own custom packs"
  ON custom_topic_packs FOR DELETE
  USING (auth.uid() = parent_id);

-- Create topic_analytics table for tracking topic performance
CREATE TABLE topic_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  message_count integer DEFAULT 0,
  last_used_at timestamptz,
  engagement_score numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(topic, child_id)
);

-- Enable RLS
ALTER TABLE topic_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for topic_analytics
CREATE POLICY "Parents can view analytics for their children"
  ON topic_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM child_profiles
    WHERE child_profiles.id = topic_analytics.child_id
    AND child_profiles.parent_id = auth.uid()
  ));

CREATE POLICY "System can manage topic analytics"
  ON topic_analytics FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create topic_feedback table for parent feedback
CREATE TABLE topic_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, topic)
);

-- Enable RLS
ALTER TABLE topic_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for topic_feedback
CREATE POLICY "Parents can view their own feedback"
  ON topic_feedback FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create their own feedback"
  ON topic_feedback FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own feedback"
  ON topic_feedback FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own feedback"
  ON topic_feedback FOR DELETE
  USING (auth.uid() = parent_id);

-- Add trigger for custom_topic_packs updated_at
CREATE TRIGGER update_custom_topic_packs_updated_at
  BEFORE UPDATE ON custom_topic_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migration: 20251004082502
-- Phase 1: Database Schema for Pre-Written Content System

-- Create topic_content table for pre-written Q&A pairs
CREATE TABLE public.topic_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  age_range TEXT NOT NULL CHECK (age_range IN ('5-7', '8-10', '11-12')),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  keywords TEXT[] NOT NULL DEFAULT '{}',
  is_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_topic_content_topic ON public.topic_content(topic);
CREATE INDEX idx_topic_content_age ON public.topic_content(age_range);
CREATE INDEX idx_topic_content_keywords ON public.topic_content USING GIN(keywords);
CREATE INDEX idx_topic_content_reviewed ON public.topic_content(is_reviewed);

-- Create parent_approved_content table to track parent approvals
CREATE TABLE public.parent_approved_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  content_id UUID NOT NULL REFERENCES public.topic_content(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(parent_id, content_id, child_id)
);

CREATE INDEX idx_parent_approved_parent ON public.parent_approved_content(parent_id);
CREATE INDEX idx_parent_approved_child ON public.parent_approved_content(child_id);

-- Create custom_content table for parent-created Q&A pairs
CREATE TABLE public.custom_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  age_range TEXT NOT NULL CHECK (age_range IN ('5-7', '8-10', '11-12')),
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_custom_content_parent ON public.custom_content(parent_id);
CREATE INDEX idx_custom_content_topic ON public.custom_content(topic);
CREATE INDEX idx_custom_content_child ON public.custom_content(child_id);

-- Enable RLS
ALTER TABLE public.topic_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_approved_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topic_content (pre-written, reviewed content)
CREATE POLICY "Everyone can view reviewed content"
ON public.topic_content
FOR SELECT
USING (is_reviewed = true);

CREATE POLICY "System can manage topic content"
ON public.topic_content
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for parent_approved_content
CREATE POLICY "Parents can view their approvals"
ON public.parent_approved_content
FOR SELECT
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can approve content"
ON public.parent_approved_content
FOR INSERT
WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their approvals"
ON public.parent_approved_content
FOR DELETE
USING (auth.uid() = parent_id);

-- RLS Policies for custom_content
CREATE POLICY "Parents can view their custom content"
ON public.custom_content
FOR SELECT
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create custom content"
ON public.custom_content
FOR INSERT
WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their custom content"
ON public.custom_content
FOR UPDATE
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their custom content"
ON public.custom_content
FOR DELETE
USING (auth.uid() = parent_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_topic_content_updated_at
BEFORE UPDATE ON public.topic_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_content_updated_at
BEFORE UPDATE ON public.custom_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Phase 2: Seed with extensive educational content
-- SPACE TOPIC (100 Q&As across age ranges)

-- Age 5-7: Beginner Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'What is the sun?', 'The Sun is a giant ball of hot, glowing gas! It''s our very own star that gives us light during the day and keeps us warm. Without the Sun, Earth would be cold and dark. The Sun is so big that more than a million Earths could fit inside it!', '5-7', 'beginner', ARRAY['sun', 'star', 'light', 'heat', 'solar system'], true),
('Space', 'Why is the sky blue?', 'The sky looks blue because of tiny particles in the air! When sunlight comes through our atmosphere, these particles scatter the blue light more than other colors. That''s why we see a beautiful blue sky during the day!', '5-7', 'beginner', ARRAY['sky', 'color', 'light', 'atmosphere', 'blue'], true),
('Space', 'What are stars?', 'Stars are giant balls of hot gas that glow and twinkle in the night sky! They''re like tiny suns, but they look small because they''re very, very far away. Each star is actually huge - much bigger than our whole planet Earth!', '5-7', 'beginner', ARRAY['stars', 'night sky', 'gas', 'twinkle', 'distant'], true),
('Space', 'What is the moon?', 'The Moon is Earth''s special friend in space! It''s a big ball of rock that travels around our planet. The Moon doesn''t make its own light - it reflects light from the Sun, which is why it glows at night. Sometimes we see the whole Moon, and sometimes just a part of it!', '5-7', 'beginner', ARRAY['moon', 'earth', 'orbit', 'night', 'reflection'], true),
('Space', 'How many planets are there?', 'There are 8 planets in our solar system! They all travel around the Sun. The planets are: Mercury, Venus, Earth (our home!), Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is special and different!', '5-7', 'beginner', ARRAY['planets', 'solar system', 'eight', 'orbit', 'sun'], true),
('Space', 'What is a rocket?', 'A rocket is a special vehicle that can fly into space! It works by shooting hot gas out of its bottom, which pushes it up very fast - kind of like when you let go of a balloon and the air pushes it around! Rockets carry astronauts and satellites into space.', '5-7', 'beginner', ARRAY['rocket', 'space travel', 'astronaut', 'vehicle', 'launch'], true),
('Space', 'What is Earth?', 'Earth is our home planet! It''s a big round ball floating in space. Earth is special because it has air to breathe, water to drink, and is just the right temperature for plants, animals, and people to live. It''s the only planet we know of that has life!', '5-7', 'beginner', ARRAY['earth', 'planet', 'home', 'life', 'water'], true),
('Space', 'Why do stars twinkle?', 'Stars twinkle because their light has to travel through our atmosphere to reach us! The moving air makes the starlight wiggle and shimmer, just like how things look wobbly when you see them through water. The stars aren''t actually twinkling - it''s our air playing tricks on the light!', '5-7', 'beginner', ARRAY['stars', 'twinkle', 'atmosphere', 'light', 'air'], true),
('Space', 'What is an astronaut?', 'An astronaut is a person who travels to space! They wear special suits to protect them and help them breathe in space. Astronauts float around in space because there''s no gravity pulling them down. They do important science experiments and help us learn about space!', '5-7', 'beginner', ARRAY['astronaut', 'space travel', 'spacesuit', 'float', 'science'], true),
('Space', 'Why does the Moon change shape?', 'The Moon doesn''t actually change shape - we just see different parts of it! The Sun lights up one half of the Moon, and as the Moon travels around Earth, we see different amounts of that lit-up part. That''s why sometimes we see a full circle and sometimes just a crescent!', '5-7', 'beginner', ARRAY['moon', 'phases', 'light', 'crescent', 'full moon'], true);

-- Age 5-7: Intermediate Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'How far away is the Moon?', 'The Moon is about 384,000 kilometers away from Earth! That''s like going around the Earth almost 10 times. Even though that sounds really far, it''s actually the closest thing to us in space. It would take about 3 days to fly there in a rocket!', '5-7', 'intermediate', ARRAY['moon', 'distance', 'earth', 'kilometers', 'travel'], true),
('Space', 'What is a shooting star?', 'A shooting star isn''t actually a star at all! It''s a tiny piece of space rock or dust that burns up when it enters Earth''s atmosphere. As it burns, it creates a bright streak of light that we see for just a second or two. Real stars don''t move like that!', '5-7', 'intermediate', ARRAY['meteor', 'shooting star', 'atmosphere', 'space rock', 'light'], true),
('Space', 'Why is space dark?', 'Space is dark because there''s no air in space! On Earth, our atmosphere scatters sunlight and makes our sky bright blue. But in space, there''s nothing to scatter the light, so even when the Sun is shining, the space around it stays black. Astronauts can see stars even in daytime!', '5-7', 'intermediate', ARRAY['space', 'dark', 'atmosphere', 'light', 'vacuum'], true),
('Space', 'What is gravity?', 'Gravity is like an invisible force that pulls things together! It''s what keeps you on the ground and stops you from floating away. Bigger objects have stronger gravity - that''s why the Earth pulls you down, and why planets orbit around the Sun. Everything has gravity!', '5-7', 'intermediate', ARRAY['gravity', 'force', 'pull', 'earth', 'orbit'], true),
('Space', 'How big is Earth?', 'Earth is really big! It''s about 12,742 kilometers across - that''s the same as driving a car for over 150 hours without stopping! If you could walk all the way around Earth''s middle (the equator), it would take about 3 years of non-stop walking. But compared to the Sun, Earth is actually quite small!', '5-7', 'intermediate', ARRAY['earth', 'size', 'planet', 'diameter', 'big'], true);

-- Age 8-10: Beginner Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'What is the solar system?', 'The solar system is our cosmic neighborhood! It includes the Sun at the center, 8 planets (including Earth), their moons, asteroids, comets, and lots of space dust. Everything in the solar system orbits around the Sun because of its powerful gravity. Our solar system is just one of billions in our galaxy!', '8-10', 'beginner', ARRAY['solar system', 'sun', 'planets', 'orbit', 'galaxy'], true),
('Space', 'What is a galaxy?', 'A galaxy is a huge collection of stars, planets, gas, and dust all held together by gravity! Our galaxy is called the Milky Way, and it contains over 100 billion stars! Galaxies come in different shapes - some are spirals (like ours), some are elliptical, and some are irregular. There are billions of galaxies in the universe!', '8-10', 'beginner', ARRAY['galaxy', 'milky way', 'stars', 'universe', 'spiral'], true),
('Space', 'What is a black hole?', 'A black hole is a place in space where gravity is so strong that nothing can escape - not even light! Black holes form when massive stars collapse at the end of their lives. Because light can''t escape, we can''t see black holes directly, but we can see how they affect things around them. Don''t worry - the nearest black hole is very far from Earth!', '8-10', 'beginner', ARRAY['black hole', 'gravity', 'light', 'star', 'collapse'], true),
('Space', 'What is the International Space Station?', 'The International Space Station (ISS) is a giant laboratory floating in space! It''s about the size of a football field and orbits Earth every 90 minutes. Astronauts from different countries live and work there, conducting experiments that help us understand space and improve life on Earth. You can sometimes see the ISS passing overhead as a bright moving star!', '8-10', 'beginner', ARRAY['ISS', 'space station', 'orbit', 'astronaut', 'laboratory'], true),
('Space', 'Why do astronauts float in space?', 'Astronauts float in space because they''re in a state called microgravity! This doesn''t mean there''s no gravity - actually, the ISS experiences about 90% of Earth''s gravity. But because the ISS is constantly falling toward Earth while also moving forward, everything inside feels weightless. It''s like being on a never-ending roller coaster drop!', '8-10', 'beginner', ARRAY['astronaut', 'float', 'microgravity', 'weightless', 'ISS'], true);

-- Age 8-10: Intermediate Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'How do rockets work?', 'Rockets work using Newton''s Third Law: for every action, there''s an equal and opposite reaction! Rockets burn fuel to create hot exhaust gases. As these gases shoot out of the bottom at incredible speeds, they push the rocket upward with tremendous force. The faster the gases go out, the faster the rocket goes up! Modern rockets need to reach speeds of about 28,000 km/h to escape Earth''s gravity.', '8-10', 'intermediate', ARRAY['rocket', 'thrust', 'fuel', 'Newton', 'propulsion'], true),
('Space', 'What is a light-year?', 'A light-year is the distance light travels in one year! Since light moves at about 300,000 kilometers per second (super fast!), one light-year equals about 9.5 trillion kilometers. We use light-years to measure distances in space because space is so big that regular kilometers would give us numbers too huge to write! For example, the nearest star (besides our Sun) is about 4.2 light-years away.', '8-10', 'intermediate', ARRAY['light-year', 'distance', 'speed of light', 'measurement', 'space'], true),
('Space', 'What causes the seasons?', 'Seasons happen because Earth is tilted on its axis by about 23.5 degrees! As Earth orbits the Sun, different parts tilt toward or away from the Sun. When your part of Earth tilts toward the Sun, you get summer (more direct sunlight and longer days). When it tilts away, you get winter (less direct sunlight and shorter days). It''s not about how close we are to the Sun - it''s all about the tilt!', '8-10', 'intermediate', ARRAY['seasons', 'earth tilt', 'orbit', 'summer', 'winter'], true),
('Space', 'What are auroras?', 'Auroras (Northern and Southern Lights) are beautiful light displays in the sky caused by solar wind! The Sun constantly sends out charged particles, and when these particles hit Earth''s magnetic field, they get directed toward the poles. There, they collide with gases in our atmosphere, creating glowing curtains of green, red, and purple light. They''re most visible near the Arctic and Antarctic!', '8-10', 'intermediate', ARRAY['aurora', 'northern lights', 'solar wind', 'magnetic field', 'atmosphere'], true),
('Space', 'Could humans live on Mars?', 'Living on Mars would be extremely challenging but not impossible! Mars has about 38% of Earth''s gravity, temperatures averaging -60°C, very little atmosphere, and no magnetic field to protect from radiation. Humans would need sealed habitats, spacesuits for outdoor activities, and ways to produce oxygen, water, and food. Scientists are working on technologies to make Mars colonization possible in the future!', '8-10', 'intermediate', ARRAY['Mars', 'colonization', 'habitat', 'atmosphere', 'survival'], true);

-- Age 8-10: Advanced Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'What is dark matter?', 'Dark matter is mysterious invisible material that makes up about 27% of the universe! We can''t see it or detect it directly, but we know it exists because we can see its gravitational effects on galaxies and galaxy clusters. Galaxies spin so fast that they should fly apart, but dark matter''s gravity holds them together. Scientists are still trying to figure out exactly what dark matter is made of!', '8-10', 'advanced', ARRAY['dark matter', 'gravity', 'invisible', 'galaxy', 'universe'], true),
('Space', 'What is a supernova?', 'A supernova is the spectacular explosion of a massive star at the end of its life! When a star at least 8 times the mass of our Sun runs out of fuel, its core collapses in less than a second, then rebounds in a massive explosion. For a few weeks, a single supernova can outshine an entire galaxy! The explosion scatters elements like iron, gold, and carbon across space - elements that eventually form new planets and even living things!', '8-10', 'advanced', ARRAY['supernova', 'explosion', 'star death', 'elements', 'brightness'], true),
('Space', 'What is the Big Bang?', 'The Big Bang is the theory that explains how our universe began about 13.8 billion years ago! At that moment, all the matter and energy in the universe was compressed into an incredibly tiny, hot, dense point. Then it started expanding rapidly, and it''s still expanding today! As it expanded and cooled, particles formed, then atoms, then stars and galaxies. Evidence for the Big Bang includes the cosmic microwave background radiation and the fact that galaxies are moving away from each other.', '8-10', 'advanced', ARRAY['Big Bang', 'universe origin', 'expansion', 'cosmic background', 'theory'], true);

-- Age 11-12: Beginner Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'What is spacetime?', 'Spacetime is the combination of the three dimensions of space and the dimension of time into a single four-dimensional fabric! Einstein''s theory of relativity showed us that space and time aren''t separate - they''re interconnected. Massive objects like stars and planets actually bend spacetime around them, which is what we experience as gravity. Imagine spacetime like a stretched rubber sheet - a heavy ball (like a star) creates a dip, and smaller objects roll toward it!', '11-12', 'beginner', ARRAY['spacetime', 'Einstein', 'relativity', 'dimension', 'gravity'], true),
('Space', 'What are exoplanets?', 'Exoplanets are planets that orbit stars outside our solar system! Scientists have discovered over 5,000 exoplanets so far, and they come in all sizes - from smaller than Earth to bigger than Jupiter. Some orbit in the "habitable zone" where temperatures might allow liquid water. We find exoplanets by detecting tiny dips in a star''s brightness when a planet passes in front of it, or by measuring the wobble a planet''s gravity causes in its star.', '11-12', 'beginner', ARRAY['exoplanet', 'planets', 'habitable zone', 'detection', 'stars'], true),
('Space', 'What is a neutron star?', 'A neutron star is the incredibly dense remnant left after a supernova explosion! When a massive star explodes, its core collapses so much that protons and electrons are crushed together to form neutrons. A neutron star is typically only about 20 kilometers across but has more mass than our Sun! A teaspoon of neutron star material would weigh about 6 billion tons on Earth. Some neutron stars spin hundreds of times per second!', '11-12', 'beginner', ARRAY['neutron star', 'density', 'supernova', 'collapse', 'mass'], true);

-- Age 11-12: Intermediate Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'How do we detect gravitational waves?', 'Gravitational waves are ripples in spacetime caused by massive cosmic events like colliding black holes! We detect them using incredibly sensitive instruments called interferometers (like LIGO). These instruments use lasers to measure distance changes smaller than the width of a proton! When a gravitational wave passes through, it slightly stretches space in one direction and compresses it in another. The first detection in 2015 confirmed a major prediction of Einstein''s theory of relativity!', '11-12', 'intermediate', ARRAY['gravitational waves', 'LIGO', 'black holes', 'detection', 'spacetime'], true),
('Space', 'What is the multiverse theory?', 'The multiverse theory suggests that our universe might be just one of many universes that exist! There are several versions of this theory. One suggests that the universe is infinite and contains regions beyond our observable universe. Another comes from quantum mechanics, where every possible outcome of events creates a new branching universe. While fascinating, the multiverse remains theoretical because we currently have no way to detect or interact with other universes.', '11-12', 'intermediate', ARRAY['multiverse', 'theory', 'universe', 'quantum', 'parallel'], true),
('Space', 'How do we know the universe is expanding?', 'We know the universe is expanding because of redshift! When light from distant galaxies travels through expanding space, its wavelength gets stretched, making it appear redder. Edwin Hubble discovered in 1929 that the farther away a galaxy is, the faster it''s moving away from us. This relationship (Hubble''s Law) proves the universe is expanding. Additionally, the cosmic microwave background radiation is stretched and cooled by this expansion, providing more evidence!', '11-12', 'intermediate', ARRAY['expansion', 'redshift', 'Hubble', 'universe', 'cosmology'], true);

-- Age 11-12: Advanced Space Questions
INSERT INTO public.topic_content (topic, question, answer, age_range, difficulty_level, keywords, is_reviewed) VALUES
('Space', 'What is quantum entanglement?', 'Quantum entanglement is a phenomenon where two particles become connected in such a way that the quantum state of one instantly affects the other, regardless of distance! Einstein called it "spooky action at a distance." When you measure one entangled particle, you instantly know something about the other, even if it''s on the other side of the universe. This doesn''t violate the speed of light because no information actually travels - the correlation exists from the moment of entanglement. Scientists are exploring using entanglement for quantum computers and secure communication!', '11-12', 'advanced', ARRAY['quantum entanglement', 'particles', 'quantum mechanics', 'correlation', 'Einstein'], true),
('Space', 'What is the event horizon of a black hole?', 'The event horizon is the boundary around a black hole beyond which nothing can escape, not even light! It''s not a physical surface but rather a mathematical boundary defined by the point of no return. The size of the event horizon depends on the black hole''s mass - for a black hole with the mass of our Sun, it would be about 3 kilometers in radius. According to general relativity, time appears to slow down near the event horizon from an outside observer''s perspective. Once something crosses the event horizon, it''s inevitably pulled toward the singularity at the center.', '11-12', 'advanced', ARRAY['event horizon', 'black hole', 'escape velocity', 'relativity', 'singularity'], true),
('Space', 'What is dark energy?', 'Dark energy is the mysterious force causing the universe''s expansion to accelerate! It makes up about 68% of the universe, yet we don''t know what it is. In the 1990s, scientists discovered that distant supernovae were dimmer than expected, meaning the universe isn''t just expanding - it''s expanding faster and faster! Dark energy seems to be a property of space itself, and as space expands, more dark energy comes into existence. Understanding dark energy is one of the biggest challenges in modern physics!', '11-12', 'advanced', ARRAY['dark energy', 'expansion', 'acceleration', 'cosmology', 'universe'], true);

-- Additional comprehensive content will be added in subsequent data loads
-- This provides initial foundation across all age ranges and difficulty levels;

-- Migration: 20251004091630
-- Enhance child_stories table with new fields for Story Buddy
ALTER TABLE child_stories
ADD COLUMN IF NOT EXISTS theme text,
ADD COLUMN IF NOT EXISTS mood text,
ADD COLUMN IF NOT EXISTS values text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS characters jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS narration_voice text DEFAULT 'alloy',
ADD COLUMN IF NOT EXISTS illustration_style text DEFAULT 'cartoon',
ADD COLUMN IF NOT EXISTS audio_url text,
ADD COLUMN IF NOT EXISTS audio_content text,
ADD COLUMN IF NOT EXISTS illustrations jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS parent_intro_url text,
ADD COLUMN IF NOT EXISTS duration_seconds integer,
ADD COLUMN IF NOT EXISTS bedtime_ready boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS story_length text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS scenes jsonb DEFAULT '[]';

-- Create story_themes table for predefined themes
CREATE TABLE IF NOT EXISTS story_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  description text NOT NULL,
  age_appropriate text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE story_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Story themes are viewable by everyone"
ON story_themes FOR SELECT
USING (true);

-- Create story_usage table for tier enforcement
CREATE TABLE IF NOT EXISTS story_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL, -- format: YYYY-MM
  story_count integer DEFAULT 0,
  tier text DEFAULT 'free',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(parent_id, month)
);

ALTER TABLE story_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own usage"
ON story_usage FOR SELECT
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own usage"
ON story_usage FOR UPDATE
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own usage"
ON story_usage FOR INSERT
WITH CHECK (auth.uid() = parent_id);

-- Insert predefined story themes
INSERT INTO story_themes (name, emoji, description, age_appropriate) VALUES
('Space', '🚀', 'Adventures among the stars and planets', ARRAY['5-7', '8-10', '11-12']),
('Dinosaurs', '🦕', 'Journey back to the time of dinosaurs', ARRAY['5-7', '8-10', '11-12']),
('Animals', '🦁', 'Stories about amazing creatures', ARRAY['5-7', '8-10', '11-12']),
('Friendship', '🤝', 'Tales about making and keeping friends', ARRAY['5-7', '8-10', '11-12']),
('Adventure', '⛰️', 'Exciting quests and explorations', ARRAY['5-7', '8-10', '11-12']),
('Nature', '🌳', 'Discover the wonders of the natural world', ARRAY['5-7', '8-10', '11-12']),
('Ocean', '🌊', 'Dive into underwater adventures', ARRAY['5-7', '8-10', '11-12']),
('Magic', '✨', 'Enchanted worlds and magical creatures', ARRAY['5-7', '8-10', '11-12'])
ON CONFLICT DO NOTHING;

-- Add trigger for story_usage updated_at
CREATE TRIGGER update_story_usage_updated_at
BEFORE UPDATE ON story_usage
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Migration: 20251004101834
-- Add DELETE policy for child_stories table so parents can delete their children's stories
CREATE POLICY "Users can delete their children's stories"
ON public.child_stories
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM child_profiles
    WHERE child_profiles.id = child_stories.child_id
    AND child_profiles.parent_id = auth.uid()
  )
);

-- Migration: 20251004104206
-- Create goal_journeys table
CREATE TABLE public.goal_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('habit', 'milestone', 'skill')),
  duration_days INTEGER NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  reward_type TEXT NOT NULL CHECK (reward_type IN ('story_reinforcement', 'badge', 'custom')),
  reward_details JSONB DEFAULT '{}',
  mission_schedule_time TIME,
  allow_sharing BOOLEAN DEFAULT false,
  journey_category TEXT NOT NULL CHECK (journey_category IN ('social', 'academic', 'health', 'creativity', 'routine')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create journey_steps table
CREATE TABLE public.journey_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.goal_journeys(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey_templates table
CREATE TABLE public.journey_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('social', 'academic', 'health', 'creativity', 'routine')),
  age_range TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  steps_template JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_positive_habit BOOLEAN NOT NULL DEFAULT true,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating NUMERIC,
  download_count INTEGER NOT NULL DEFAULT 0,
  community_shares_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey_progress_log table
CREATE TABLE public.journey_progress_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.goal_journeys(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.journey_steps(id) ON DELETE CASCADE,
  child_id UUID NOT NULL,
  completed BOOLEAN NOT NULL,
  buddy_message TEXT,
  parent_reflection_prompt TEXT,
  child_reflection TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create journey_shares table
CREATE TABLE public.journey_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.goal_journeys(id) ON DELETE CASCADE,
  shared_by_parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  privacy_level TEXT NOT NULL DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends_only')),
  download_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.goal_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_progress_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goal_journeys
CREATE POLICY "Parents can create their own journeys"
  ON public.goal_journeys
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can view their own journeys"
  ON public.goal_journeys
  FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own journeys"
  ON public.goal_journeys
  FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their own journeys"
  ON public.goal_journeys
  FOR DELETE
  USING (auth.uid() = parent_id);

-- RLS Policies for journey_steps
CREATE POLICY "Parents can view steps for their journeys"
  ON public.journey_steps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.goal_journeys
      WHERE goal_journeys.id = journey_steps.journey_id
      AND goal_journeys.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create steps for their journeys"
  ON public.journey_steps
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.goal_journeys
      WHERE goal_journeys.id = journey_steps.journey_id
      AND goal_journeys.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update steps for their journeys"
  ON public.journey_steps
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.goal_journeys
      WHERE goal_journeys.id = journey_steps.journey_id
      AND goal_journeys.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can delete steps for their journeys"
  ON public.journey_steps
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.goal_journeys
      WHERE goal_journeys.id = journey_steps.journey_id
      AND goal_journeys.parent_id = auth.uid()
    )
  );

CREATE POLICY "System can manage steps"
  ON public.journey_steps
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for journey_templates
CREATE POLICY "Everyone can view public templates"
  ON public.journey_templates
  FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create their own templates"
  ON public.journey_templates
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own templates"
  ON public.journey_templates
  FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own templates"
  ON public.journey_templates
  FOR DELETE
  USING (auth.uid() = creator_id);

CREATE POLICY "System can manage templates"
  ON public.journey_templates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for journey_progress_log
CREATE POLICY "Parents can view progress for their children"
  ON public.journey_progress_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = journey_progress_log.child_id
      AND child_profiles.parent_id = auth.uid()
    )
  );

CREATE POLICY "System can manage progress logs"
  ON public.journey_progress_log
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for journey_shares
CREATE POLICY "Everyone can view public shares"
  ON public.journey_shares
  FOR SELECT
  USING (privacy_level = 'public' OR shared_by_parent_id = auth.uid());

CREATE POLICY "Parents can share their journeys"
  ON public.journey_shares
  FOR INSERT
  WITH CHECK (auth.uid() = shared_by_parent_id);

CREATE POLICY "Parents can update their shares"
  ON public.journey_shares
  FOR UPDATE
  USING (auth.uid() = shared_by_parent_id);

CREATE POLICY "Parents can delete their shares"
  ON public.journey_shares
  FOR DELETE
  USING (auth.uid() = shared_by_parent_id);

-- Create trigger for updated_at
CREATE TRIGGER update_goal_journeys_updated_at
  BEFORE UPDATE ON public.goal_journeys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journey_templates_updated_at
  BEFORE UPDATE ON public.journey_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial journey templates
INSERT INTO public.journey_templates (name, emoji, description, category, age_range, duration_days, steps_template, is_public, creator_id) VALUES
('30 Days of Kindness', '💝', 'Build a habit of daily acts of kindness with age-appropriate missions that teach empathy and compassion.', 'social', '5-12', 30, '[
  {"step": 1, "title": "Share a toy with a friend", "description": "Pick one of your favorite toys and let a friend play with it today."},
  {"step": 2, "title": "Say something nice", "description": "Tell someone in your family something you like about them."},
  {"step": 3, "title": "Help with a chore", "description": "Ask a grown-up if you can help with something today."},
  {"step": 4, "title": "Make someone smile", "description": "Do something silly or kind to make someone laugh or smile."},
  {"step": 5, "title": "Give a hug", "description": "Give someone you love a big, warm hug."}
]'::jsonb, true, NULL),

('100 Steps to Reading', '📚', 'Develop a daily reading habit with fun, short reading missions that grow your child''s love of books.', 'academic', '6-10', 100, '[
  {"step": 1, "title": "Read for 5 minutes", "description": "Pick any book you like and read for just 5 minutes."},
  {"step": 2, "title": "Read a picture book", "description": "Choose a book with pictures and read the whole story."},
  {"step": 3, "title": "Read aloud to someone", "description": "Read a page or two out loud to a family member."},
  {"step": 4, "title": "Find a new book", "description": "Go to the library or bookshelf and pick a book you haven''t read yet."},
  {"step": 5, "title": "Read before bed", "description": "Read for 5 minutes right before bedtime tonight."}
]'::jsonb, true, NULL),

('Daily Math Adventures', '🔢', 'Make math fun with daily practice missions that build confidence and skills through play.', 'academic', '7-11', 30, '[
  {"step": 1, "title": "Count to 20", "description": "Count out loud from 1 to 20 as fast as you can!"},
  {"step": 2, "title": "Find shapes", "description": "Look around and find 5 different shapes (circle, square, triangle, etc.)."},
  {"step": 3, "title": "Add with fingers", "description": "Use your fingers to solve: 3 + 4 = ?"},
  {"step": 4, "title": "Measure something", "description": "Use a ruler to measure how long your hand is."},
  {"step": 5, "title": "Math in real life", "description": "Count how many steps it takes to walk from your room to the kitchen."}
]'::jsonb, true, NULL),

('Morning Routine Master', '🌅', 'Build a consistent morning routine with step-by-step habits that set a positive tone for the day.', 'routine', '5-10', 21, '[
  {"step": 1, "title": "Make your bed", "description": "Pull up your blanket and arrange your pillow when you wake up."},
  {"step": 2, "title": "Brush your teeth", "description": "Brush your teeth for 2 minutes after breakfast."},
  {"step": 3, "title": "Get dressed", "description": "Pick out your clothes and get dressed without help."},
  {"step": 4, "title": "Eat a healthy breakfast", "description": "Sit down and eat a good breakfast to start your day."},
  {"step": 5, "title": "Say good morning", "description": "Give everyone in your family a cheerful good morning greeting."}
]'::jsonb, true, NULL),

('Creative Explorer', '🎨', 'Spark creativity with daily artistic missions that encourage self-expression and imagination.', 'creativity', '5-12', 30, '[
  {"step": 1, "title": "Draw a picture", "description": "Draw anything you want for 10 minutes today."},
  {"step": 2, "title": "Make up a story", "description": "Tell someone a made-up story about an adventure."},
  {"step": 3, "title": "Build something", "description": "Use blocks, Legos, or anything else to build something cool."},
  {"step": 4, "title": "Dance or move", "description": "Put on music and dance or move your body in a fun way."},
  {"step": 5, "title": "Create with nature", "description": "Go outside and make art with sticks, leaves, or rocks."}
]'::jsonb, true, NULL),

('Healthy Habits Hero', '💪', 'Develop healthy daily habits with fun missions focused on physical activity, hygiene, and self-care.', 'health', '5-10', 30, '[
  {"step": 1, "title": "Drink a glass of water", "description": "Drink a full glass of water when you wake up."},
  {"step": 2, "title": "Play outside for 15 minutes", "description": "Go outside and run, jump, or play for at least 15 minutes."},
  {"step": 3, "title": "Wash your hands", "description": "Wash your hands with soap before eating."},
  {"step": 4, "title": "Stretch your body", "description": "Do 5 big stretches to wake up your muscles."},
  {"step": 5, "title": "Sleep on time", "description": "Get ready for bed when it''s bedtime, no delays!"}
]'::jsonb, true, NULL);

-- Add index for child_id foreign key reference
CREATE INDEX idx_goal_journeys_child_id ON public.goal_journeys(child_id);
CREATE INDEX idx_journey_progress_log_child_id ON public.journey_progress_log(child_id);

-- Add indexes for performance
CREATE INDEX idx_journey_steps_journey_id ON public.journey_steps(journey_id);
CREATE INDEX idx_journey_progress_log_journey_id ON public.journey_progress_log(journey_id);
CREATE INDEX idx_journey_shares_journey_id ON public.journey_shares(journey_id);
CREATE INDEX idx_journey_templates_category ON public.journey_templates(category);
CREATE INDEX idx_journey_templates_age_range ON public.journey_templates(age_range);

-- Migration: 20251004105149
-- Add new journey-related badge types
INSERT INTO child_badges (child_id, badge_type, badge_name, earned_at)
SELECT DISTINCT 
  gj.child_id,
  'journey_starter' as badge_type,
  'Journey Starter 🌱' as badge_name,
  gj.created_at as earned_at
FROM goal_journeys gj
WHERE NOT EXISTS (
  SELECT 1 FROM child_badges cb 
  WHERE cb.child_id = gj.child_id 
  AND cb.badge_type = 'journey_starter'
)
ON CONFLICT (child_id, badge_type) DO NOTHING;

-- Function to auto-award journey badges
CREATE OR REPLACE FUNCTION public.check_and_award_journey_badges(p_child_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_journey_count integer;
  v_completed_journeys integer;
  v_total_steps_completed integer;
BEGIN
  -- Count total journeys started
  SELECT COUNT(*) INTO v_journey_count
  FROM goal_journeys
  WHERE child_id = p_child_id;
  
  -- Count completed journeys
  SELECT COUNT(*) INTO v_completed_journeys
  FROM goal_journeys
  WHERE child_id = p_child_id AND status = 'completed';
  
  -- Count total completed steps
  SELECT COUNT(*) INTO v_total_steps_completed
  FROM journey_steps js
  JOIN goal_journeys gj ON js.journey_id = gj.id
  WHERE gj.child_id = p_child_id AND js.is_completed = true;
  
  -- Award "Journey Starter" (started first journey)
  IF v_journey_count >= 1 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'journey_starter', 'Journey Starter 🌱')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Habit Hero" (7 consecutive days / 7 completed steps)
  IF v_total_steps_completed >= 7 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'habit_hero', 'Habit Hero 🦸')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Goal Getter" (completed first 30-day journey)
  IF v_completed_journeys >= 1 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'goal_getter', 'Goal Getter ⭐')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Milestone Master" (completed 100+ steps total)
  IF v_total_steps_completed >= 100 THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'milestone_master', 'Milestone Master 🏆')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Kindness Champion" (completed social category journey)
  IF EXISTS (
    SELECT 1 FROM goal_journeys 
    WHERE child_id = p_child_id 
    AND journey_category = 'social' 
    AND status = 'completed'
  ) THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'kindness_champion', 'Kindness Champion 💝')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
  
  -- Award "Math Wizard" (completed academic category journey)
  IF EXISTS (
    SELECT 1 FROM goal_journeys 
    WHERE child_id = p_child_id 
    AND journey_category = 'academic' 
    AND status = 'completed'
  ) THEN
    INSERT INTO child_badges (child_id, badge_type, badge_name)
    VALUES (p_child_id, 'math_wizard', 'Math Wizard 🔢')
    ON CONFLICT (child_id, badge_type) DO NOTHING;
  END IF;
END;
$function$;

-- Migration: 20251005012523
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

-- Migration: 20251005043708
-- Create avatar library table for pre-generated Pixar-style characters
CREATE TABLE avatar_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_name TEXT NOT NULL UNIQUE,
  character_slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('animal', 'fantasy', 'everyday')),
  description TEXT,
  
  -- Avatar URLs for different expressions (base64 data URLs)
  avatar_neutral TEXT NOT NULL,
  avatar_happy TEXT NOT NULL,
  avatar_thinking TEXT NOT NULL,
  avatar_excited TEXT NOT NULL,
  
  -- Metadata for theming
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE avatar_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avatar library is viewable by everyone"
  ON avatar_library FOR SELECT
  USING (true);

-- Update child_profiles to reference avatar library
ALTER TABLE child_profiles 
  ADD COLUMN avatar_library_id UUID REFERENCES avatar_library(id),
  ADD COLUMN use_library_avatar BOOLEAN DEFAULT false;

-- Create UI icons table for custom Pixar-style icons
CREATE TABLE ui_icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL UNIQUE,
  icon_slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  
  -- Icon variations (base64 data URLs)
  icon_primary TEXT NOT NULL,
  icon_secondary TEXT,
  icon_gradient TEXT,
  
  -- Metadata
  size_px INTEGER DEFAULT 256,
  has_animation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE ui_icons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "UI icons are viewable by everyone"
  ON ui_icons FOR SELECT
  USING (true);

-- Update avatar_accessories with image URLs and positioning
ALTER TABLE avatar_accessories
  ADD COLUMN image_url TEXT,
  ADD COLUMN position_x INTEGER DEFAULT 0,
  ADD COLUMN position_y INTEGER DEFAULT 0;

-- Migration: 20251006063155
-- Add position columns to family_members for persistent tree layout
ALTER TABLE family_members
ADD COLUMN tree_position_x integer,
ADD COLUMN tree_position_y integer;

-- Migration: 20251006082043
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
