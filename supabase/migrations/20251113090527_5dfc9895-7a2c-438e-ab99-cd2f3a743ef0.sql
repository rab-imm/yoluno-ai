-- Allow kids with active sessions to read their own profile
CREATE POLICY "Kids can read own profile via active session"
  ON child_profiles
  FOR SELECT
  USING (
    id IN (
      SELECT child_id 
      FROM kids_sessions 
      WHERE expires_at > now()
      AND last_activity_at > now() - interval '30 minutes'
    )
  );