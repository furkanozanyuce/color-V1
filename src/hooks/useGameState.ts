import { useState, useCallback } from 'react';

const MAX_LIVES = 3;

export const useGameState = () => {
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleCorrectGuess = useCallback(() => {
    setScore(prev => prev + (level * 100));
    setLevel(prev => prev + 1);
    setLives(MAX_LIVES);
  }, [level]);

  const handleIncorrectGuess = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives === 0) {
        setGameOver(true);
      }
      return newLives;
    });
  }, []);

  const resetGame = useCallback(() => {
    setLevel(1);
    setLives(MAX_LIVES);
    setScore(0);
    setGameOver(false);
  }, []);

  return {
    level,
    lives,
    score,
    gameOver,
    handleCorrectGuess,
    handleIncorrectGuess,
    resetGame,
  };
};