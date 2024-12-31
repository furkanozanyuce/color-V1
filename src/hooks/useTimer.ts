import { useState, useEffect } from 'react';

const TIMER_START = 100; // 100 seconds

export const useTimer = (level: number, gameOver: boolean, onTimeUp: () => void) => {
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const shouldUseTimer = level >= 15;
    setIsTimerActive(shouldUseTimer);
    setTimeLeft(TIMER_START);
  }, [level]);

  useEffect(() => {
    if (!isTimerActive || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, gameOver, onTimeUp]);

  return { timeLeft, isTimerActive };
};