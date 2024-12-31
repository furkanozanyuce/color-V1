import React, { useState, useRef, useEffect } from 'react';
import { ColorGrid, ColorGridRef } from './components/ColorGrid';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';
import { Timer } from './components/Timer';
import { useGameState } from './hooks/useGameState';
import { useTheme } from './hooks/useTheme';
import { useTimer } from './hooks/useTimer';
import { Gamepad2 } from 'lucide-react';
import { generateColors } from './utils/colorUtils';

export default function App() {
  const {
    level,
    lives,
    score,
    gameOver,
    handleCorrectGuess,
    handleIncorrectGuess,
    resetGame,
  } = useGameState();

  const { isDark, toggleTheme } = useTheme();
  const [currentColors, setCurrentColors] = useState(generateColors(level));
  const [isShuffling, setIsShuffling] = useState(false);
  const gridRef = useRef<ColorGridRef>(null);
  
  const handleTimeUp = () => {
    handleIncorrectGuess();
  };

  const { timeLeft, isTimerActive } = useTimer(level, gameOver, handleTimeUp);

  useEffect(() => {
    setCurrentColors(generateColors(level));
  }, [level]);

  const handleShuffle = () => {
    gridRef.current?.shuffle();
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col items-center justify-center p-4 transition-colors`}>
      <div className="flex items-center gap-2 mb-8">
        <Gamepad2 size={32} className="text-blue-400" />
        <h1 className="text-3xl font-bold">Color Finder</h1>
      </div>
      
      {gameOver ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <GameControls 
            onThemeToggle={toggleTheme}
            isDark={isDark}
            onShuffle={handleShuffle}
            isShuffling={isShuffling}
          />
          <GameStatus level={level} lives={lives} score={score} />
          <Timer timeLeft={timeLeft} isActive={isTimerActive} />
          <ColorGrid
            ref={gridRef}
            colors={currentColors}
            onCorrectGuess={handleCorrectGuess}
            onIncorrectGuess={handleIncorrectGuess}
            onShuffleStateChange={setIsShuffling}
          />
          <p className="mt-8 text-gray-400 text-center max-w-md">
            Find the square with a slightly different color. You have {lives} {lives === 1 ? 'life' : 'lives'} remaining.
            {isTimerActive && ' Complete the level before time runs out!'}
          </p>
        </>
      )}
    </div>
  );
}