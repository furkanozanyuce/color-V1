import React from 'react';
import { Trophy, X } from 'lucide-react';
import { CompactLeaderboard } from './CompactLeaderboard';
import { FullLeaderboard } from './FullLeaderboard';
import type { Database } from '../types/supabase';
import { cn } from '../utils/classNames';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface LeaderboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scores: GameSession[];
  dailyScores: GameSession[];
  currentSessionId: string;
  isDark: boolean;
  variant: 'full' | 'compact';
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  isOpen,
  onClose,
  scores,
  dailyScores,
  currentSessionId,
  isDark,
  variant,
}) => {
  const Content = variant === 'full' ? FullLeaderboard : CompactLeaderboard;

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className={cn(
        "hidden xl:block fixed top-4 left-4 w-80",
        variant === 'compact' && "shadow-lg rounded-lg overflow-hidden",
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      )}>
        {variant === 'compact' && (
          <div className="p-4">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Trophy className="text-blue-500" size={20} />
              Leaderboard
            </h2>
          </div>
        )}
        <Content
          scores={scores}
          dailyScores={dailyScores}
          currentSessionId={currentSessionId}
          isDark={isDark}
        />
      </div>

      {/* Mobile slide-in panel */}
      {isOpen && (
        <>
          <div 
            className="xl:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className={cn(
            "xl:hidden fixed inset-y-0 right-0 w-80 shadow-lg z-50 animate-slide-in",
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          )}>
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="text-blue-500" size={20} />
                Leaderboard
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-5rem)]">
              <Content
                scores={scores}
                dailyScores={dailyScores}
                currentSessionId={currentSessionId}
                isDark={isDark}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}