import React from 'react';
import { Heart, Trophy } from 'lucide-react';

interface GameStatusProps {
  level: number;
  lives: number;
  score: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({ level, lives, score }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-md mb-8 px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">Level {level}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Trophy size={20} className="text-yellow-500" />
          <span className="font-semibold">{score}</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart
              key={i}
              size={20}
              className="text-red-500 fill-red-500"
            />
          ))}
          {Array.from({ length: 3 - lives }).map((_, i) => (
            <Heart
              key={i + lives}
              size={20}
              className="text-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};