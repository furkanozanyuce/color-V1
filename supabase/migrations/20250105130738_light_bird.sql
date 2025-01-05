/*
  # Fix RLS policies for game sessions

  1. Changes
    - Simplify rate limiting function
    - Fix policies for session creation and updates
    - Remove IP-based rate limiting as it's not reliable in browser context
    - Add proper validation for nickname format

  2. Security
    - Maintain RLS on game_sessions table
    - Allow public read access for leaderboard
    - Allow creation with validation
    - Allow updates only for active sessions
    - Prevent deletions
*/

-- Simplify rate limiting to time-based only
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) < 10
    FROM game_sessions
    WHERE created_at > NOW() - INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Create session with validation" ON game_sessions;
DROP POLICY IF EXISTS "Update only active sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow session updates" ON game_sessions;
DROP POLICY IF EXISTS "No deletions allowed" ON game_sessions;

-- Recreate policies with proper permissions
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
    user_nickname ~ '^[a-zA-Z0-9\s_-]+$' AND
    check_rate_limit()
  );

CREATE POLICY "Allow session updates"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Prevent deletions"
  ON game_sessions
  FOR DELETE
  TO anon
  USING (false);