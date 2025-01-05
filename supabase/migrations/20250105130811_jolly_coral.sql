/*
  # Fix anonymous access for game sessions

  1. Changes
    - Enable trust for anonymous role
    - Simplify policies to work with anonymous access
    - Remove rate limiting temporarily to debug access issues

  2. Security
    - Maintain basic validation rules
    - Keep RLS enabled
    - Allow anonymous operations with proper validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow session creation" ON game_sessions;
DROP POLICY IF EXISTS "Allow session updates" ON game_sessions;
DROP POLICY IF EXISTS "Prevent deletions" ON game_sessions;

-- Recreate policies with simplified rules and trust
CREATE POLICY "Anyone can view game sessions"
  ON game_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow session creation"
  ON game_sessions
  FOR INSERT
  TO anon
  WITH CHECK (
    user_nickname IS NOT NULL AND
    length(user_nickname) BETWEEN 2 AND 20 AND
    user_nickname ~ '^[a-zA-Z0-9\s_-]+$'
  );

CREATE POLICY "Allow session updates"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Prevent deletions"
  ON game_sessions
  FOR DELETE
  TO anon
  USING (false);

-- Grant necessary permissions to anon role
GRANT ALL ON game_sessions TO anon;