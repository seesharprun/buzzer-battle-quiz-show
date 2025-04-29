'use client';

import { motion } from 'motion/react';

const WaitingForHostScreen = () => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      <motion.p
        className="text-2xl font-bold mb-4"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        👑 Game Host 👑
      </motion.p>
      <motion.p
        className="text-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Press SPACE to start the round
      </motion.p>
      <motion.p
        className="text-sm mt-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Players will use number keys (0-9) to buzz in
      </motion.p>
    </motion.div>
  );
};

export default WaitingForHostScreen;