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