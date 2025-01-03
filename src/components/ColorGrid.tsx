import React, { forwardRef, useCallback, useImperativeHandle, useState, useEffect } from 'react';
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

interface Square {
  id: number;
  isTarget: boolean;
}

export const ColorGrid = forwardRef<ColorGridRef, ColorGridProps>(({ 
  colors: { baseColor, targetColor, targetIndex, gridSize }, 
  onCorrectGuess, 
  onIncorrectGuess,
  onShuffleStateChange
}, ref) => {
  const [squares, setSquares] = useState<Square[]>(() => 
    Array.from({ length: gridSize * gridSize }).map((_, index) => ({
      id: index,
      isTarget: index === targetIndex
    }))
  );
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    setSquares(Array.from({ length: gridSize * gridSize }).map((_, index) => ({
      id: index,
      isTarget: index === targetIndex
    })));
  }, [gridSize, targetIndex]);

  const handleSquareClick = useCallback((square: Square, event: React.MouseEvent<HTMLButtonElement>) => {
    if (square.isTarget) {
      onCorrectGuess();
    } else {
      event.currentTarget.blur();
      onIncorrectGuess();
    }
  }, [onCorrectGuess, onIncorrectGuess]);

  const shuffle = useCallback(() => {
    setIsShuffling(true);
    onShuffleStateChange(true);
    const newSquares = shuffleArray(squares);
    setSquares(newSquares);
    setTimeout(() => {
      setIsShuffling(false);
      onShuffleStateChange(false);
    }, 500);
  }, [squares, onShuffleStateChange]);

  useImperativeHandle(ref, () => ({
    shuffle
  }));

  return (
    <div 
      key={`${gridSize}-${targetIndex}-${baseColor}`}
      className="grid gap-2"
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        width: 'min(90vw, 400px)',
        aspectRatio: '1/1'
      }}
    >
      {squares.map((square) => (
        <button
          key={square.id}
          onClick={(e) => handleSquareClick(square, e)}
          className={`w-full h-full rounded-lg hover:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isShuffling ? 'animate-shuffle' : ''
          }`}
          style={{
            backgroundColor: square.isTarget ? targetColor : baseColor
          }}
          aria-label={`Color square ${square.id + 1}`}
          disabled={isShuffling}
        />
      ))}
    </div>
  );
});