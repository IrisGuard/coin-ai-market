
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const WatchlistHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
          <p className="text-gray-600 mt-1">Track coins you're interested in and get price alerts</p>
        </div>
        <Link to="/marketplace">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add More Coins
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default WatchlistHeader;
