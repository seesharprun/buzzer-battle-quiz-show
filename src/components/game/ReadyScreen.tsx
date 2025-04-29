'use client';

import { motion, useAnimationControls } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';
import { useEffect } from 'react';
import { sounds } from '../../utils/sounds';

const ReadyScreen = () => {
  const { readyAnimationState, resetGame } = useGameState();
  const readyControls = useAnimationControls();

  useEffect(() => {
    // Animate ready state with Framer Motion
    readyControls.start({
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });

    // Play a ticking sound for urgency
    const tickInterval = setInterval(() => {
      sounds.tick.play();
    }, 800);

    return () => {
      readyControls.stop();
      clearInterval(tickInterval);
    };
  }, [readyControls]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-center"
        animate={readyControls}
      >
        <motion.div
          className="relative"
          style={{
            filter: `drop-shadow(0 0 ${20 * readyAnimationState / 100}px hsl(120, 70%, ${50 + (readyAnimationState - 70) / 30 * 20}%))`
          }}
        >
          <motion.h1
            className="text-[100px] font-bold text-transparent"
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundImage: `linear-gradient(to bottom, hsl(120, 70%, ${55 + (readyAnimationState - 70) / 30 * 20}%), hsl(120, 70%, ${30 + (readyAnimationState - 70) / 30 * 20}%))`,
              scale: 1 + (readyAnimationState / 100) * 0.2
            }}
          >
            BUZZ IN NOW!
          </motion.h1>
        </motion.div>
      </motion.div>
      
      {/* Skip button for host */}
      <motion.button
        className="absolute bottom-8 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold text-lg"
        onClick={() => resetGame()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Skip Question (S)
      </motion.button>
    </motion.div>
  );
};

export default ReadyScreen;