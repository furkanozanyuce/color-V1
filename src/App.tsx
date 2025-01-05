import React, { useState, useRef, useEffect } from 'react';
import { Home, Moon, Sun, Trophy } from 'lucide-react';
import { ColorGrid, ColorGridRef } from './components/ColorGrid';
import { GameLayout } from './components/GameLayout';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { NicknameModal } from './components/NicknameModal';
import { useGameState } from './hooks/useGameState';
import { useGameSession } from './hooks/useGameSession';
import { useTheme } from './hooks/useTheme';
import { useTimer } from './hooks/useTimer';
import { generateColors } from './utils/colorUtils';

export default function App() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const {
    level,
    lives,
    score,
    gameOver,
    handleCorrectGuess,
    handleIncorrectGuess,
    resetGame,
  } = useGameState();

  const {
    sessionId,
    currentSession,
    topScores,
    dailyScores,
    startSession,
    updateScore,
    endSession,
    resetSession,
    clearSession,
  } = useGameSession();

  const { isDark, toggleTheme } = useTheme();
  const [currentColors, setCurrentColors] = useState(generateColors(level));
  const [isShuffling, setIsShuffling] = useState(false);
  const gridRef = useRef<ColorGridRef>(null);
  
  const handleTimeUp = () => {
    handleIncorrectGuess();
  };

  const { timeLeft, isTimerActive } = useTimer(level, gameOver, handleTimeUp);

  useEffect(() => {
    setCurrentColors(generateColors(level));
  }, [level]);

  useEffect(() => {
    if (sessionId) {
      updateScore(score, level);
    }
  }, [score, level, sessionId, updateScore]);

  useEffect(() => {
    if (gameOver) {
      endSession();
    }
  }, [gameOver, endSession]);

  const handleShuffle = () => {
    gridRef.current?.shuffle();
  };

  const handlePlayAgain = async () => {
    resetGame();
    await resetSession();
  };

  const handleGoHome = async () => {
    await endSession();
    resetGame();
    clearSession();
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors`}>
      {!sessionId ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">Color Find</h1>
            <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Test your color perception skills
            </p>
            
            <div className={`rounded-lg p-6 mb-8 ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-lg'}`}>
              <h2 className="text-xl font-semibold mb-4">How to Play:</h2>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Find the different colored square</li>
                <li>• 3 attempts per level</li>
                <li>• Colors get more similar as you progress</li>
                <li>• Time limits appear at high levels</li>
              </ul>
            </div>

            <NicknameModal onStart={startSession} isDark={isDark} />
            
            <div className="mt-8 text-center">
              <button
                onClick={toggleTheme}
                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Leaderboard Toggle */}
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
            aria-label="Toggle leaderboard"
          >
            <Trophy size={24} />
          </button>

          <LeaderboardPanel
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
            scores={topScores}
            dailyScores={dailyScores}
            currentSessionId=""
            isDark={isDark}
            variant="full"
          />
        </div>
      ) : (
        <div className="relative min-h-screen flex items-center justify-center p-4">
          {gameOver ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-blue-400 mb-4">Game Over!</h1>
              <div className="mb-8">
                <p className="text-xl mb-2">Final Score: {score}</p>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  You reached Level {level}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handlePlayAgain}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={handleGoHome}
                  className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors flex items-center gap-2 ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Home size={20} />
                  Home
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full max-w-2xl flex flex-col items-center">
                <GameLayout
                  isDark={isDark}
                  level={level}
                  lives={lives}
                  score={score}
                  timeLeft={timeLeft}
                  isTimerActive={isTimerActive}
                  isShuffling={isShuffling}
                  currentColors={currentColors}
                  gridRef={gridRef}
                  onThemeToggle={toggleTheme}
                  onShuffle={handleShuffle}
                  onCorrectGuess={handleCorrectGuess}
                  onIncorrectGuess={handleIncorrectGuess}
                  onShuffleStateChange={setIsShuffling}
                />
              </div>

              {/* Mobile Leaderboard Toggle */}
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="md:hidden fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
                aria-label="Toggle leaderboard"
              >
                <Trophy size={24} />
              </button>

              <LeaderboardPanel
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                scores={topScores}
                dailyScores={dailyScores}
                currentSessionId={sessionId}
                isDark={isDark}
                variant="compact"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}