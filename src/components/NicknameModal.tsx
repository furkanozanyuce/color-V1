import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { getBrowserId } from '../utils/sessionUtils';

interface NicknameModalProps {
  onStart: (sessionId: string) => void;
  isDark: boolean;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({ onStart, isDark }) => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateNickname = (name: string) => {
    if (name.length < 2) return 'Nickname must be at least 2 characters';
    if (name.length > 20) return 'Nickname must be less than 20 characters';
    if (!/^[a-zA-Z0-9-_\s]+$/.test(name)) return 'Only letters, numbers, spaces, - and _ allowed';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateNickname(nickname.trim());
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from('game_sessions')
        .insert({ 
          user_nickname: nickname.trim(),
          browser_id: getBrowserId()
        })
        .select()
        .single();

      if (dbError) throw dbError;
      if (data) onStart(data.id);
    } catch (error) {
      console.error('Error creating game session:', error);
      setError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError('');
          }}
          placeholder="Enter your nickname"
          className={`w-full p-3 rounded-lg mb-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } ${error ? 'border-red-500' : ''}`}
          maxLength={20}
          required
        />
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading || !nickname.trim()}
          className="w-full bg-blue-500 text-white rounded-lg p-3 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Starting...' : 'Start Game'}
        </button>
      </form>
    </div>
  );
};