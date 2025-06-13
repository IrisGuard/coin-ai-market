
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const DirectDealerAccessButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link to="/dealer-panel">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-xl"
          size="lg"
        >
          <Wrench className="w-6 h-6 mr-3" />
          Dealer Panel
        </Button>
      </Link>
    </motion.div>
  );
};

export default DirectDealerAccessButton;
