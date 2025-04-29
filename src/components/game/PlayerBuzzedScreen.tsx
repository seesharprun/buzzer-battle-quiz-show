'use client';

import { motion, useAnimationControls } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';
import { useEffect } from 'react';

const PlayerBuzzedScreen = () => {
  const { pressedKey, animationState, flashingEffect } = useGameState();
  const playerControls = useAnimationControls();
  
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
            border: `8px solid #ff${Math.floor(200 + (animationState / 100) * 55).toString(16).padStart(2, '0')}33`,
            boxShadow: `0 0 ${30 * (animationState / 100)}px #ff${Math.floor(200 + (animationState / 100) * 55).toString(16).padStart(2, '0')}33`
          }}
        />
        <motion.h1 
          className="text-[150px] font-bold z-10"
          style={{ 
            color: `#ff${Math.floor(200 + (animationState / 100) * 55).toString(16).padStart(2, '0')}33`,
            textShadow: `0 0 ${30 * (animationState / 100)}px #ff${Math.floor(200 + (animationState / 100) * 55).toString(16).padStart(2, '0')}33`,
            scale: 1 + (animationState / 100) * 0.5
          }}
        >
          Player {pressedKey}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default PlayerBuzzedScreen;