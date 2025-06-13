
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Brain, TrendingUp, Shield, Database, AlertTriangle, Store, Package, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Import existing dealer components
import DealerUploadForm from './DealerUploadForm';
import DealerCoinsList from './DealerCoinsList';
import DealerAnalytics from './DealerAnalytics';

// Import connected AI components
import ConnectedAIAnalysis from './ConnectedAIAnalysis';
import ConnectedMarketIntelligence from './ConnectedMarketIntelligence';
import ConnectedErrorDetection from './ConnectedErrorDetection';

const EnhancedDealerPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<any[]>([]);

  // Real-time connection to Admin Brain analytics
  const { data: brainStats, isLoading: brainLoading } = useQuery({
    queryKey: ['dealer-ai-brain-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-ai-brain-dashboard-stats');
      
      if (error) {
        console.error('❌ Error fetching AI Brain stats:', error);
        throw error;
      }
      
      console.log('✅ AI Brain stats loaded for dealer:', data);
      return data;
    },
    refetchInterval: 30000 // Real-time updates every 30 seconds
  });

  // Dealer store data
  const { data: dealerStore, isLoading: storeLoading } = useQuery({
    queryKey: ['dealer-store'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching dealer store:', error);
        throw error;
      }
      
      console.log('✅ Dealer store loaded:', data);
      return data;
    }
  });

  // Dealer coins with real-time AI analysis
  const { data: dealerCoins, isLoading: coinsLoading } = useQuery({
    queryKey: ['dealer-coins-with-ai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('*, dual_image_analysis(*), error_pattern_matches(*)')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching dealer coins with AI:', error);
        throw error;
      }
      
      console.log('✅ Dealer coins with AI analysis loaded:', data?.length);
      return data || [];
    }
  });

  // Auto-trigger scraping jobs when uploading coins
  const triggerScrapingForCoin = async (coinData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-web-scraper', {
        body: {
          commandType: 'coin_market_research',
          targetUrl: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(coinData.name + ' ' + coinData.year)}`,
          coinData: coinData,
          scrapingConfig: {
            autoTrigger: true,
            dealerUpload: true,
            analysisDepth: 'comprehensive'
          }
        }
      });
      
      if (!error) {
        console.log('✅ Auto-scraping triggered for coin:', coinData.name);
        setNotifications(prev => [...prev, {
          type: 'scraping_started',
          message: `Market research initiated for ${coinData.name}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('❌ Error triggering auto-scraping:', error);
    }
  };

  // Auto-trigger visual matching for coin uploads
  const triggerVisualMatching = async (imageData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('visual-matching-engine', {
        body: {
          analysisId: imageData.analysisId,
          frontImage: imageData.frontImage,
          backImage: imageData.backImage,
          similarityThreshold: 0.7,
          autoTrigger: true
        }
      });
      
      if (!error) {
        console.log('✅ Visual matching triggered for analysis:', imageData.analysisId);
        setNotifications(prev => [...prev, {
          type: 'visual_matching_started',
          message: `Visual matching analysis started`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('❌ Error triggering visual matching:', error);
    }
  };

  if (brainLoading || storeLoading || coinsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Real-time AI Brain Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-green-600" />
            Enhanced Dealer Control Panel
            <Badge className="bg-green-100 text-green-800 ml-2">✅ AI Brain Connected</Badge>
            <Badge className="bg-blue-100 text-blue-800 ml-2">Real-time Analytics</Badge>
            <Badge className="bg-purple-100 text-purple-800 ml-2">Auto-Scraping Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{brainStats?.active_commands || 0}</div>
              <div className="text-sm text-muted-foreground">AI Commands Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{brainStats?.executions_24h || 0}</div>
              <div className="text-sm text-muted-foreground">AI Executions (24h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dealerCoins?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Your Coins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Real-time Alerts</div>
            </div>
          </div>

          {/* Real-time Notifications */}
          {notifications.length > 0 && (
            <Alert className="mt-4">
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Latest: {notifications[notifications.length - 1]?.message} 
                <span className="text-xs text-muted-foreground ml-2">
                  {notifications[notifications.length - 1]?.timestamp.toLocaleTimeString()}
                </span>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="ai-brain" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Brain
          </TabsTrigger>
          <TabsTrigger value="market-intel" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Intel
          </TabsTrigger>
          <TabsTrigger value="error-detection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Error Detection
          </TabsTrigger>
          <TabsTrigger value="my-coins" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            My Coins
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  AI Brain Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Automation Rules</span>
                    <Badge className="bg-green-100 text-green-800">
                      {brainStats?.active_automation_rules || 0} Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prediction Models</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {brainStats?.active_prediction_models || 0} Running
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Confidence</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {Math.round((brainStats?.average_prediction_confidence || 0) * 100)}%
                    </Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveTab('ai-brain')}
                  >
                    Access AI Brain
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-600" />
                  Your Store Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Store Name</span>
                    <span className="font-medium">{dealerStore?.name || 'Not Set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Status</span>
                    <Badge className={dealerStore?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {dealerStore?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Verified</span>
                    <Badge className={dealerStore?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {dealerStore?.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveTab('store')}
                  >
                    Manage Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <DealerUploadForm 
            onCoinUploaded={(coinData) => {
              triggerScrapingForCoin(coinData);
            }}
            onImageAnalyzed={(imageData) => {
              triggerVisualMatching(imageData);
            }}
          />
        </TabsContent>

        <TabsContent value="ai-brain">
          <ConnectedAIAnalysis />
        </TabsContent>

        <TabsContent value="market-intel">
          <ConnectedMarketIntelligence />
        </TabsContent>

        <TabsContent value="error-detection">
          <ConnectedErrorDetection />
        </TabsContent>

        <TabsContent value="my-coins">
          <DealerCoinsList coins={dealerCoins} />
        </TabsContent>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-6 w-6 text-blue-600" />
                Store Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Store Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Store Name</label>
                      <div className="text-lg">{dealerStore?.name || 'Not Set'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <div className="text-sm text-muted-foreground">
                        {dealerStore?.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{dealerCoins?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">Total Listings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{dealerCoins?.filter(c => c.sold).length || 0}</div>
                      <p className="text-xs text-muted-foreground">Sold Items</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{dealerCoins?.filter(c => c.is_auction).length || 0}</div>
                      <p className="text-xs text-muted-foreground">Active Auctions</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDealerPanel;
