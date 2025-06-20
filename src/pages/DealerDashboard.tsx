
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LiveDealerPanel from '@/components/dealer/LiveDealerPanel';

const DealerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-blue bg-clip-text text-transparent mb-4">
              🚀 Live Production Dealer Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload coin images and let our live AI Brain analyze them instantly with production-grade accuracy
            </p>
          </motion.div>

          <LiveDealerPanel />
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
