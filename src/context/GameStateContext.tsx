'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sounds } from '../utils/sounds';

// Game states
export enum GameState {
  WAITING_FOR_HOST = 'waiting_for_host',
  READY_FOR_PLAYERS = 'ready_for_players',
  PLAYER_BUZZED = 'player_buzzed',
  WRONG_ANSWER = 'wrong_answer',
  CORRECT_ANSWER = 'correct_answer'
}

// Player score tracking interface
export interface PlayerScores {
  [key: string]: number;
}

// Track banned players (who gave wrong answers) for the current round
export interface BannedPlayers {
  [key: string]: boolean;
}

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  pressedKey: string | null;
  setPressedKey: React.Dispatch<React.SetStateAction<string | null>>;
  animationState: number;
  setAnimationState: React.Dispatch<React.SetStateAction<number>>;
  readyAnimationState: number;
  setReadyAnimationState: React.Dispatch<React.SetStateAction<number>>;
  flashingEffect: boolean;
  setFlashingEffect: React.Dispatch<React.SetStateAction<boolean>>;
  scores: PlayerScores;
  setScores: React.Dispatch<React.SetStateAction<PlayerScores>>;
  roundCount: number;
  setRoundCount: React.Dispatch<React.SetStateAction<number>>;
  bannedPlayers: BannedPlayers;
  setBannedPlayers: React.Dispatch<React.SetStateAction<BannedPlayers>>;
  awardPoint: () => void;
  penalizePlayer: () => void;
  resetToHost: () => void;
  resetGame: () => void;
  resetScores: () => void;
  startNewRound: () => void;
  handlePlayerBuzz: (key: string) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING_FOR_HOST);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [animationState, setAnimationState] = useState(0);
  const [readyAnimationState, setReadyAnimationState] = useState(0);
  const [flashingEffect, setFlashingEffect] = useState(false);
  const [scores, setScores] = useState<PlayerScores>({});
  const [roundCount, setRoundCount] = useState(0);
  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayers>({});

  // Start a new round of the game
  const startNewRound = () => {
    sounds.gameStart.play();
    setGameState(GameState.READY_FOR_PLAYERS);
    setReadyAnimationState(100);
    setPressedKey(null);
    setBannedPlayers({}); // Reset banned players for new round
    setRoundCount(prev => prev + 1);
  };

  // Handle player buzzing in
  const handlePlayerBuzz = (key: string) => {
    // Don't allow banned players to buzz in
    if (bannedPlayers[key]) {
      return;
    }
    
    setPressedKey(key);
    setGameState(GameState.PLAYER_BUZZED);
    setAnimationState(100); // Start animation at full intensity
    setFlashingEffect(true);
    sounds.buzzer.play();
  };

  // Award point to player who buzzed in
  const awardPoint = () => {
    if (pressedKey) {
      setScores(prevScores => ({
        ...prevScores,
        [pressedKey]: (prevScores[pressedKey] || 0) + 1
      }));
      
      sounds.correct.play();
      
      // Show correct answer state first
      setGameState(GameState.CORRECT_ANSWER);
      
      // Reset to host state after a delay
      setTimeout(() => {
        resetToHost();
      }, 2000);
    }
  };
  
  // Penalize player for incorrect answer
  const penalizePlayer = () => {
    if (pressedKey) {
      // Penalize the player's score
      setScores(prevScores => ({
        ...prevScores,
        [pressedKey]: Math.max(0, (prevScores[pressedKey] || 0) - 1)
      }));
      
      // Add player to banned list for this round
      setBannedPlayers(prev => ({
        ...prev,
        [pressedKey]: true
      }));
      
      sounds.wrong.play();
      
      // Important: Set to wrong answer state to allow others to answer
      setGameState(GameState.WRONG_ANSWER);
      setPressedKey(null);
      setAnimationState(0);
      setFlashingEffect(false);
    }
  };
  
  // Reset the game to wait for host
  const resetToHost = () => {
    // Preserve the current scores
    const currentScores = { ...scores };
    
    setGameState(GameState.WAITING_FOR_HOST);
    setPressedKey(null);
    setAnimationState(0);
    setReadyAnimationState(0);
    setFlashingEffect(false);
    
    // Ensure scores are maintained when resetting
    setScores(currentScores);
  };
  
  // Reset game to be ready for other players after a wrong answer
  const resetGame = () => {
    // Explicitly preserve the current scores by creating a copy
    const currentScores = { ...scores };
    
    if (gameState === GameState.WRONG_ANSWER) {
      // If we're in wrong answer state, go back to ready for players
      setGameState(GameState.READY_FOR_PLAYERS);
      setReadyAnimationState(100);
    } else {
      // Otherwise go back to host waiting state
      resetToHost();
    }
    
    // Ensure scores are maintained
    setScores(currentScores);
  };

  // Reset all scores
  const resetScores = () => {
    setScores({});
    setRoundCount(0);
    sounds.gameStart.play();
  };

  return (
    <GameStateContext.Provider value={{
      gameState,
      setGameState,
      pressedKey,
      setPressedKey,
      animationState,
      setAnimationState,
      readyAnimationState,
      setReadyAnimationState,
      flashingEffect,
      setFlashingEffect,
      scores,
      setScores,
      roundCount, 
      setRoundCount,
      bannedPlayers,
      setBannedPlayers,
      awardPoint,
      penalizePlayer,
      resetToHost,
      resetGame,
      resetScores,
      startNewRound,
      handlePlayerBuzz
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};