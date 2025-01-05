import React from 'react';
import type { Database } from '../types/supabase';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface GameScreenProps {
  type: 'start' | 'end';
  score?: number;
  onPlayAgain?: () => void;
  children?: React.ReactNode;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  type, 
  score, 
  onPlayAgain,
  children 
}) => {
  return (
    <div className="max-w-md w-full">
      <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">Color Find</h1>
      <p className="text-gray-400 text-center mb-8">Test your color perception skills</p>
      
      {type === 'start' && (
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How to Play:</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Find the different colored square</li>
            <li>• 3 attempts per level</li>
            <li>• Colors get more similar as you progress</li>
            <li>• Time limits appear at high levels</li>
          </ul>
        </div>
      )}

      {children}

      {type === 'end' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={onPlayAgain}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <a href="#" className="text-blue-400 hover:underline">Try other Find games</a>
      </div>
    </div>
  );
};