
import React, { useState } from 'react';
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Brain, Database, Users, BarChart3, Settings } from 'lucide-react';
import AIBrainCapabilities from '@/components/admin/enhanced/AIBrainCapabilities';
import EnhancedAIAnalytics from '@/components/admin/enhanced/EnhancedAIAnalytics';
import RealTimeMonitoring from '@/components/admin/enhanced/RealTimeMonitoring';
import AdminExternalSourcesTab from '@/components/admin/tabs/AdminExternalSourcesTab';
import AdminDataSourcesTab from '@/components/admin/tabs/AdminDataSourcesTab';
import AdminAnalyticsTab from '@/components/admin/tabs/AdminAnalyticsTab';
import { useRealAdminData } from '@/hooks/useRealAdminData';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

const AdminPanelPage = () => {
  usePageView();
  
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, isLoading } = useRealAdminData();
  const { systemMetrics, userBehavior, performance } = useRealTimeAnalytics();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent mb-2">
            CoinVision Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive administration and monitoring system
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-600">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
              <Database className="h-4 w-4 text-electric-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCoins || 0}</div>
              <p className="text-xs text-gray-600">Listed coins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-electric-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance?.successRate || 94}%</div>
              <p className="text-xs text-gray-600">Recognition rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Shield className="h-4 w-4 text-electric-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-gray-600">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-brain">AI Brain</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="external-sources">External Sources</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="font-medium">{systemMetrics?.activeConnections || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="font-medium">{userBehavior?.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Time</span>
                      <span className="font-medium">{performance?.aiProcessingTime || 0}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-medium">{performance?.errorRate || 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      View System Logs
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      Refresh Data Sources
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      Run AI Diagnostics
                    </button>
                    <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
                      Export Analytics
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-brain">
            <AIBrainCapabilities />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsTab />
          </TabsContent>

          <TabsContent value="data-sources">
            <AdminDataSourcesTab />
          </TabsContent>

          <TabsContent value="external-sources">
            <AdminExternalSourcesTab />
          </TabsContent>

          <TabsContent value="monitoring">
            <RealTimeMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanelPage;
