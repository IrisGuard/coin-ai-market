
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const UploadHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-purple-200 mb-6">
        <Sparkles className="w-5 h-5 mr-3 text-purple-600 animate-pulse" />
        <span className="text-sm font-semibold text-purple-600">AI-Powered Recognition</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-serif font-bold gradient-text mb-6">
        Identify Your Coin
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Upload a photo and get instant professional identification, grading, and market valuation
      </p>
    </motion.div>
  );
};

export default UploadHeader;
