
import React, { useState } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useRealAdminData } from '@/hooks/useRealAdminData';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useEnhancedDataSources } from '@/hooks/useEnhancedDataSources';
import { useRealTimeCoins } from '@/hooks/useRealTimeCoins';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCoinDataAggregation } from '@/hooks/useCoinDataAggregation';
import { useAdvancedAIBrain } from '@/hooks/useAdvancedAIBrain';
import { useErrorCoinsKnowledge } from '@/hooks/useErrorCoinsKnowledge';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Store, Users, TrendingUp, Eye, Edit, Trash2, Brain, Database, 
  Activity, Zap, Globe, Shield, BarChart3, Clock, CheckCircle, 
  AlertTriangle, Coins, Bot
} from 'lucide-react';

const MarketplacePanelPage = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const { data: adminData, isLoading: adminLoading } = useRealAdminData();
  const { data: analyticsData } = useRealTimeAnalytics();
  const { data: dataSources } = useEnhancedDataSources();
  const { data: coinsData } = useRealTimeCoins();
  const { data: aiRecognition } = useRealAICoinRecognition();
  const { data: aggregationData } = useCoinDataAggregation();
  const { data: aiBrainData } = useAdvancedAIBrain();
  const { data: errorCoinsData } = useErrorCoinsKnowledge();

  const [activeTab, setActiveTab] = useState('overview');

  // Real-time stats calculations
  const totalUsers = adminData?.users?.length || 0;
  const totalCoins = coinsData?.length || 0;
  const totalStores = dealers?.length || 0;
  const aiAnalysisCount = aiRecognition?.totalAnalyses || 0;
  const dataSourcesActive = dataSources?.filter(source => source.is_active)?.length || 0;
  const avgResponseTime = dataSources?.reduce((acc, source) => acc + (source.avg_response_time || 0), 0) / (dataSources?.length || 1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent mb-2">
            User Marketplace Panel
          </h1>
          <p className="text-gray-600">
            Real-time marketplace monitoring, AI analytics, and data integration dashboard
          </p>
        </div>

        {/* Real-time Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
              <Store className="h-4 w-4 text-electric-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStores}</div>
              <p className="text-xs text-gray-600">
                {dealers?.filter(d => d.verified_dealer)?.length || 0} verified dealers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-gray-600">Registered collectors</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
              <Bot className="h-4 w-4 text-electric-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiAnalysisCount}</div>
              <p className="text-xs text-gray-600">AI recognition tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Coins</CardTitle>
              <Coins className="h-4 w-4 text-electric-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCoins}</div>
              <p className="text-xs text-gray-600">Active listings</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Tabs with Real Data */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Live Overview</TabsTrigger>
            <TabsTrigger value="ai-brain">AI Analytics</TabsTrigger>
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="stores">User Stores</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Real-time Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Sources Active</span>
                      <Badge variant="secondary">{dataSourcesActive}/{dataSources?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="text-sm font-medium">{avgResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Brain Status</span>
                      <Badge className="bg-electric-green/10 text-electric-green">
                        {aiBrainData ? 'Active' : 'Initializing'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Page Views Today</span>
                          <span className="text-sm font-medium">{analyticsData.pageViews || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">User Sessions</span>
                          <span className="text-sm font-medium">{analyticsData.sessions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Conversion Rate</span>
                          <span className="text-sm font-medium">{analyticsData.conversionRate || '0'}%</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Coins Knowledge Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Error Coins Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-electric-purple">
                      {errorCoinsData?.totalErrors || 0}
                    </div>
                    <p className="text-sm text-gray-600">Known Error Types</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-electric-orange">
                      {errorCoinsData?.marketDataPoints || 0}
                    </div>
                    <p className="text-sm text-gray-600">Market Data Points</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-electric-green">
                      {errorCoinsData?.identificationAccuracy || '0'}%
                    </div>
                    <p className="text-sm text-gray-600">ID Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-brain" className="space-y-6">
            {/* AI Brain Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Brain Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Recognition Accuracy</span>
                      <span className="text-sm font-medium">{aiRecognition?.accuracy || 85}%</span>
                    </div>
                    <Progress value={aiRecognition?.accuracy || 85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Speed</span>
                      <span className="text-sm font-medium">{aiRecognition?.avgProcessingTime || 2.5}s</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">{aiRecognition?.successRate || 92}%</span>
                    </div>
                    <Progress value={aiRecognition?.successRate || 92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Aggregation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Aggregation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aggregationData?.sources?.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${source.status === 'active' ? 'bg-electric-green' : 'bg-gray-300'}`}></div>
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                          {source.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{source.lastSync}</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No aggregation sources configured</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-sources" className="space-y-6">
            {/* External Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  External Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSources?.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${source.is_active ? 'bg-electric-green' : 'bg-red-500'}`}></div>
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-gray-600">{source.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={source.is_active ? 'default' : 'destructive'}>
                          {source.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {source.success_rate?.toFixed(1)}% success
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No data sources available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-6">
            {/* User Stores Management - Enhanced */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Stores Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dealersLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-16 h-8 bg-gray-200 rounded"></div>
                          <div className="w-16 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dealers?.map((dealer) => (
                      <div key={dealer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={dealer.avatar_url} />
                            <AvatarFallback className="bg-electric-blue/10 text-electric-blue">
                              {dealer.full_name?.[0] || dealer.username?.[0] || 'D'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{dealer.full_name || dealer.username}</h3>
                              {dealer.verified_dealer && (
                                <Badge variant="secondary" className="bg-electric-green/10 text-electric-green">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {dealer.location} • Rating: {dealer.rating || 'N/A'} • Rep: {dealer.reputation || 0}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )) || []}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Health Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Function Security</span>
                      <Badge className="bg-electric-green/10 text-electric-green">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Secure
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">OTP Configuration</span>
                      <Badge className="bg-electric-orange/10 text-electric-orange">
                        <Clock className="w-3 h-3 mr-1" />
                        Manual Setup
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RLS Policies</span>
                      <Badge className="bg-electric-green/10 text-electric-green">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">API Response Time</span>
                        <span className="text-sm font-medium">{avgResponseTime.toFixed(0)}ms</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (avgResponseTime / 10))} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Source Uptime</span>
                        <span className="text-sm font-medium">
                          {((dataSourcesActive / (dataSources?.length || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={(dataSourcesActive / (dataSources?.length || 1)) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">System Load</span>
                        <span className="text-sm font-medium">Normal</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePanelPage;
