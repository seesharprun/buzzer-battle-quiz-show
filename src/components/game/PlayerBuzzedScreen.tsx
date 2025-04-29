'use client';

import { motion, useAnimationControls } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';
import { useEffect } from 'react';

const PlayerBuzzedScreen = () => {
  const { pressedKey, animationState, flashingEffect, playerConfigs } = useGameState();
  const playerControls = useAnimationControls();

  // Get player configuration or use defaults if not found
  const playerConfig = pressedKey ? playerConfigs[pressedKey] : null;
  // Fix the conditional logic to properly display player name
  const playerName = playerConfig?.name || (pressedKey ? `Player ${pressedKey}` : '');
  const playerColor = playerConfig?.color || 'bg-gray-900';

  useEffect(() => {
    if (flashingEffect) {
      // Use Framer Motion for the flashing effect
      playerControls.start({
        opacity: [0.2, 1, 0.5, 1, 0.5, 1],
        scale: [0.95, 1.1, 1, 1.1, 1, 1.05],
        transition: {
          duration: 1.2,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: "easeOut",
        }
      });
    }
  }, [flashingEffect, playerControls]);

  // Helper function to get the RGB values from a CSS color name
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

  // Apply intensity based on animation state
  const colorWithIntensity = getColorStyle(playerColor);
  const glowColor = getColorStyle(playerColor, 0.7);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={playerControls}
      >
        <motion.div
          className="absolute"
          style={{
            width: `${400 * (1 + (animationState / 100) * 0.5)}px`,
            height: `${400 * (1 + (animationState / 100) * 0.5)}px`,
            borderRadius: '50%',
            border: `25px solid ${colorWithIntensity}`,
            boxShadow: `0 0 ${30 * (animationState / 100)}px ${glowColor}`
          }}
        />
        <motion.h1
          className="text-[150px] font-bold z-10 text-shadow-color-white"
          style={{
            color: colorWithIntensity,
            textShadow: `0 0 ${15 * (animationState / 100)}px rgba(0, 0, 0, 0.75), 0 0 ${25 * (animationState / 100)}px ${glowColor}`,
            scale: 1 + (animationState / 100) * 0.5
          }}
        >
          {playerName}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default PlayerBuzzedScreen;