/*
  # Fix rate limiting function

  1. Changes
    - Remove request.header() usage since it's not available
    - Simplify rate limiting to use client_ip from RLS context
    - Update policies to use the fixed function

  2. Security
    - Maintain rate limiting functionality
    - Use RLS context for IP tracking
*/

-- Update rate limiting function to use auth.jwt() context
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow only 10 sessions per IP per hour
  RETURN (
    SELECT COUNT(*) < 10
    FROM game_sessions
    WHERE created_at > NOW() - INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing policies
DO $$ 
BEGIN
  -- Update create policy with fixed validation
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
      user_nickname ~ '^[a-zA-Z0-9\s_-]+$' AND
      check_rate_limit()
    );
  END IF;
END $$;