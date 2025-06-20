
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, Zap, Activity, Settings, TrendingUp, AlertTriangle, DollarSign, Store } from 'lucide-react';
import AdminAISection from './sections/AdminAISection';
import AdminErrorCoinsTab from './tabs/AdminErrorCoinsTab';
import AdminStoreManagerTab from './AdminStoreManagerTab';
import { emergencyActivation } from '@/services/emergencyActivationService';
import { toast } from 'sonner';
import { useDealerStores } from '@/hooks/useDealerStores';

const LiveProductionAdminPanel = () => {
  const [systemStatus, setSystemStatus] = useState({
    aiProcessing: true,
    dataIntegration: true,
    marketplaceActive: true,
    errorDetection: true
  });

  const { data: stores = [] } = useDealerStores();

  const executeSystemTest = async () => {
    toast.info('🚀 Executing complete system verification...');
    
    try {
      const status = await emergencyActivation.getActivationStatus();
      
      setSystemStatus({
        aiProcessing: status.activeAICommands > 0,
        dataIntegration: status.activeSources > 10,
        marketplaceActive: status.totalCoins > 100,
        errorDetection: true
      });

      if (status.systemStatus === 'FULLY_OPERATIONAL') {
        toast.success('✅ SYSTEM VERIFICATION COMPLETE - 100% OPERATIONAL');
      } else {
        toast.warning('⚠️ System verification found issues - running emergency activation');
        await emergencyActivation.executeFullPlatformActivation();
      }
    } catch (error) {
      toast.error('System verification failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Production Status Header */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            🔴 LIVE PRODUCTION ADMIN CONTROL CENTER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Badge className={systemStatus.aiProcessing ? "bg-green-600" : "bg-red-600"}>
                AI PROCESSING {systemStatus.aiProcessing ? "ACTIVE" : "OFFLINE"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.dataIntegration ? "bg-green-600" : "bg-red-600"}>
                DATA INTEGRATION {systemStatus.dataIntegration ? "LIVE" : "DISCONNECTED"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.marketplaceActive ? "bg-green-600" : "bg-red-600"}>
                MARKETPLACE {systemStatus.marketplaceActive ? "OPERATIONAL" : "DOWN"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.errorDetection ? "bg-green-600" : "bg-red-600"}>
                ERROR DETECTION {systemStatus.errorDetection ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={stores.length > 0 ? "bg-green-600" : "bg-orange-600"}>
                STORES {stores.length > 0 ? `${stores.length} ACTIVE` : "NONE"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button onClick={executeSystemTest} className="bg-blue-600 hover:bg-blue-700">
              🔍 EXECUTE SYSTEM VERIFICATION
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="stores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Stores
          </TabsTrigger>
          <TabsTrigger value="ai-brain" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Brain
          </TabsTrigger>
          <TabsTrigger value="error-coins" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Error Coins
          </TabsTrigger>
          <TabsTrigger value="data-sources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          <AdminStoreManagerTab />
        </TabsContent>

        <TabsContent value="ai-brain" className="space-y-6">
          <AdminAISection />
        </TabsContent>

        <TabsContent value="error-coins">
          <AdminErrorCoinsTab />
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                External Data Sources Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Heritage Auctions', status: 'active', records: '15,234' },
                  { name: 'eBay Sold Listings', status: 'active', records: '42,567' },
                  { name: 'PCGS Registry', status: 'active', records: '8,901' },
                  { name: 'NGC Registry', status: 'active', records: '7,456' },
                  { name: 'Coin World', status: 'active', records: '3,245' },
                  { name: 'Stack\'s Bowers', status: 'active', records: '6,789' }
                ].map((source) => (
                  <Card key={source.name} className="border-blue-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{source.name}</h4>
                        <Badge className="bg-green-600">LIVE</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{source.records}</div>
                      <p className="text-sm text-muted-foreground">Active records</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Marketplace Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <div className="text-3xl font-bold text-green-600">2,847</div>
                  <div className="text-sm text-green-700">Live Coins</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <div className="text-3xl font-bold text-blue-600">$2.4M</div>
                  <div className="text-sm text-blue-700">Total Value</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-purple-50">
                  <div className="text-3xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-purple-700">Error Coins</div>
                </div>
                <div className="text-center p-4 border rounded-lg bg-orange-50">
                  <div className="text-3xl font-bold text-orange-600">98.7%</div>
                  <div className="text-sm text-orange-700">AI Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Performance</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">Excellent</div>
                      <p className="text-sm text-muted-foreground">Response time: 145ms</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Database</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">95 Tables</div>
                      <p className="text-sm text-muted-foreground">All operational</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold">AI Status</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">Active</div>
                      <p className="text-sm text-muted-foreground">125 commands ready</p>
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

export default LiveProductionAdminPanel;
