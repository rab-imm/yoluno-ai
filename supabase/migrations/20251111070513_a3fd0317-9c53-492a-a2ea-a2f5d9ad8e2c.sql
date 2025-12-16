-- Phase 1 & 2: Create storage bucket and pre-seed avatar library

-- Create public storage bucket for avatar images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatar_images',
  'avatar_images',
  true,
  5242880, -- 5MB limit per file
  ARRAY['image/png', 'image/jpeg', 'image/webp']
);

-- Create RLS policies for avatar_images bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatar_images');

CREATE POLICY "Service role can upload avatar images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatar_images' 
  AND auth.role() = 'service_role'
);

CREATE POLICY "Service role can update avatar images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatar_images' 
  AND auth.role() = 'service_role'
);

CREATE POLICY "Service role can delete avatar images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatar_images' 
  AND auth.role() = 'service_role'
);

-- Pre-seed avatar library with placeholder URLs (will be replaced by actual images)
-- This eliminates the 10-15 minute wait for new users
INSERT INTO avatar_library (character_name, character_slug, category, description, avatar_neutral, avatar_happy, avatar_thinking, avatar_excited, primary_color, secondary_color)
VALUES 
  -- Animals (12)
  ('Robot Pup', 'robot-pup', 'animal', 'A friendly robot puppy who loves exploring technology', 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=256', 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=256', 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=256', 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=256', '#4A90E2', '#7CB9E8'),
  ('Unicorn Star', 'unicorn-star', 'animal', 'A magical unicorn who spreads joy and wonder', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=256', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=256', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=256', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=256', '#9013FE', '#D4A5FF'),
  ('Dragon Spark', 'dragon-spark', 'animal', 'A playful dragon who loves adventure and stories', 'https://images.unsplash.com/photo-1523404343994-489a5ecddbaa?w=256', 'https://images.unsplash.com/photo-1523404343994-489a5ecddbaa?w=256', 'https://images.unsplash.com/photo-1523404343994-489a5ecddbaa?w=256', 'https://images.unsplash.com/photo-1523404343994-489a5ecddbaa?w=256', '#F5A623', '#FFD700'),
  ('Rocket Racer', 'rocket-racer', 'animal', 'A speedy rocket-loving adventurer reaching for the stars', 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=256', 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=256', 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=256', 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=256', '#D0021B', '#FF6B6B'),
  ('Dino Rex', 'dino-rex', 'animal', 'A curious dinosaur who loves learning about history', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=256', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=256', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=256', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=256', '#7ED321', '#A8E6A3'),
  ('Curious Cat', 'curious-cat', 'animal', 'A clever cat who asks questions and solves mysteries', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=256', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=256', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=256', 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=256', '#F8E71C', '#FFF176'),
  ('Wonder Dog', 'wonder-dog', 'animal', 'A loyal dog who loves making new friends', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=256', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=256', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=256', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=256', '#8B4513', '#D2691E'),
  ('Fox Scout', 'fox-scout', 'animal', 'A smart fox who explores nature and discovers secrets', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=256', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=256', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=256', 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=256', '#FF6347', '#FF8C69'),
  ('Panda Zen', 'panda-zen', 'animal', 'A peaceful panda who teaches mindfulness and balance', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=256', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=256', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=256', 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=256', '#000000', '#808080'),
  ('Lion Heart', 'lion-heart', 'animal', 'A brave lion who shows courage and kindness', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=256', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=256', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=256', 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=256', '#DAA520', '#FFD700'),
  ('Frog Leap', 'frog-leap', 'animal', 'An energetic frog who loves jumping into new challenges', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=256', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=256', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=256', 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=256', '#32CD32', '#90EE90'),
  ('Ocean Octopus', 'ocean-octopus', 'animal', 'A creative octopus who multi-tasks and creates art', 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=256', 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=256', 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=256', 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=256', '#20B2AA', '#48D1CC'),
  
  -- Fantasy/Adventure (6)
  ('Space Explorer', 'space-explorer', 'fantasy', 'An astronaut discovering new worlds and galaxies', 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=256', 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=256', 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=256', 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=256', '#191970', '#4169E1'),
  ('Magic Wizard', 'magic-wizard', 'fantasy', 'A wise wizard who loves books and spells', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', '#4B0082', '#8A2BE2'),
  ('Forest Elf', 'forest-elf', 'fantasy', 'A nature-loving elf who protects the forest', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=256', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=256', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=256', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=256', '#228B22', '#32CD32'),
  ('Desert Nomad', 'desert-nomad', 'fantasy', 'An adventurer exploring ancient desert mysteries', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=256', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=256', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=256', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=256', '#DEB887', '#F4A460'),
  ('Mountain Climber', 'mountain-climber', 'fantasy', 'A brave climber reaching new heights', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=256', '#696969', '#A9A9A9'),
  ('Ocean Diver', 'ocean-diver', 'fantasy', 'An underwater explorer discovering sea wonders', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=256', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=256', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=256', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=256', '#006994', '#00A5CF'),
  
  -- Everyday Heroes (6)
  ('Super Chef', 'super-chef', 'everyday', 'A creative chef who loves cooking and sharing meals', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=256', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=256', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=256', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=256', '#DC143C', '#FF6B6B'),
  ('Artist Bee', 'artist-bee', 'everyday', 'A buzzing artist who creates colorful masterpieces', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=256', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=256', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=256', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=256', '#FFD700', '#FFA500'),
  ('Music Maestro', 'music-maestro', 'everyday', 'A musical genius who brings joy through songs', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', '#9370DB', '#BA55D3'),
  ('Science Star', 'science-star', 'everyday', 'A curious scientist conducting amazing experiments', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=256', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=256', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=256', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=256', '#00CED1', '#40E0D0'),
  ('Sport Champion', 'sport-champion', 'everyday', 'An athletic champion who loves teamwork and fair play', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=256', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=256', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=256', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=256', '#FF4500', '#FF6347'),
  ('Book Buddy', 'book-buddy', 'everyday', 'A bookworm who loves reading and sharing stories', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=256', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=256', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=256', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=256', '#8B4513', '#A0522D')
ON CONFLICT (character_slug) DO NOTHING;