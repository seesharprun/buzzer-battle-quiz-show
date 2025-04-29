'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { sounds } from '../utils/sounds';

// Game states
export enum GameState {
  WAITING_FOR_HOST = 'waiting_for_host',
  READY_FOR_PLAYERS = 'ready_for_players',
  PLAYER_BUZZED = 'player_buzzed',
  WRONG_ANSWER = 'wrong_answer',
  CORRECT_ANSWER = 'correct_answer',
  SETTINGS = 'settings' // New state for settings screen
}

// Player score tracking interface
export interface PlayerScores {
  [key: string]: number;
}

// Player configuration interface
export interface PlayerConfig {
  name: string;
  color: string;
}

// Default player configurations
export const DEFAULT_COLORS = [
  'red', 'blue', 'green', 'purple', 'orange', 
  'teal', 'magenta', 'cyan', 'lime', 'pink'
];

export const DEFAULT_PLAYER_CONFIG: {[key: string]: PlayerConfig} = {
  '0': { name: 'Player 0', color: 'red' },
  '1': { name: 'Player 1', color: 'blue' },
  '2': { name: 'Player 2', color: 'green' },
  '3': { name: 'Player 3', color: 'purple' },
  '4': { name: 'Player 4', color: 'orange' },
  '5': { name: 'Player 5', color: 'teal' },
  '6': { name: 'Player 6', color: 'magenta' },
  '7': { name: 'Player 7', color: 'cyan' },
  '8': { name: 'Player 8', color: 'lime' },
  '9': { name: 'Player 9', color: 'pink' }
};

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
  playerConfigs: {[key: string]: PlayerConfig};
  updatePlayerConfig: (key: string, config: PlayerConfig) => void;
  previewPlayer: string | null;
  setPreviewPlayer: React.Dispatch<React.SetStateAction<string | null>>;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  awardPoint: () => void;
  penalizePlayer: () => void;
  resetToHost: () => void;
  resetGame: () => void;
  resetScores: () => void;
  startNewRound: () => void;
  handlePlayerBuzz: (key: string) => void;
}

const STORAGE_KEY = 'seesharprun-buzzer-battle-quiz-show-react-game-state-context-scoreboard';
const PLAYER_CONFIG_STORAGE_KEY = 'seesharprun-buzzer-battle-quiz-show-player-configs';

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
  const [playerConfigs, setPlayerConfigs] = useState<{[key: string]: PlayerConfig}>(DEFAULT_PLAYER_CONFIG);
  const [previewPlayer, setPreviewPlayer] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  // Load player configurations from localStorage
  useEffect(() => {
    try {
      const savedPlayerConfigs = localStorage.getItem(PLAYER_CONFIG_STORAGE_KEY);
      if (savedPlayerConfigs) {
        setPlayerConfigs(JSON.parse(savedPlayerConfigs));
      }
    } catch (error) {
      console.error('Failed to load player configurations from localStorage:', error);
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

  // Save player configurations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PLAYER_CONFIG_STORAGE_KEY, JSON.stringify(playerConfigs));
    } catch (error) {
      console.error('Failed to save player configurations to localStorage:', error);
    }
  }, [playerConfigs]);

  const updatePlayerConfig = (key: string, config: PlayerConfig) => {
    setPlayerConfigs(prev => ({
      ...prev,
      [key]: config
    }));
  };

  const toggleSettings = () => {
    if (isSettingsOpen) {
      // Coming back from settings
      setGameState(GameState.WAITING_FOR_HOST);
      setIsSettingsOpen(false);
    } else {
      // Going to settings
      setGameState(GameState.SETTINGS);
      setIsSettingsOpen(true);
    }
  };

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
    sounds.reset.play();
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
      playerConfigs,
      updatePlayerConfig,
      previewPlayer,
      setPreviewPlayer,
      isSettingsOpen,
      toggleSettings,
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