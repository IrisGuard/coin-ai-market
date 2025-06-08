
import React from 'react';
import { motion } from 'framer-motion';

const CoinUploadHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Upload Your Coin
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Use our AI-powered identification system to instantly catalog and value your coins
      </p>
    </motion.div>
  );
};

export default CoinUploadHeader;
