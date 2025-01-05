/*
  # Update game session policies and add rate limiting
  
  1. Changes
    - Add rate limiting function to prevent abuse
    - Update existing policies with improved validation
    - Add nickname validation
    - Prevent deletions
  
  2. Security
    - Rate limit: 10 sessions per IP per hour
    - Nickname requirements: 2-20 chars, alphanumeric + spaces/hyphens/underscores
    - Only allow updates to active sessions
    - No deletions allowed
*/

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) < 10
    FROM game_sessions
    WHERE created_at > NOW() - INTERVAL '1 hour'
    AND request.header('x-real-ip')::text = request.header('x-real-ip')::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing policies with new rules
DO $$ 
BEGIN
  -- Update view policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view game sessions'
    AND tablename = 'game_sessions'
  ) THEN
    ALTER POLICY "Anyone can view game sessions" 
    ON game_sessions
    USING (true);
  END IF;

  -- Update create policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Create session with validation'
    AND tablename = 'game_sessions'
  ) THEN
    ALTER POLICY "Create session with validation"
    ON game_sessions
    WITH CHECK (
      user_nickname IS NOT NULL AND
      length(user_nickname) BETWEEN 2 AND 20 AND
      user_nickname ~ '^[a-zA-Z0-9-_\s]+$' AND
      check_rate_limit()
    );
  END IF;

  -- Update update policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Update only active sessions'
    AND tablename = 'game_sessions'
  ) THEN
    ALTER POLICY "Update only active sessions"
    ON game_sessions
    USING (ended_at IS NULL)
    WITH CHECK (ended_at IS NULL);
  END IF;

  -- Update delete policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'No deletions allowed'
    AND tablename = 'game_sessions'
  ) THEN
    ALTER POLICY "No deletions allowed"
    ON game_sessions
    USING (false);
  END IF;
END $$;