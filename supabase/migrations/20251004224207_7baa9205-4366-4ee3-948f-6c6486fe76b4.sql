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