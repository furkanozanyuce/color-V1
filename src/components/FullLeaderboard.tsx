import React, { useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import type { Database } from '../types/supabase';
import { cn } from '../utils/classNames';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface FullLeaderboardProps {
  scores: GameSession[];
  dailyScores: GameSession[];
  isDark: boolean;
  currentSessionId?: string;
}

export const FullLeaderboard: React.FC<FullLeaderboardProps> = ({ 
  scores, 
  dailyScores,
  isDark,
  currentSessionId
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'allTime'>('daily');
  const currentScores = activeTab === 'daily' ? dailyScores : scores;
  
  return (
    <div className={cn(
      "rounded-lg shadow-lg w-full md:w-80 overflow-hidden",
      isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    )}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Leaderboard</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('daily')}
              className={cn(
                'px-3 py-1 rounded text-sm',
                activeTab === 'daily' 
                  ? 'bg-blue-500 text-white' 
                  : isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Clock size={16} className="inline mr-1" />
              Daily
            </button>
            <button
              onClick={() => setActiveTab('allTime')}
              className={cn(
                'px-3 py-1 rounded text-sm',
                activeTab === 'allTime'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Trophy size={16} className="inline mr-1" />
              All Time
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[50vh] md:max-h-[calc(50vh-5rem)]">
        <div className="p-4 space-y-1">
          {currentScores.map((score, index) => (
            <div
              key={score.id}
              className={cn(
                'flex justify-between items-center p-2 rounded text-sm',
                score.id === currentSessionId && (isDark ? 'bg-blue-500/20' : 'bg-blue-50'),
                isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono w-8 flex-shrink-0">#{index + 1}</span>
                <span className="truncate">{score.user_nickname}</span>
              </div>
              <span className="flex-shrink-0 ml-2">Level {score.level_reached}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};