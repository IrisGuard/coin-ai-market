
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, Home, Store, Gavel, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const EnhancedNavigationButtons = () => {
  return (
    <>
      {/* Fixed Navigation Buttons - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed top-20 right-4 flex flex-col gap-2 z-50"
      >
        <Link to="/">
          <Button 
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-electric-blue/10 text-electric-blue border-electric-blue/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Αρχική
          </Button>
        </Link>
        
        <Link to="/marketplace">
          <Button 
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-electric-orange/10 text-electric-orange border-electric-orange/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Store className="w-4 h-4 mr-2" />
            Marketplace
          </Button>
        </Link>
        
        <Link to="/auctions">
          <Button 
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-electric-green/10 text-electric-green border-electric-green/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Gavel className="w-4 h-4 mr-2" />
            Auctions
          </Button>
        </Link>
        
        <Link to="/ai-features">
          <Button 
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-electric-purple/10 text-electric-purple border-electric-purple/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Features
          </Button>
        </Link>
      </motion.div>

      {/* Fixed Panel Buttons - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-8 right-8 flex flex-col gap-3 z-40"
      >
        <Link to="/admin">
          <Button 
            className="bg-electric-blue hover:bg-electric-blue/90 text-white px-4 py-3 text-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            size="default"
          >
            <Settings className="w-5 h-5 mr-2" />
            Admin Panel
          </Button>
        </Link>
        
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
