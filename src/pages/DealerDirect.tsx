
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AdvancedDealerUploadPanel from '@/components/dealer/AdvancedDealerUploadPanel';

const DealerDirect = () => {
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
          >
            <AdvancedDealerUploadPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DealerDirect;
