import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Brain, TrendingUp, Shield, Database, AlertTriangle, Store, Package, Bell, Bot, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Import existing dealer components
import DealerCoinsList from './DealerCoinsList';
import DealerAnalytics from './DealerAnalytics';

// Import new enhanced components
import EnhancedDealerUploadTriggers from './EnhancedDealerUploadTriggers';
import MultiCategoryListingManager from './MultiCategoryListingManager';

// Import connected AI components
import ConnectedAIAnalysis from './ConnectedAIAnalysis';
import ConnectedMarketIntelligence from './ConnectedMarketIntelligence';
import ConnectedErrorDetection from './ConnectedErrorDetection';

// Import the new Wallet Management component
import WalletManagementTab from './WalletManagementTab';

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

  // Real-time scraping jobs monitoring
  const { data: activeScrapingJobs } = useQuery({
    queryKey: ['dealer-scraping-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .eq('status', 'running')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 15000 // Check every 15 seconds
  });

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
            <Badge className="bg-orange-100 text-orange-800 ml-2">Commercial Features</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div className="text-2xl font-bold text-orange-600">{activeScrapingJobs?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Active Scraping</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{notifications.length}</div>
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

          {/* Active Scraping Jobs Status */}
          {activeScrapingJobs && activeScrapingJobs.length > 0 && (
            <Alert className="mt-4 border-blue-200">
              <Bot className="h-4 w-4" />
              <AlertDescription>
                {activeScrapingJobs.length} scraping jobs currently running for market research
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="enhanced-upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Smart Upload
          </TabsTrigger>
          <TabsTrigger value="multi-listing" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Multi-Listing
          </TabsTrigger>
          <TabsTrigger value="my-wallets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            My Wallets
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
            <Store className="h-4 w-4" />
            My Inventory
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
                  <div className="flex justify-between items-center">
                    <span>Total Coins</span>
                    <span className="font-medium">{dealerCoins?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enhanced-upload">
          <EnhancedDealerUploadTriggers />
        </TabsContent>

        <TabsContent value="multi-listing">
          <MultiCategoryListingManager />
        </TabsContent>

        <TabsContent value="my-wallets">
          <WalletManagementTab />
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
          <DealerCoinsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDealerPanel;
