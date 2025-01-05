import React from 'react';
import { Trophy } from 'lucide-react';
import { Database } from '../types/supabase';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface ScoreboardProps {
  scores: GameSession[];
  currentScore?: GameSession;
  onClose: () => void;
  onPlayAgain: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  scores,
  currentScore,
  onClose,
  onPlayAgain,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Top Scores
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        {currentScore && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 dark:text-white">Your Score</h3>
            <p className="text-lg dark:text-white">
              {currentScore.score} points (Level {currentScore.level_reached})
            </p>
          </div>
        )}

        <div className="space-y-2 mb-6">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className={`flex justify-between items-center p-2 rounded ${
                currentScore?.id === score.id
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'odd:bg-gray-50 dark:odd:bg-gray-700/30'
              }`}
            >
              <div className="flex items-center gap-3 dark:text-white">
                <span className="font-mono w-6">{index + 1}.</span>
                <span>{score.user_nickname}</span>
              </div>
              <span className="font-semibold dark:text-white">{score.score}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};