import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ColorState } from '../types';
import { shuffleArray } from '../utils/shuffleUtils';

interface ColorGridProps {
  colors: ColorState;
  onCorrectGuess: () => void;
  onIncorrectGuess: () => void;
  onShuffleStateChange: (isShuffling: boolean) => void;
}

export interface ColorGridRef {
  shuffle: () => void;
}

export const ColorGrid = forwardRef<ColorGridRef, ColorGridProps>(({ 
  colors, 
  onCorrectGuess, 
  onIncorrectGuess,
  onShuffleStateChange
}, ref) => {
  const [squares, setSquares] = useState(() => 
    Array.from({ length: colors.gridSize * colors.gridSize }).map((_, index) => ({
      id: index,
      isTarget: index === colors.targetIndex
    }))
  );
  const [isShuffling, setIsShuffling] = useState(false);

  const handleSquareClick = (index: number) => {
    if (squares[index].isTarget) {
      onCorrectGuess();
    } else {
      onIncorrectGuess();
    }
  };

  const shuffle = () => {
    setIsShuffling(true);
    onShuffleStateChange(true);
    const newSquares = shuffleArray(squares);
    setSquares(newSquares);
    setTimeout(() => {
      setIsShuffling(false);
      onShuffleStateChange(false);
    }, 500);
  };

  useImperativeHandle(ref, () => ({
    shuffle
  }));

  useEffect(() => {
    setSquares(Array.from({ length: colors.gridSize * colors.gridSize }).map((_, index) => ({
      id: index,
      isTarget: index === colors.targetIndex
    })));
  }, [colors]);

  return (
    <div 
      className="grid gap-2"
      style={{ 
        gridTemplateColumns: `repeat(${colors.gridSize}, 1fr)`,
        width: 'min(90vw, 800px)',
        aspectRatio: '1/1'
      }}
    >
      {squares.map((square, index) => (
        <button
          key={square.id}
          onClick={() => handleSquareClick(index)}
          className={`w-full h-full rounded-lg hover:opacity-90 focus:outline-none transition-all duration-500 ${
            isShuffling ? 'animate-shuffle' : ''
          }`}
          style={{
            backgroundColor: square.isTarget ? colors.targetColor : colors.baseColor,
            transform: isShuffling ? `rotate(${Math.random() * 360}deg)` : 'none',
          }}
          aria-label={`Color square ${index + 1}`}
          disabled={isShuffling}
        />
      ))}
    </div>
  );
});