import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { ColorGrid, ColorGridRef } from './ColorGrid';
import { GameStatus } from './GameStatus';
import { GameControls } from './GameControls';
import { Timer } from './Timer';

interface GameLayoutProps {
  isDark: boolean;
  level: number;
  lives: number;
  score: number;
  timeLeft: number;
  isTimerActive: boolean;
  isShuffling: boolean;
  currentColors: any;
  gridRef: React.RefObject<ColorGridRef>;
  onThemeToggle: () => void;
  onShuffle: () => void;
  onCorrectGuess: () => void;
  onIncorrectGuess: () => void;
  onShuffleStateChange: (state: boolean) => void;
  gameOver: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  isDark,
  level,
  lives,
  score,
  timeLeft,
  isTimerActive,
  isShuffling,
  currentColors,
  gridRef,
  onThemeToggle,
  onShuffle,
  onCorrectGuess,
  onIncorrectGuess,
  onShuffleStateChange,
  gameOver,
}) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <Gamepad2 size={32} className="text-blue-400" />
        <h1 className="text-3xl font-bold">Color Finder</h1>
      </div>
      
      <GameControls 
        onThemeToggle={onThemeToggle}
        isDark={isDark}
        onShuffle={onShuffle}
        isShuffling={isShuffling}
      />
      <GameStatus level={level} lives={lives} score={score} />
      <Timer timeLeft={timeLeft} isActive={isTimerActive} />
      <ColorGrid
        ref={gridRef}
        colors={currentColors}
        onCorrectGuess={onCorrectGuess}
        onIncorrectGuess={onIncorrectGuess}
        onShuffleStateChange={onShuffleStateChange}
        gameOver={gameOver}
      />
      <p className="mt-8 text-gray-400 text-center max-w-md">
        Find the square with a slightly different color. You have {lives} {lives === 1 ? 'life' : 'lives'} remaining.
        {isTimerActive && ' Complete the level before time runs out!'}
      </p>
    </>
  );
};