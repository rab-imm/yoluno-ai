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