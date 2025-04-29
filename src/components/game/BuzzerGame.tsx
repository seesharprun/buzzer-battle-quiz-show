'use client';

import { AnimatePresence, animate } from 'motion/react';
import { useGameState, GameState } from '../../context/GameStateContext';
import ReadyScreen from './ReadyScreen';
import WaitingForHostScreen from './WaitingForHostScreen';
import PlayerBuzzedScreen from './PlayerBuzzedScreen';
import WrongAnswerScreen from './WrongAnswerScreen';
import CorrectAnswerScreen from './CorrectAnswerScreen';
import SettingsScreen from './SettingsScreen';
import GameControls from './GameControls';
import GameScoreboard from './GameScoreboard';
import GameRoundCounter from './GameRoundCounter';
import { useEffect } from 'react';

const BuzzerGame = () => {
  const { gameState, pressedKey, setAnimationState } = useGameState();

  // Animation effect for pulsing when a player has buzzed in
  useEffect(() => {
    if (pressedKey && gameState === GameState.PLAYER_BUZZED) {
      // Use Framer Motion's animate function for the pulsing effect
      const controls = animate(100, 70, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setAnimationState(latest);
        }
      });

      return () => {
        controls.stop();
      };
    }
  }, [pressedKey, gameState, setAnimationState]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {/* Game Round Counter */}
      <GameRoundCounter />

      {/* Game Scoreboard */}
      <GameScoreboard />

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Game area content */}
        <AnimatePresence mode="wait">
          {/* Ready for players state */}
          {gameState === GameState.READY_FOR_PLAYERS && (
            <ReadyScreen key="ready-screen" />
          )}

          {/* Wrong answer state to allow other players to buzz in */}
          {gameState === GameState.WRONG_ANSWER && (
            <WrongAnswerScreen key="wrong-answer-screen" />
          )}

          {/* Player buzzed state */}
          {gameState === GameState.PLAYER_BUZZED && pressedKey && (
            <PlayerBuzzedScreen key="player-buzzed-screen" />
          )}

          {/* Correct answer splash screen */}
          {gameState === GameState.CORRECT_ANSWER && pressedKey && (
            <CorrectAnswerScreen key="correct-answer-screen" />
          )}

          {/* Waiting for host state */}
          {gameState === GameState.WAITING_FOR_HOST && (
            <WaitingForHostScreen key="waiting-host-screen" />
          )}
        </AnimatePresence>
      </div>

      {/* Game Controls */}
      <GameControls />
      
      {/* Settings Screen - Shown when in settings state */}
      <AnimatePresence>
        {gameState === GameState.SETTINGS && <SettingsScreen />}
      </AnimatePresence>
    </div>
  );
};

export default BuzzerGame;