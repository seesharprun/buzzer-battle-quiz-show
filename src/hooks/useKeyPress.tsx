'use client';

import { useEffect } from 'react';
import { useGameContext, GameState } from '../context/GameContext';

export function useKeyPress() {
  const { gameState, startRound, handlePlayerBuzz } = useGameContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Host control - Space key to start a round
      if (e.key === ' ' && gameState === GameState.WAITING_FOR_HOST) {
        startRound();
        return;
      }

      // Player buzzing - only allowed when in READY_FOR_PLAYERS state
      if (gameState === GameState.READY_FOR_PLAYERS && /^[0-9]$/.test(e.key)) {
        handlePlayerBuzz(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startRound, handlePlayerBuzz]);

  return null;
}