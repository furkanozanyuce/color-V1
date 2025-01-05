import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getBrowserId } from '../utils/sessionUtils';
import type { Database } from '../types/supabase';

type GameSession = Database['public']['Tables']['game_sessions']['Row'];

const getStartOfDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

export const useGameSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [topScores, setTopScores] = useState<GameSession[]>([]);
  const [dailyScores, setDailyScores] = useState<GameSession[]>([]);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const browserId = getBrowserId();

  const fetchScores = useCallback(async () => {
    try {
      const { data: allTimeScores } = await supabase
        .from('game_sessions')
        .select()
        .order('score', { ascending: false })
        .limit(100);

      const { data: todayScores } = await supabase
        .from('game_sessions')
        .select()
        .gte('created_at', getStartOfDay())
        .order('score', { ascending: false })
        .limit(100);

      if (allTimeScores) setTopScores(allTimeScores);
      if (todayScores) setDailyScores(todayScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  }, []);

  useEffect(() => {
    fetchScores();

    const subscription = supabase
      .channel('game_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
        },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchScores]);

  const startSession = useCallback((id: string) => {
    setSessionId(id);
  }, []);

  const updateScore = useCallback(async (score: number, level: number) => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ score, level_reached: level })
        .eq('id', sessionId)
        .eq('browser_id', browserId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentSession(data);
        fetchScores();
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  }, [sessionId, browserId, fetchScores]);

  const resetSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ score: 0, level_reached: 1, ended_at: null })
        .eq('id', sessionId)
        .eq('browser_id', browserId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentSession(data);
        await fetchScores();
      }
    } catch (error) {
      console.error('Error resetting session:', error);
    }
  }, [sessionId, browserId, fetchScores]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId)
        .eq('browser_id', browserId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentSession(data);
        await fetchScores();
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [sessionId, browserId, fetchScores]);

  const clearSession = useCallback(() => {
    setSessionId(null);
    setCurrentSession(null);
  }, []);

  return {
    sessionId,
    currentSession,
    topScores,
    dailyScores,
    startSession,
    updateScore,
    endSession,
    resetSession,
    clearSession,
  };
};