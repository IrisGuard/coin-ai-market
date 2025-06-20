
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CompleteProductionActivator from '@/components/production/CompleteProductionActivator';
import LiveProductionAdminPanel from '@/components/admin/LiveProductionAdminPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Brain, Shield } from 'lucide-react';

const AdminPanelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-20">
        <div className="container mx-auto px-4">
          {/* Live Production Admin Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-red to-electric-orange bg-clip-text text-transparent mb-4">
              Live Production Admin Panel
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Complete control center for AI Brain and marketplace operations
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-600 text-white px-4 py-2">
                🔴 LIVE PRODUCTION
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2">
                AI BRAIN CONTROL
              </Badge>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                REAL-TIME ADMIN
              </Badge>
              <Badge className="bg-orange-600 text-white px-4 py-2">
                FULL ACCESS
              </Badge>
            </div>
          </motion.div>

          {/* Complete Production Activator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <CompleteProductionActivator />
          </motion.div>

          {/* Live Production Activity Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 p-4 bg-blue-100 rounded-lg mb-8"
          >
            <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
            <span className="text-blue-800 font-medium">
              Live Production Admin Active • Full system control • AI Brain management operational
            </span>
          </motion.div>

          {/* Main Admin Panel Component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <LiveProductionAdminPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
