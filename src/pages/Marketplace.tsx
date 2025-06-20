
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LiveMarketplaceDataProvider from '@/components/marketplace/LiveMarketplaceDataProvider';
import LiveProductionMarketplace from '@/components/marketplace/LiveProductionMarketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Zap } from 'lucide-react';

const Marketplace = () => {
  return (
    <LiveMarketplaceDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        
        <div className="pt-20">
          <div className="container mx-auto px-4">
            {/* Live Production Marketplace Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent mb-4">
                Live Production Marketplace
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Real-time coin marketplace powered by AI Brain and 16+ external data sources
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-600 text-white px-4 py-2">
                  🔴 LIVE DATA
                </Badge>
                <Badge className="bg-blue-600 text-white px-4 py-2">
                  AI POWERED
                </Badge>
                <Badge className="bg-purple-600 text-white px-4 py-2">
                  REAL-TIME
                </Badge>
                <Badge className="bg-orange-600 text-white px-4 py-2">
                  16+ SOURCES
                </Badge>
              </div>
            </motion.div>

            {/* Live Production Activity Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-2 p-4 bg-green-100 rounded-lg mb-8"
            >
              <Activity className="h-5 w-5 text-green-600 animate-pulse" />
              <span className="text-green-800 font-medium">
                Live Production Marketplace Active • Real-time data from external sources • AI processing operational
              </span>
            </motion.div>

            {/* Main Marketplace Component */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <LiveProductionMarketplace />
            </motion.div>
          </div>
        </div>
      </div>
    </LiveMarketplaceDataProvider>
  );
};

export default Marketplace;
