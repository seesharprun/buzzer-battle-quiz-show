'use client';

import { useEffect } from 'react';
import { useGameState, GameState } from '../../context/GameStateContext';
import { motion, useAnimationControls } from 'motion/react';

const GameControls = () => {
  const {
    gameState,
    handlePlayerBuzz,
    awardPoint,
    penalizePlayer,
    resetGame,
    startNewRound,
    bannedPlayers,
    toggleSettings
  } = useGameState();

  const buttonControls = useAnimationControls();

  // Handle key press events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard handling entirely if in settings screen
      if (gameState === GameState.SETTINGS) {
        return;
      }
      
      // Settings shortcut - 'o' key to open settings (only from WAITING_FOR_HOST state)
      if (e.key === 'o' && gameState === GameState.WAITING_FOR_HOST) {
        toggleSettings();
        return;
      }

      // Host control - Space key to start a round
      if (e.key === ' ' && gameState === GameState.WAITING_FOR_HOST) {
        startNewRound();
        return;
      }

      // Skip question with 's' key in READY_FOR_PLAYERS or WRONG_ANSWER state
      if (e.key === 's' && (gameState === GameState.READY_FOR_PLAYERS || gameState === GameState.WRONG_ANSWER)) {
        resetGame();
        return;
      }

      // Player buzzing - only allowed when in READY_FOR_PLAYERS state
      if (gameState === GameState.READY_FOR_PLAYERS && /^[0-9]$/.test(e.key)) {
        const key = e.key;
        // Don't allow banned players to buzz in
        if (bannedPlayers[key]) {
          return;
        }
        handlePlayerBuzz(key);
      }

      // Host keyboard shortcuts - only when a player has buzzed in
      if (gameState === GameState.PLAYER_BUZZED) {
        // 'r' key for correct answer
        if (e.key === 'r') {
          buttonControls.start({
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
          });
          awardPoint();
          return;
        }

        // 'w' key for wrong answer
        if (e.key === 'w') {
          buttonControls.start({
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
          });
          penalizePlayer();
          return;
        }

        // 's' key to skip (no points awarded)
        if (e.key === 's') {
          buttonControls.start({
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
          });
          resetGame();
          return;
        }
      }

      // In WRONG_ANSWER state, other players can still buzz in
      if (gameState === GameState.WRONG_ANSWER && /^[0-9]$/.test(e.key)) {
        const key = e.key;
        // Don't allow banned players to buzz in
        if (bannedPlayers[key]) {
          return;
        }
        handlePlayerBuzz(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, bannedPlayers, handlePlayerBuzz, awardPoint, penalizePlayer, resetGame, startNewRound, buttonControls, toggleSettings]);

  // Render controls for WAITING_FOR_HOST state
  if (gameState === GameState.WAITING_FOR_HOST) {
    return (
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <motion.button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
          onClick={startNewRound}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Round (SPACE)
        </motion.button>
        <motion.button
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
          onClick={toggleSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Settings (O)
        </motion.button>
      </motion.div>
    );
  }
  
  // Render UI controls for when a player is buzzed in
  if (gameState === GameState.PLAYER_BUZZED) {
    return (
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
          onClick={awardPoint}
          animate={buttonControls}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Correct ✓ (R)
        </motion.button>
        <motion.button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
          onClick={penalizePlayer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Wrong ✗ (W)
        </motion.button>
        <motion.button
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip (S)
        </motion.button>
      </motion.div>
    );
  }

  return null;
};

export default GameControls;