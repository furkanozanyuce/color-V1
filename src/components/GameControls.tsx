import React from 'react';
import { Moon, Sun, Shuffle } from 'lucide-react';

interface GameControlsProps {
  onThemeToggle: () => void;
  isDark: boolean;
  onShuffle: () => void;
  isShuffling?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({ 
  onThemeToggle, 
  isDark,
  onShuffle,
  isShuffling
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onShuffle}
        className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        disabled={isShuffling}
      >
        <Shuffle size={24} />
      </button>
      <button
        onClick={onThemeToggle}
        className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
};