'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

// Score event types
type ScoreEvent = {
  type: 'ADD' | 'SUBTRACT' | 'RESET';
  player?: string;
  amount?: number;
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

const STORAGE_KEY = 'seesharprun-buzzer-battle-quiz-show-react-game-state-context-scoreboard';

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING_FOR_HOST);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [animationState, setAnimationState] = useState(0);
  const [readyAnimationState, setReadyAnimationState] = useState(0);
  const [flashingEffect, setFlashingEffect] = useState(false);
  const [scores, setScoresInternal] = useState<PlayerScores>({});
  const [roundCount, setRoundCount] = useState(0);
  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayers>({});

  // Load scores from localStorage on initial mount
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem(STORAGE_KEY);
      if (savedScores) {
        setScoresInternal(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error('Failed to load scores from localStorage:', error);
    }
  }, []);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
      console.error('Failed to save scores to localStorage:', error);
    }
  }, [scores]);

  // Create a unified score dispatch system
  const dispatchScoreEvent = (event: ScoreEvent) => {
    switch (event.type) {
      case 'ADD':
        if (event.player) {
          setScoresInternal(prevScores => {
            const newScores = {
              ...prevScores,
              [event.player!]: (prevScores[event.player!] || 0) + (event.amount || 1)
            };
            return newScores;
          });
        }
        break;
      case 'SUBTRACT':
        if (event.player) {
          setScoresInternal(prevScores => {
            const newScores = {
              ...prevScores,
              [event.player!]: Math.max(0, (prevScores[event.player!] || 0) - (event.amount || 1))
            };
            return newScores;
          });
        }
        break;
      case 'RESET':
        setScoresInternal({});
        break;
    }
  };

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
    
    // Add player to scores if they don't exist yet (with 0 points initially)
    if (scores[key] === undefined) {
      setScoresInternal(prevScores => ({
        ...prevScores,
        [key]: 0
      }));
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
      // Use the dispatch system instead of direct state manipulation
      dispatchScoreEvent({
        type: 'ADD',
        player: pressedKey,
        amount: 1
      });
      
      // Clear banned players list when someone gets the right answer
      setBannedPlayers({});
      
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
      // No longer subtracting points - just add to banned list
      
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
    setGameState(GameState.WAITING_FOR_HOST);
    setPressedKey(null);
    setAnimationState(0);
    setReadyAnimationState(0);
    setFlashingEffect(false);
    // We no longer need to explicitly preserve scores as they're managed separately
  };
  
  // Reset game to be ready for other players after a wrong answer or when skipping
  const resetGame = () => {
    // Clear banned players list when skipping a question
    setBannedPlayers({});

    // Always go back to waiting for host state when skipping
    resetToHost();
  };

  // Reset all scores
  const resetScores = () => {
    dispatchScoreEvent({ type: 'RESET' });
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
      scores, // We no longer expose setScores directly
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