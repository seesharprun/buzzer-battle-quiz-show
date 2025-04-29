'use client';

import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';

const Scoreboard: React.FC = () => {
  const { scores, resetScores } = useGameContext();
  
  // Sort players by score (highest first)
  const sortedPlayers = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

  return (
    <motion.div 
      className="bg-gray-800 p-4 rounded-lg min-w-[200px]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-200">Scoreboard</h3>
        {sortedPlayers.length > 0 && (
          <motion.button 
            onClick={resetScores}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        )}
      </div>
      <AnimatePresence>
        {sortedPlayers.length > 0 ? (
          <motion.ul>
            {sortedPlayers.map((player, index) => (
              <motion.li 
                key={player} 
                className="flex justify-between items-center py-1 border-b border-gray-700 last:border-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                exit={{ opacity: 0, height: 0 }}
                layout
              >
                <span className="text-amber-400 font-bold">Player {player}</span>
                <motion.span 
                  className="bg-gray-700 px-2 py-1 rounded font-mono"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  key={scores[player]} // Force animation when score changes
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {scores[player]}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p 
            className="text-gray-400 text-sm italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No scores yet
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Scoreboard;