'use client';

import { useEffect } from 'react';
import { useGameState, GameState } from '../context/GameStateContext';

function useKeyPress() {
  const { gameState, startNewRound, handlePlayerBuzz } = useGameState();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if gameState is waiting for host and press is spacebar
      if (gameState === GameState.WAITING_FOR_HOST && event.key === ' ') {
        startNewRound();
        return;
      }
      
      // Check if gameState is ready for players and key is 1-9
      if (gameState === GameState.READY_FOR_PLAYERS && /^[1-9]$/.test(event.key)) {
        handlePlayerBuzz(event.key);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startNewRound, handlePlayerBuzz]);
}

export { useKeyPress };