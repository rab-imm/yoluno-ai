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