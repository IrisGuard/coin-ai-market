
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { seedDemoData, clearDemoData } from '@/services/demoDataSeeder';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const DemoContentManager = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const queryClient = useQueryClient();

  // Get current coin count
  const { data: coinStats, isLoading: statsLoading, refetch } = useQuery({
    queryKey: ['demo-coin-stats'],
    queryFn: async () => {
      const { data: coins, error } = await supabase
        .from('coins')
        .select('id, name, authentication_status, is_auction')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const total = coins?.length || 0;
      const verified = coins?.filter(c => c.authentication_status === 'verified').length || 0;
      const auctions = coins?.filter(c => c.is_auction).length || 0;
      const fixed = total - auctions;

      return {
        total,
        verified,
        auctions,
        fixed,
        coins: coins || []
      };
    }
  });

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDemoData();
      if (result.success) {
        await refetch();
        queryClient.invalidateQueries({ queryKey: ['coins'] });
        queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearDemo = async () => {
    if (!window.confirm('Are you sure you want to clear all coin data? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      const result = await clearDemoData();
      if (result.success) {
        await refetch();
        queryClient.invalidateQueries({ queryKey: ['coins'] });
        queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      }
    } finally {
      setIsClearing(false);
    }
  };

  const hasData = coinStats && coinStats.total > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            Demo Content Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Current Database Status</h3>
            {statsLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading statistics...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-blue-600">
                    {coinStats?.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Coins</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-green-600">
                    {coinStats?.verified || 0}
                  </div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-purple-600">
                    {coinStats?.auctions || 0}
                  </div>
                  <div className="text-sm text-gray-600">Auctions</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-2xl font-bold text-orange-600">
                    {coinStats?.fixed || 0}
                  </div>
                  <div className="text-sm text-gray-600">Fixed Price</div>
                </div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasData ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Demo content is loaded</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Ready for testing
                  </Badge>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-700 font-medium">No demo content found</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Database empty
                  </Badge>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={statsLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSeedDemo}
              disabled={isSeeding || hasData}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Demo Content...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Demo Content
                </>
              )}
            </Button>

            <Button
              onClick={handleClearDemo}
              disabled={isClearing || !hasData}
              variant="destructive"
              className="flex-1"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Clearing Data...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </>
              )}
            </Button>
          </div>

          {/* Info Section */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Demo Content Includes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 15 high-quality coin listings with detailed information</li>
              <li>• Mix of historical and modern coins</li>
              <li>• Both fixed-price and auction listings</li>
              <li>• Professional coin images from Unsplash</li>
              <li>• Verified authentication status</li>
              <li>• Demo user profile with dealer credentials</li>
            </ul>
          </div>

          {/* Recent Coins Preview */}
          {hasData && coinStats?.coins && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Recent Coins (Top 5)</h4>
              <div className="space-y-2">
                {coinStats.coins.slice(0, 5).map((coin: any, index: number) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 bg-white border rounded">
                    <div>
                      <span className="font-medium">{coin.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={coin.authentication_status === 'verified' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {coin.authentication_status}
                        </Badge>
                        {coin.is_auction && (
                          <Badge variant="outline" className="text-xs">
                            Auction
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoContentManager;
