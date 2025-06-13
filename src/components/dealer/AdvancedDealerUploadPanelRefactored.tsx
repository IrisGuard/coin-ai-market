
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Store, TrendingUp, Upload } from 'lucide-react';
import EnhancedCoinUploadManager from './EnhancedCoinUploadManager';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AdvancedDealerUploadPanelRefactored = () => {
  const { user } = useAuth();

  const { data: dealerStats } = useQuery({
    queryKey: ['dealer-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [coins, store] = await Promise.all([
        supabase.from('coins').select('*').eq('user_id', user.id),
        supabase.from('stores').select('*').eq('user_id', user.id).single()
      ]);

      const totalValue = coins.data?.reduce((sum, coin) => sum + coin.price, 0) || 0;
      const activeListings = coins.data?.filter(coin => !coin.sold).length || 0;

      return {
        totalCoins: coins.data?.length || 0,
        activeListings,
        totalValue,
        storeName: store.data?.name || 'Your Store'
      };
    },
    enabled: !!user?.id
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-blue bg-clip-text text-transparent mb-4">
          LIVE Dealer Upload System
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-powered coin listing with real-time marketplace integration
        </p>
        <Badge className="bg-green-100 text-green-800 mt-2">
          FULLY OPERATIONAL
        </Badge>
      </div>

      {/* Dealer Stats */}
      {dealerStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Store className="h-4 w-4" />
                Store Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">{dealerStats.storeName}</div>
              <Badge className="bg-blue-100 text-blue-800 mt-1">Active</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Total Coins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dealerStats.totalCoins}</div>
              <Badge className="bg-green-100 text-green-800 mt-1">Listed</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dealerStats.activeListings}</div>
              <Badge className="bg-green-100 text-green-800 mt-1">Live</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${dealerStats.totalValue.toLocaleString()}
              </div>
              <Badge className="bg-purple-100 text-purple-800 mt-1">USD</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Upload Manager */}
      <EnhancedCoinUploadManager />

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How It Works:</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              <span>Upload front and back images of your coin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              <span>AI analyzes and identifies the coin automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              <span>Review and adjust details, set price or auction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              <span>Coin goes live instantly in the marketplace</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedDealerUploadPanelRefactored;
