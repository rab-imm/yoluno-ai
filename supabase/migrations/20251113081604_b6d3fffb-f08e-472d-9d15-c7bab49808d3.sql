-- Create child_feedback table for kids to send messages to parents
CREATE TABLE child_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES child_profiles(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE child_feedback ENABLE ROW LEVEL SECURITY;

-- Kids can insert feedback (no auth required since kids use PIN system)
CREATE POLICY "Anyone can submit feedback"
  ON child_feedback FOR INSERT
  WITH CHECK (true);

-- Parents can view feedback for their children
CREATE POLICY "Parents can view their children's feedback"
  ON child_feedback FOR SELECT
  USING (parent_id = auth.uid());

-- Parents can mark feedback as read
CREATE POLICY "Parents can update their feedback"
  ON child_feedback FOR UPDATE
  USING (parent_id = auth.uid());

-- Parents can delete feedback
CREATE POLICY "Parents can delete their feedback"
  ON child_feedback FOR DELETE
  USING (parent_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX idx_child_feedback_parent_id ON child_feedback(parent_id);
CREATE INDEX idx_child_feedback_created_at ON child_feedback(created_at DESC);