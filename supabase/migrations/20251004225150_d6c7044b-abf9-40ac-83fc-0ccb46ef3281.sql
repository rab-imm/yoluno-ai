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