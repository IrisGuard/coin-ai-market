import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Download,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import ComprehensiveSalesReport from '../analytics/ComprehensiveSalesReport';
import UserActivityDashboard from '../analytics/UserActivityDashboard';
import AdvancedAnalyticsDashboard from '../enhanced/AdvancedAnalyticsDashboard';
import { useProductionAnalytics } from '@/hooks/useProductionAnalytics';
import { useRealAnalyticsData } from '@/hooks/useRealAnalyticsData';

const Phase8AnalyticsManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: productionAnalytics, isLoading: analyticsLoading, refetch } = useProductionAnalytics();
  const { data: realTimeData, isLoading: realTimeLoading } = useRealAnalyticsData();

  const handleRefresh = () => {
    refetch();
  };

  const handleExportReport = () => {
    // Generate comprehensive report
    const reportData = {
      timestamp: new Date().toISOString(),
      productionAnalytics,
      realTimeData,
      phase: 'Phase 8 - Analytics & Reporting',
      status: 'Active'
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `phase8-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Phase 8 Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-700">Phase 8: Analytics & Reporting</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive analytics dashboard with real-time monitoring, sales reports, and user activity tracking
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
              <Button variant="outline" onClick={handleRefresh} disabled={analyticsLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${analyticsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Overview */}
      {productionAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Total Users</span>
              </div>
              <div className="text-2xl font-bold">{productionAnalytics.users.total}</div>
              <div className="text-xs text-muted-foreground">
                +{productionAnalytics.users.growth} new users (30d)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Total Coins</span>
              </div>
              <div className="text-2xl font-bold">{productionAnalytics.coins.total}</div>
              <div className="text-xs text-muted-foreground">
                {productionAnalytics.coins.totalViews} total views
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <div className="text-2xl font-bold">${productionAnalytics.revenue.total.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {productionAnalytics.revenue.transactions} transactions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">System Health</span>
              </div>
              <div className="text-2xl font-bold">{productionAnalytics.system.uptime}%</div>
              <div className="text-xs text-muted-foreground">
                {productionAnalytics.system.errors24h} errors (24h)
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Sales Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Activity
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Real-time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Sales Analytics</h4>
                    <p className="text-sm text-blue-700">
                      Comprehensive revenue tracking, transaction analysis, and payment method insights
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">User Activity</h4>
                    <p className="text-sm text-green-700">
                      User engagement metrics, retention analysis, and behavior tracking
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Real-time Monitoring</h4>
                    <p className="text-sm text-purple-700">
                      Live system performance, user activity, and error monitoring
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Performance Analytics</h4>
                    <p className="text-sm text-orange-700">
                      System health metrics, API performance, and optimization insights
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <ComprehensiveSalesReport />
        </TabsContent>

        <TabsContent value="users">
          <UserActivityDashboard />
        </TabsContent>

        <TabsContent value="realtime">
          <AdvancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>

      {/* Phase 8 Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Phase 8 Implementation Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Comprehensive Sales Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>User Activity & Engagement Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Real-time Performance Monitoring</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Revenue & Transaction Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Advanced Reporting Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Data Export & Visualization</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Phase 8 Complete:</strong> Analytics & Reporting system fully operational with real-time monitoring,
              comprehensive sales reports, user activity tracking, and advanced data visualization capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase8AnalyticsManager;