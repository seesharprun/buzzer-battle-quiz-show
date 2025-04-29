'use client';

import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { motion } from 'motion/react';

const RoundCounter: React.FC = () => {
  const { roundCount } = useGameContext();
  
  return (
    <motion.div 
      className="bg-gray-800 px-4 py-2 rounded-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.p 
        key={roundCount} // This forces an animation when the round count changes
        className="text-lg font-bold text-gray-200"
        initial={{ scale: 1.2, color: "#fcd34d" }}
        animate={{ scale: 1, color: "#e2e8f0" }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        Round: {roundCount}
      </motion.p>
    </motion.div>
  );
};

export default RoundCounter;