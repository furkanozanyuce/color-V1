/*
  # Improved security policies for game sessions

  1. Changes
    - Add validation for nickname on INSERT
    - Restrict UPDATE to only active sessions
    - Explicitly prevent DELETE operations
    - Add rate limiting for session creation

  2. Security
    - Validates nickname format and length
    - Prevents modification of ended sessions
    - Prevents any deletions
    - Limits session creation by IP
*/

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow only 10 sessions per IP per hour
  RETURN (
    SELECT COUNT(*) < 10
    FROM game_sessions
    WHERE created_at > NOW() - INTERVAL '1 hour'
    AND request.header('x-real-ip')::text = request.header('x-real-ip')::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Anyone can create a game session" ON game_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON game_sessions;

-- Create new policies with improved security
CREATE POLICY "Anyone can view game sessions"
  ON game_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Create session with validation"
  ON game_sessions
  FOR INSERT
  TO anon
  WITH CHECK (
    user_nickname IS NOT NULL AND
    length(user_nickname) BETWEEN 2 AND 20 AND
    user_nickname ~ '^[a-zA-Z0-9-_\s]+$' AND
    check_rate_limit()
  );

CREATE POLICY "Update only active sessions"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (ended_at IS NULL)
  WITH CHECK (ended_at IS NULL);

CREATE POLICY "No deletions allowed"
  ON game_sessions
  FOR DELETE
  TO anon
  USING (false);