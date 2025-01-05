import React, { useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import type { Database } from '../types/supabase';
import { cn } from '../utils/classNames';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface FullLeaderboardProps {
  scores: GameSession[];
  dailyScores: GameSession[];
  isDark: boolean;
}

export const FullLeaderboard: React.FC<FullLeaderboardProps> = ({ 
  scores, 
  dailyScores,
  isDark
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'allTime'>('daily');
  const currentScores = activeTab === 'daily' ? dailyScores : scores;
  
  return (
    <div className={cn(
      "fixed top-4 left-4 rounded-lg shadow-lg w-80 h-[50vh]",
      isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    )}>
      <div className="p-4 border-b border-gray-700">
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

      <div className="overflow-y-auto h-[calc(50vh-5rem)] px-4 py-2">
        <div className="space-y-1">
          {currentScores.map((score, index) => (
            <div
              key={score.id}
              className={cn(
                'flex justify-between items-center p-2 rounded text-sm',
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