'use client';

import { motion } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';

const CorrectAnswerScreen = () => {
  const { pressedKey, playerConfigs } = useGameState();
  const playerConfig = pressedKey ? playerConfigs[pressedKey] : null;
  const playerName = playerConfig?.name || (pressedKey ? `Player ${pressedKey}` : '');
  const playerColor = playerConfig?.color || 'bg-gray-900';

  const getColorStyle = (color: string, opacity: number = 1) => {
    // Create a temporary div to compute the RGB values
    const tempDiv = document.createElement('div');
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);

    // Get the computed color
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // If we have a valid color value, return it with the opacity; otherwise use fallback
    if (computedColor && computedColor !== 'rgb(0, 0, 0)') {
      const rgb = computedColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
      }
    }

    // Fallback to red if color conversion fails
    return `bg-gray-900`;
  };

  const colorWithIntensity = getColorStyle(playerColor);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-center"
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-[80px] font-bold text-transparent"
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(to bottom, hsl(120, 80%, 60%), hsl(120, 80%, 35%))",
            }}
            animate={{
              opacity: [1, 0.8, 1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            CORRECT!
          </motion.h1>
          <motion.div
            className="text-[30px] text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-items-center justify-between px-4 py-2">
              <div className="font-semibold text-white text-shadow-lg/30 px-2 py-1 mr-3 rounded-lg bg-black"
              style={{
                backgroundColor: colorWithIntensity
              }}>
                {playerName}
              </div>
              <div className="p-1">
                wins the round!
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CorrectAnswerScreen;