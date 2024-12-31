import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-2 text-lg font-semibold mb-4">
      <TimerIcon className="text-yellow-500" />
      <span>{timeLeft}s</span>
    </div>
  );
};