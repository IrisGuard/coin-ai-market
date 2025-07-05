import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, TrendingUp, Target, Activity } from 'lucide-react';
import EnhancedCoinDetailsModal from './EnhancedCoinDetailsModal';
import CoinCard from './CoinCard';
import LiveMarketplaceHeader from './LiveMarketplaceHeader';
import { Coin, mapSupabaseCoinToCoin } from '@/types/coin';

const LiveMarketplaceGrid = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI Brain Integration - Phase 3
  const { data: aiMarketStats } = useQuery({
    queryKey: ['ai-market-intelligence'],
    queryFn: async () => {
      const { data: recognitionData, error } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('❌ Error fetching AI market data:', error);
        return null;
      }

      const totalAnalyses = recognitionData?.length || 0;
      const avgConfidence = recognitionData?.length > 0 
        ? recognitionData.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / recognitionData.length * 100
        : 0;
      
      const recentTrends = recognitionData?.slice(0, 10).map(r => ({
        id: r.id,
        confidence: (r.confidence_score || 0) * 100,
        processing_time: r.processing_time_ms || 0,
        timestamp: r.created_at
      })) || [];

      return {
        totalAnalyses,
        avgConfidence,
        recentTrends,
        processingEfficiency: recentTrends.length > 0 
          ? recentTrends.reduce((sum, t) => sum + t.processing_time, 0) / recentTrends.length 
          : 0
      };
    },
    refetchInterval: 30000
  });

  const { data: coins = [], isLoading, error } = useQuery({
    queryKey: ['live-marketplace-coins'],
    queryFn: async (): Promise<Coin[]> => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ Error fetching coins:', error);
        throw error;
      }

      // Debug logging for the specific coin
      const greeceCoin = data?.find(coin => coin.name.includes('GREECE COIN 10 LEPTA DOUBLED DIE ERROR'));
      if (greeceCoin) {
        }
      
      return (data || []).map(coin => mapSupabaseCoinToCoin(coin));
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">❌ Error loading marketplace</div>
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🪙</div>
        <h3 className="text-xl font-semibold mb-2">No Coins Listed Yet</h3>
        <p className="text-muted-foreground mb-4">
          Be the first to list a coin in our marketplace!
        </p>
        <Button onClick={() => window.location.href = '/dealer-direct'}>
          <Zap className="h-4 w-4 mr-2" />
          List Your First Coin
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <LiveMarketplaceHeader coinsCount={coins.length} />

        {/* Phase 3: AI Market Intelligence */}
        {aiMarketStats && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                AI Market Intelligence
                <Badge className="bg-blue-100 text-blue-800">Live Admin Brain Connection</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{aiMarketStats.totalAnalyses}</div>
                  <div className="text-sm text-muted-foreground">AI Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{aiMarketStats.avgConfidence.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{aiMarketStats.processingEfficiency.toFixed(0)}ms</div>
                  <div className="text-sm text-muted-foreground">Processing Speed</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-600">Live</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Real-time Data</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coins.map((coin, index) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              index={index}
              onCoinClick={handleCoinClick}
              showManagementOptions={false}
              hideDebugInfo={false}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Coin Details Modal */}
      <EnhancedCoinDetailsModal
        coin={selectedCoin as any}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default LiveMarketplaceGrid;
