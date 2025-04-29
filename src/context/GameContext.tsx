'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { sounds } from '../utils/sounds';

// Game state types
export enum GameState {
  WAITING_FOR_HOST = 'waiting_for_host',
  READY_FOR_PLAYERS = 'ready_for_players',
  PLAYER_BUZZED = 'player_buzzed',
}

// Player scores interface
export interface PlayerScores {
  [key: string]: number;
}

// Context state interface
interface GameContextState {
  gameState: GameState;
  pressedKey: string | null;
  scores: PlayerScores;
  roundCount: number;
  animationState: number;
  readyAnimationState: number;
  flashingEffect: boolean;
  startRound: () => void;
  handlePlayerBuzz: (key: string) => void;
  awardPoint: () => void;
  penalizePlayer: () => void;
  resetGame: () => void;
  resetScores: () => void;
  setAnimationState: React.Dispatch<React.SetStateAction<number>>;
  setReadyAnimationState: React.Dispatch<React.SetStateAction<number>>;
  setFlashingEffect: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with default values
const GameContext = createContext<GameContextState | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING_FOR_HOST);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [scores, setScores] = useState<PlayerScores>({});
  const [roundCount, setRoundCount] = useState(0);
  
  // Animation states
  const [animationState, setAnimationState] = useState(0);
  const [readyAnimationState, setReadyAnimationState] = useState(0);
  const [flashingEffect, setFlashingEffect] = useState(false);

  // Start a new round (host presses space)
  const startRound = useCallback(() => {
    sounds.gameStart.play();
    setGameState(GameState.READY_FOR_PLAYERS);
    setReadyAnimationState(100);
    setPressedKey(null);
    setRoundCount(prev => prev + 1);
  }, []);

  // Handle player buzz in
  const handlePlayerBuzz = useCallback((key: string) => {
    setPressedKey(key);
    setGameState(GameState.PLAYER_BUZZED);
    setAnimationState(100);
    setFlashingEffect(true);
    sounds.buzzer.play();
  }, []);

  // Award point to current player
  const awardPoint = useCallback(() => {
    if (pressedKey) {
      setScores(prevScores => ({
        ...prevScores,
        [pressedKey]: (prevScores[pressedKey] || 0) + 1
      }));
      sounds.correct.play();
      resetGame();
    }
  }, [pressedKey]);

  // Penalize current player
  const penalizePlayer = useCallback(() => {
    if (pressedKey) {
      setScores(prevScores => ({
        ...prevScores,
        [pressedKey]: Math.max(0, (prevScores[pressedKey] || 0) - 1)
      }));
      sounds.wrong.play();
      resetGame();
    }
  }, [pressedKey]);

  // Reset game state (back to waiting for host)
  const resetGame = useCallback(() => {
    setGameState(GameState.WAITING_FOR_HOST);
    setPressedKey(null);
    setAnimationState(0);
    setReadyAnimationState(0);
    setFlashingEffect(false);
  }, []);

  // Reset all scores
  const resetScores = useCallback(() => {
    setScores({});
    setRoundCount(0);
    sounds.gameStart.play();
  }, []);

  // Context value
  const value = {
    gameState,
    pressedKey,
    scores,
    roundCount,
    animationState,
    readyAnimationState,
    flashingEffect,
    startRound,
    handlePlayerBuzz,
    awardPoint,
    penalizePlayer,
    resetGame,
    resetScores,
    setAnimationState,
    setReadyAnimationState,
    setFlashingEffect
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook to use the game context
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}