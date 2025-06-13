
import React from 'react';
import { motion } from 'framer-motion';
import AdvancedDealerUploadPanel from '@/components/dealer/AdvancedDealerUploadPanel';

const DirectDealerPanel = () => {
  console.log('✅ Direct Dealer Panel accessed - bypassing all authentication');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="relative overflow-hidden pt-8">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Direct Dealer Panel Access
              </h1>
              <p className="text-muted-foreground text-lg">
                Direct access to all dealer functionality - no authentication required
              </p>
            </div>
            
            <AdvancedDealerUploadPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DirectDealerPanel;
