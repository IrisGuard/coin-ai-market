
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const CoinUploadHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 mb-6">
        <Zap className="w-5 h-5 mr-3 text-indigo-600 animate-pulse" />
        <span className="text-sm font-semibold text-indigo-600">Professional Listing Tool</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
        List Your Coin
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Upload multiple photos, get AI analysis, and create a professional listing. 
        Our advanced technology ensures maximum visibility and accurate valuation.
      </p>
    </motion.div>
  );
};

export default CoinUploadHeader;
