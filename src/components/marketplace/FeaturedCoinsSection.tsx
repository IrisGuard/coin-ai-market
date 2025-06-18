
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Star, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FeaturedCoinsGrid from './FeaturedCoinsGrid';

const FeaturedCoinsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with ERROR COINS emphasis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-electric-blue" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Coins & ERROR COINS
            </h2>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Discover authenticated coins including rare <span className="font-bold text-red-600">ERROR COINS</span> from verified dealers worldwide
          </p>

          {/* ERROR COINS Badge */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Badge className="bg-red-500 text-white px-6 py-2 text-lg font-bold border-0">
              <AlertTriangle className="w-5 h-5 mr-2" />
              ERROR COINS FEATURED
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500"
            >
              <Star className="w-8 h-8 text-red-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">ERROR COINS</h3>
              <p className="text-gray-600 text-sm">Rare minting errors with premium values</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-electric-blue"
            >
              <TrendingUp className="w-8 h-8 text-electric-blue mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Verified</h3>
              <p className="text-gray-600 text-sm">Advanced authentication technology</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
            >
              <Star className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Curated collection of finest coins</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Coins Grid - Shows ERROR COINS first */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FeaturedCoinsGrid />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-blue/90 hover:to-electric-purple/90 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                View All Coins
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/categories/error_coin">
              <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
                <AlertTriangle className="mr-2 w-5 h-5" />
                Browse ERROR COINS
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCoinsSection;
