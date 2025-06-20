
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedCoinsGrid from './FeaturedCoinsGrid';

const FeaturedCoinsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Coins
            </h2>
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Discover authenticated coins from verified dealers worldwide
          </p>
        </motion.div>

        {/* Coins Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FeaturedCoinsGrid />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCoinsSection;
