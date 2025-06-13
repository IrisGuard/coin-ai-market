
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ExpandedAdminTabs from './ExpandedAdminTabs';
import { useComprehensiveAdminData } from '@/hooks/useComprehensiveAdminData';

// Import all management components
import AdminStatsOverview from '../AdminStatsOverview';
import AdminDatabaseSection from '../sections/AdminDatabaseSection';
import AdminUsersSection from '../AdminUsersSection';
import AdminCoinsSection from '../AdminCoinsSection';

// AI System components
import AICommandsManager from './ai/AICommandsManager';
import AIExecutionsManager from './ai/AIExecutionsManager';
import AIPredictionsManager from './ai/AIPredictionsManager';
import AutomationRulesManager from './ai/AutomationRulesManager';
import AIPerformanceManager from './ai/AIPerformanceManager';
import AITrainingManager from './ai/AITrainingManager';
import AICacheManager from './ai/AICacheManager';
import AIConfigManager from './ai/AIConfigManager';

// Error & Knowledge components
import ErrorKnowledgeBaseManager from './ErrorKnowledgeBaseManager';
import ErrorMarketDataManager from './ErrorMarketDataManager';
import AdminErrorDetectionSection from '../sections/AdminErrorDetectionSection';

// Marketplace components
import MarketplaceManager from './MarketplaceManager';
import AdminExternalSourcesTab from '../tabs/AdminExternalSourcesTab';

// Data Sources components
import ScrapingJobsManager from './ScrapingJobsManager';
import SystemAnalyticsManager from './SystemAnalyticsManager';
import SecurityManager from './SecurityManager';

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: adminData, isLoading } = useComprehensiveAdminData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const safeAdminData = adminData && typeof adminData === 'object' && !Array.isArray(adminData) ? adminData as any : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complete AI Admin System</h1>
          <p className="text-muted-foreground">Full access to all 87 database tables • 32 Management Interfaces • AI Brain Integration</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {safeAdminData?.users?.total || 0} Users • {safeAdminData?.coins?.total || 0} Coins • {safeAdminData?.system?.ai_commands || 0} AI Commands
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ExpandedAdminTabs />

        {/* Core System Tabs */}
        <TabsContent value="overview">
          <AdminStatsOverview />
        </TabsContent>

        <TabsContent value="database">
          <AdminDatabaseSection />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersSection />
        </TabsContent>

        <TabsContent value="coins">
          <AdminCoinsSection />
        </TabsContent>

        {/* AI System Tabs - Complete */}
        <TabsContent value="ai-commands">
          <AICommandsManager />
        </TabsContent>

        <TabsContent value="ai-executions">
          <AIExecutionsManager />
        </TabsContent>

        <TabsContent value="ai-predictions">
          <AIPredictionsManager />
        </TabsContent>

        <TabsContent value="automation-rules">
          <AutomationRulesManager />
        </TabsContent>

        <TabsContent value="ai-performance">
          <AIPerformanceManager />
        </TabsContent>

        <TabsContent value="ai-training">
          <AITrainingManager />
        </TabsContent>

        <TabsContent value="ai-cache">
          <AICacheManager />
        </TabsContent>

        <TabsContent value="ai-config">
          <AIConfigManager />
        </TabsContent>

        {/* Error & Knowledge Management */}
        <TabsContent value="error-knowledge">
          <ErrorKnowledgeBaseManager />
        </TabsContent>

        <TabsContent value="error-market-data">
          <ErrorMarketDataManager />
        </TabsContent>

        <TabsContent value="error-detection">
          <AdminErrorDetectionSection />
        </TabsContent>

        {/* Marketplace Management */}
        <TabsContent value="stores">
          <MarketplaceManager />
        </TabsContent>

        <TabsContent value="marketplace-listings">
          <MarketplaceManager />
        </TabsContent>

        <TabsContent value="marketplace-stats">
          <MarketplaceManager />
        </TabsContent>

        <TabsContent value="auctions">
          <MarketplaceManager />
        </TabsContent>

        <TabsContent value="transactions">
          <MarketplaceManager />
        </TabsContent>

        {/* Data Sources Management */}
        <TabsContent value="external-sources">
          <AdminExternalSourcesTab />
        </TabsContent>

        <TabsContent value="scraping-jobs">
          <ScrapingJobsManager />
        </TabsContent>

        <TabsContent value="data-quality">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="geographic-data">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="price-history">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="data-cache">
          <SystemAnalyticsManager />
        </TabsContent>

        {/* Analytics Management */}
        <TabsContent value="analytics-events">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="user-analytics">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="search-analytics">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="market-analytics">
          <SystemAnalyticsManager />
        </TabsContent>

        {/* System Management */}
        <TabsContent value="system-metrics">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="performance">
          <SystemAnalyticsManager />
        </TabsContent>

        <TabsContent value="security">
          <SecurityManager />
        </TabsContent>

        <TabsContent value="api-keys">
          <SecurityManager />
        </TabsContent>

        <TabsContent value="notifications">
          <SecurityManager />
        </TabsContent>

        <TabsContent value="logs">
          <SecurityManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullSystemAdminPanel;
