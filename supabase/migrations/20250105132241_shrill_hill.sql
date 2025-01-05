/*
  # Add browser_id column
  
  1. Changes
    - Add browser_id column to game_sessions table
    - Make browser_id NOT NULL
    - Add index on browser_id for better query performance
*/

-- Add browser_id column
ALTER TABLE game_sessions ADD COLUMN browser_id uuid NOT NULL DEFAULT gen_random_uuid();

-- Add index for better performance
CREATE INDEX idx_game_sessions_browser_id ON game_sessions(browser_id);

-- Update policies to include browser_id checks
DROP POLICY IF EXISTS "Allow session updates" ON game_sessions;

CREATE POLICY "Allow session updates"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (browser_id::text = current_setting('request.headers')::json->>'browser-id')
  WITH CHECK (browser_id::text = current_setting('request.headers')::json->>'browser-id');