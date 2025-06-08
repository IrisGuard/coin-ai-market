
import React, { useState } from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useRealAdminData } from '@/hooks/useRealAdminData';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useExternalPriceSources } from '@/hooks/useEnhancedDataSources';
import { useRealTimeCoins } from '@/hooks/useRealTimeCoins';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCoinDataAggregation } from '@/hooks/useCoinDataAggregation';
import { useAdvancedAIBrain } from '@/hooks/useAdvancedAIBrain';
import { useErrorCoinsKnowledge } from '@/hooks/useErrorCoinsKnowledge';
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PanelStatsCards from '@/components/marketplace-panel/PanelStatsCards';
import PanelOverview from '@/components/marketplace-panel/PanelOverview';
import AIBrainTab from '@/components/marketplace-panel/AIBrainTab';
import DataSourcesTab from '@/components/marketplace-panel/DataSourcesTab';
import StoresTab from '@/components/marketplace-panel/StoresTab';
import SystemHealthTab from '@/components/marketplace-panel/SystemHealthTab';

const MarketplacePanelPage = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const { stats: adminStats, isLoading: adminLoading } = useRealAdminData();
  const { systemMetrics, userBehavior, performance } = useRealTimeAnalytics();
  const { data: dataSources } = useExternalPriceSources();
  const coinsData = useRealTimeCoins();
  const aiRecognition = useRealAICoinRecognition();
  const aggregationData = useCoinDataAggregation();
  const { providers } = useAdvancedAIBrain();
  const { data: errorCoinsData } = useErrorCoinsKnowledge();

  const [activeTab, setActiveTab] = useState('overview');

  // Real-time stats calculations
  const totalUsers = adminStats?.totalUsers || 0;
  const totalCoins = coinsData?.length || 0;
  const totalStores = dealers?.length || 0;
  const aiAnalysisCount = systemMetrics?.activeConnections || 0;
  const dataSourcesActive = dataSources?.filter(source => source.is_active)?.length || 0;
  const totalDataSources = dataSources?.length || 1;
  const avgResponseTime = dataSources?.reduce((acc, source) => acc + (source.reliability_score || 0), 0) / totalDataSources;
  const verifiedDealers = dealers?.filter(d => d.verified_dealer)?.length || 0;

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
        <PanelStatsCards
          totalStores={totalStores}
          verifiedDealers={verifiedDealers}
          totalUsers={totalUsers}
          aiAnalysisCount={aiAnalysisCount}
          totalCoins={totalCoins}
        />

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
            <PanelOverview
              dataSourcesActive={dataSourcesActive}
              totalDataSources={totalDataSources}
              avgResponseTime={avgResponseTime}
              providers={providers}
              systemMetrics={systemMetrics}
              userBehavior={userBehavior}
              performance={performance}
              errorCoinsData={errorCoinsData}
            />
          </TabsContent>

          <TabsContent value="ai-brain" className="space-y-6">
            <AIBrainTab
              performance={performance}
              dataSources={dataSources}
            />
          </TabsContent>

          <TabsContent value="data-sources" className="space-y-6">
            <DataSourcesTab
              dataSources={dataSources}
            />
          </TabsContent>

          <TabsContent value="stores" className="space-y-6">
            <StoresTab
              dealers={dealers}
              dealersLoading={dealersLoading}
            />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemHealthTab
              avgResponseTime={avgResponseTime}
              dataSourcesActive={dataSourcesActive}
              totalDataSources={totalDataSources}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePanelPage;
