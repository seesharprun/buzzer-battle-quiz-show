'use client';

import { motion } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';

const GameScoreboard = () => {
  const { scores, bannedPlayers, resetScores, playerConfigs } = useGameState();

  const handleResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetScores();
  };

  interface Metadata {
    name: string;
    color: string;
  }

  function getMetadata(key: string): Metadata {
    const playerConfig = key ? playerConfigs[key] : null;
    const playerName = playerConfig?.name || (key ? `Player ${key}` : '');
    const playerColor = playerConfig?.color || 'bg-transparent';
    return {
      name: playerName,
      color: playerColor,
    };
  }

  // Get sorted player numbers for scoreboard
  const sortedPlayers = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

  return (
    <motion.div
      className="absolute top-4 right-4 bg-gray-800 p-4 rounded-lg min-w-[200px] shadow-xl z-10"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-200">Scoreboard</h3>
        {Object.keys(scores).length > 0 && (
          <button
            onClick={handleResetClick}
            className="text-xs bg-red-600 px-2 py-1 rounded font-medium select-none
                     hover:bg-red-700 active:bg-red-800 
                     transition-all duration-150 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          >
            Reset
          </button>
        )}
      </div>
      {sortedPlayers.length > 0 ? (
        <motion.ul>
          {sortedPlayers.map((player, index) => (
            <motion.li
              key={player}
              className="flex justify-between items-center py-1 border-b border-gray-700 last:border-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className={`text-amber-400 font-bold ${bannedPlayers[player] ? 'line-through opacity-50' : ''}`}>
                {getMetadata(player).name}
              </span>
              <motion.span
                className="bg-gray-700 px-2 py-1 rounded font-mono"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                key={scores[player]} // This forces animation when score changes
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
          transition={{ delay: 0.3 }}
        >
          No scores yet
        </motion.p>
      )}
    </motion.div>
  );
};

export default GameScoreboard;