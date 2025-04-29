'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useGameState, GameState } from '../../context/GameStateContext';

const HostControls: React.FC = () => {
  const { gameState, awardPoint, penalizePlayer, resetGame } = useGameState();
  
  // Only show host controls when a player has buzzed in but not when a correct answer was given
  return (
    gameState === GameState.PLAYER_BUZZED && (
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex space-x-4">
          <motion.button 
            onClick={awardPoint}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-xl font-bold transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Correct ✓ (R)
          </motion.button>
          <motion.button 
            onClick={penalizePlayer}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-xl font-bold transition-all"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Wrong ✗ (W)
          </motion.button>
        </div>
        <motion.button 
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all block mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Skip (S)
        </motion.button>
      </motion.div >
    )
  );
};

export default HostControls;