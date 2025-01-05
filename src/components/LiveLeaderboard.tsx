import React, { useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import type { Database } from '../types/supabase';
import { cn } from '../utils/classNames';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface LiveLeaderboardProps {
  scores: GameSession[];
  currentSessionId?: string;
  dailyScores: GameSession[];
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ 
  scores, 
  dailyScores,
  currentSessionId 
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'allTime'>('daily');
  
  const currentScores = activeTab === 'daily' ? dailyScores : scores;
  const currentSession = currentScores.find(score => score.id === currentSessionId);
  const currentIndex = currentSession ? currentScores.findIndex(score => score.id === currentSessionId) : -1;

  // Get relevant scores to display (nearby scores + current user)
  const getDisplayScores = () => {
    if (!currentSession) {
      return currentScores.slice(0, 3);
    }

    const nearbyScores = [];
    // Always show top score
    if (currentIndex > 0) {
      nearbyScores.push(currentScores[0]);
    }
    
    // Show score above current user (if not at top)
    if (currentIndex > 1) {
      nearbyScores.push(currentScores[currentIndex - 1]);
    }
    
    // Show current user
    nearbyScores.push(currentSession);
    
    // Show score below current user
    if (currentIndex < currentScores.length - 1) {
      nearbyScores.push(currentScores[currentIndex + 1]);
    }

    return nearbyScores;
  };

  const displayScores = getDisplayScores();

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-64">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg dark:text-white">Leaderboard</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('daily')}
              className={cn(
                'px-3 py-1 rounded text-sm',
                activeTab === 'daily' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Trophy size={16} className="inline mr-1" />
              All Time
            </button>
          </div>
        </div>

        <div className="space-y-1">
          {displayScores.map((score, index) => {
            const position = currentScores.findIndex(s => s.id === score.id) + 1;
            const isCurrentUser = score.id === currentSessionId;
            
            return (
              <div
                key={score.id}
                className={cn(
                  'flex justify-between items-center p-2 rounded text-sm',
                  isCurrentUser
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'odd:bg-gray-50 dark:odd:bg-gray-700/30'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono w-8">#{position}</span>
                  <span className={cn(
                    'truncate',
                    isCurrentUser && 'font-semibold'
                  )}>
                    {score.user_nickname}
                  </span>
                </div>
                <span className="font-medium">
                  Level {score.level_reached}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};