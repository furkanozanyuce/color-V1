import React, { useState } from 'react';
import { Trophy, Clock } from 'lucide-react';
import type { Database } from '../types/supabase';
import { cn } from '../utils/classNames';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

interface CompactLeaderboardProps {
  scores: GameSession[];
  dailyScores: GameSession[];
  currentSessionId: string;
  isDark: boolean;
}

export const CompactLeaderboard: React.FC<CompactLeaderboardProps> = ({ 
  scores, 
  dailyScores,
  currentSessionId,
  isDark
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'allTime'>('daily');
  
  const currentScores = activeTab === 'daily' ? dailyScores : scores;
  const currentSession = currentScores.find(score => score.id === currentSessionId);
  const currentIndex = currentSession ? currentScores.findIndex(score => score.id === currentSessionId) : -1;

  const getDisplayScores = () => {
    if (!currentSession) return [];

    const displayScores = [];
    
    if (currentIndex > 0) {
      displayScores.push(currentScores[0]);
    }
    
    if (currentIndex > 1) {
      displayScores.push(currentScores[currentIndex - 1]);
    }
    
    displayScores.push(currentSession);
    
    if (currentIndex < currentScores.length - 1) {
      displayScores.push(currentScores[currentIndex + 1]);
    }

    return displayScores;
  };

  const displayScores = getDisplayScores();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
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

      <div className="space-y-1">
        {displayScores.map((score, index, array) => {
          const position = currentScores.findIndex(s => s.id === score.id) + 1;
          const isCurrentUser = score.id === currentSessionId;
          
          const prevPosition = index > 0 ? currentScores.findIndex(s => s.id === array[index - 1].id) + 1 : 0;
          const showEllipsis = index > 0 && position - prevPosition > 1;
          
          return (
            <React.Fragment key={score.id}>
              {showEllipsis && (
                <div className="text-center text-gray-500">•••</div>
              )}
              <div
                className={cn(
                  'flex justify-between items-center p-2 rounded text-sm',
                  isCurrentUser && (isDark ? 'bg-blue-500/20' : 'bg-blue-50')
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
                <span>Level {score.level_reached}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};