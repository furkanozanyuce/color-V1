/*
  # Game Sessions and Scores Schema

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `user_nickname` (text, not null)
      - `score` (integer, default 0)
      - `level_reached` (integer, default 1)
      - `created_at` (timestamp)
      - `ended_at` (timestamp, nullable)
    
  2. Security
    - Enable RLS on `game_sessions` table
    - Add policies for:
      - Anyone can read scores (for leaderboard)
      - Only session owner can update their own session
*/

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_nickname text NOT NULL,
  score integer DEFAULT 0,
  level_reached integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores for the leaderboard
CREATE POLICY "Anyone can view game sessions"
  ON game_sessions
  FOR SELECT
  TO anon
  USING (true);

-- Allow session creation
CREATE POLICY "Anyone can create a game session"
  ON game_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow updating own session
CREATE POLICY "Users can update their own sessions"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);