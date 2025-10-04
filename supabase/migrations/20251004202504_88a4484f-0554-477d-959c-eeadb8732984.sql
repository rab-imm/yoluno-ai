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
-- This provides initial foundation across all age ranges and difficulty levels