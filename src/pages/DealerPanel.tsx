
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProductionDealerPanel from '@/components/dealer/ProductionDealerPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Upload, Zap, Activity } from 'lucide-react';

const DealerPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-20">
        <div className="container mx-auto px-4">
          {/* Live Production Dealer Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent mb-4">
              Live Production Dealer Panel
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              AI-powered coin analysis and automatic form filling
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-600 text-white px-4 py-2">
                🔴 LIVE PRODUCTION
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2">
                AI AUTO-FILL
              </Badge>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                LIVE ANALYSIS
              </Badge>
            </div>
          </motion.div>

          {/* Live Dealer Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="h-5 w-5" />
                  AI Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-600">LIVE</div>
                <p className="text-sm text-purple-500">Instant coin analysis</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Upload className="h-5 w-5" />
                  Image Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-600">READY</div>
                <p className="text-sm text-blue-500">Drag & drop processing</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Zap className="h-5 w-5" />
                  Auto-Fill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">ACTIVE</div>
                <p className="text-sm text-green-500">Instant form completion</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Production Activity Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 p-4 bg-purple-100 rounded-lg mb-8"
          >
            <Activity className="h-5 w-5 text-purple-600 animate-pulse" />
            <span className="text-purple-800 font-medium">
              Live Production Dealer System Active • AI Brain processing • Auto-fill operational
            </span>
          </motion.div>

          {/* Main Dealer Panel Component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ProductionDealerPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DealerPanel;
