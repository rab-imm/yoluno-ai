-- Drop the policy causing infinite recursion
DROP POLICY IF EXISTS "Kids can read own profile via active session" ON child_profiles;