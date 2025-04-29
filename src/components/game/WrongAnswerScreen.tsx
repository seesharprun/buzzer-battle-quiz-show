'use client';

import { motion } from 'motion/react';
import { useGameState } from '../../context/GameStateContext';

const WrongAnswerScreen = () => {
  const { resetGame } = useGameState();

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
              backgroundImage: "linear-gradient(to bottom, hsl(0, 80%, 60%), hsl(0, 80%, 35%))",
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
            INCORRECT!
          </motion.h1>
          <motion.p
            className="text-[30px] text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Other players can still buzz in
          </motion.p>
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

export default WrongAnswerScreen;