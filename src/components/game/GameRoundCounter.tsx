'use client';

import { motion } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';

const GameRoundCounter = () => {
  const { roundCount } = useGameState();

  return (
    <motion.div 
      className="absolute top-4 left-4 bg-gray-800 px-4 py-2 rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-lg font-bold text-gray-200">Round: {roundCount}</p>
    </motion.div>
  );
};

export default GameRoundCounter;