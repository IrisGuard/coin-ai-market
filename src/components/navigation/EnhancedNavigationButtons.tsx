
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const EnhancedNavigationButtons = () => {
  return (
    <>
      {/* Fixed Panel Buttons - Bottom Right Only - User Panel Only */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 flex flex-col gap-3 z-40"
      >
        <Link to="/marketplace/panel">
          <Button 
            className="bg-electric-green hover:bg-electric-green/90 text-white px-4 py-3 text-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            size="default"
          >
            <Users className="w-5 h-5 mr-2" />
            User Panel
          </Button>
        </Link>
      </motion.div>
    </>
  );
};

export default EnhancedNavigationButtons;
