
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LiveProductionMarketplace from '@/components/marketplace/LiveProductionMarketplace';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, DollarSign, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Marketplace = () => {
  const { data: liveMarketplaceStats } = useQuery({
    queryKey: ['live-marketplace-page-stats'],
    queryFn: async () => {
      const [coins, auctions, users, transactions] = await Promise.all([
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('authentication_status', 'verified'),
        supabase.from('coins').select('*', { count: 'exact', head: true }).eq('is_auction', true).gt('auction_end', new Date().toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('payment_transactions').select('*', { count: 'exact', head: true }).eq('status', 'completed')
      ]);

      return {
        verifiedCoins: coins.count || 0,
        liveAuctions: auctions.count || 0,
        totalUsers: users.count || 0,
        completedTransactions: transactions.count || 0
      };
    },
    refetchInterval: 10000
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-20">
        <div className="container mx-auto px-4">
          {/* Live Production Header */}
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
              Real-time coin marketplace powered by AI Brain technology
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-600 text-white px-4 py-2">
                🔴 LIVE PRODUCTION
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2">
                AI BRAIN ACTIVE
              </Badge>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                REAL-TIME DATA
              </Badge>
            </div>
          </motion.div>

          {/* Live Stats Grid */}
          {liveMarketplaceStats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <TrendingUp className="h-5 w-5" />
                    Verified Coins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {liveMarketplaceStats.verifiedCoins.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-500">Live authenticated listings</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Clock className="h-5 w-5" />
                    Live Auctions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {liveMarketplaceStats.liveAuctions.toLocaleString()}
                  </div>
                  <p className="text-sm text-green-500">Active bidding now</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Users className="h-5 w-5" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {liveMarketplaceStats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-purple-500">Registered collectors</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <DollarSign className="h-5 w-5" />
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {liveMarketplaceStats.completedTransactions.toLocaleString()}
                  </div>
                  <p className="text-sm text-orange-500">Completed sales</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Live Production Activity Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 p-4 bg-green-100 rounded-lg mb-8"
          >
            <Activity className="h-5 w-5 text-green-600 animate-pulse" />
            <span className="text-green-800 font-medium">
              Live Production System Active • Real-time data processing • AI Brain operational
            </span>
          </motion.div>

          {/* Main Marketplace Component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <LiveProductionMarketplace />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
