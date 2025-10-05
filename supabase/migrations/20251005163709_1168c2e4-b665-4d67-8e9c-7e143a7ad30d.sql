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