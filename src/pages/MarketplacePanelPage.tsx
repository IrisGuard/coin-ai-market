
import React, { useState } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useUserOwnStore } from '@/hooks/useUserOwnStore';
import { useUserOwnCoins } from '@/hooks/useUserOwnCoins';
import { useUserAIAnalytics } from '@/hooks/useUserAIAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Coins, Brain, BarChart3 } from 'lucide-react';
import MyStoreTab from '@/components/marketplace-panel/MyStoreTab';
import MyCoinsTab from '@/components/marketplace-panel/MyCoinsTab';
import MyAIAnalyticsTab from '@/components/marketplace-panel/MyAIAnalyticsTab';

const MarketplacePanelPage = () => {
  usePageView();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-store');

  const { data: store } = useUserOwnStore();
  const { data: coins } = useUserOwnCoins();
  const { data: analytics } = useUserAIAnalytics();

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
              <p className="text-gray-600">Please log in to access your marketplace panel.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent mb-2">
            My Marketplace Panel
          </h1>
          <p className="text-gray-600">
            Manage your store, coins, and view AI analytics for your collection
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Store</CardTitle>
              <Store className="h-4 w-4 text-electric-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store ? '1' : '0'}</div>
              <p className="text-xs text-gray-600">
                {store ? (store.verified ? 'Verified store' : 'Pending verification') : 'No store created'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Coins</CardTitle>
              <Coins className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coins?.length || 0}</div>
              <p className="text-xs text-gray-600">Total coins uploaded</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
              <Brain className="h-4 w-4 text-electric-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.metrics.totalAnalyses || 0}</div>
              <p className="text-xs text-gray-600">AI recognition tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-electric-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.metrics.avgAccuracy || 0}%</div>
              <p className="text-xs text-gray-600">AI accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-store">My Store</TabsTrigger>
            <TabsTrigger value="my-coins">My Coins</TabsTrigger>
            <TabsTrigger value="ai-analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="my-store" className="space-y-6">
            <MyStoreTab />
          </TabsContent>

          <TabsContent value="my-coins" className="space-y-6">
            <MyCoinsTab />
          </TabsContent>

          <TabsContent value="ai-analytics" className="space-y-6">
            <MyAIAnalyticsTab />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Coin Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Views</span>
                        <span className="font-medium">{coins?.reduce((sum, coin) => sum + (coin.views || 0), 0) || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Favorites</span>
                        <span className="font-medium">{coins?.reduce((sum, coin) => sum + (coin.favorites || 0), 0) || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Price</span>
                        <span className="font-medium">
                          ${coins?.length ? Math.round(coins.reduce((sum, coin) => sum + (coin.price || 0), 0) / coins.length) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">AI Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accuracy Rate</span>
                        <span className="font-medium">{analytics?.metrics.avgAccuracy || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Processing Time</span>
                        <span className="font-medium">{analytics?.metrics.avgProcessingTime || 0}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate</span>
                        <span className="font-medium">{analytics?.metrics.successRate || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePanelPage;
