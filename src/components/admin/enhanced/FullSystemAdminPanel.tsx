
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ExpandedAdminTabs from './ExpandedAdminTabs';
import { useComprehensiveAdminData } from '@/hooks/useComprehensiveAdminData';

// Import all detailed management components
import AICommandsManager from './ai/AICommandsManager';
import AIExecutionsManager from './ai/AIExecutionsManager';
import AIPredictionsManager from './ai/AIPredictionsManager';
import AutomationRulesManager from './ai/AutomationRulesManager';
import AIPerformanceManager from './ai/AIPerformanceManager';
import AITrainingManager from './ai/AITrainingManager';
import AICacheManager from './ai/AICacheManager';
import AIConfigManager from './ai/AIConfigManager';

import ErrorKnowledgeManager from './errors/ErrorKnowledgeManager';
import ErrorMarketDataManager from './errors/ErrorMarketDataManager';
import ErrorDetectionManager from './errors/ErrorDetectionManager';

import StoresManager from './marketplace/StoresManager';
import MarketplaceListingsManager from './marketplace/MarketplaceListingsManager';
import MarketplaceStatsManager from './marketplace/MarketplaceStatsManager';
import AuctionsManager from './marketplace/AuctionsManager';
import TransactionsManager from './marketplace/TransactionsManager';

import ExternalSourcesManager from './data/ExternalSourcesManager';
import ScrapingJobsManager from './data/ScrapingJobsManager';
import DataQualityManager from './data/DataQualityManager';
import GeographicDataManager from './data/GeographicDataManager';
import PriceHistoryManager from './data/PriceHistoryManager';
import DataCacheManager from './data/DataCacheManager';

import AnalyticsEventsManager from './analytics/AnalyticsEventsManager';
import UserAnalyticsManager from './analytics/UserAnalyticsManager';
import SearchAnalyticsManager from './analytics/SearchAnalyticsManager';
import MarketAnalyticsManager from './analytics/MarketAnalyticsManager';

import SystemMetricsManager from './system/SystemMetricsManager';
import PerformanceManager from './system/PerformanceManager';
import SecurityManager from './system/SecurityManager';
import APIKeysManager from './system/APIKeysManager';
import NotificationsManager from './system/NotificationsManager';
import LogsManager from './system/LogsManager';

// Core components
import AdminStatsOverview from '../AdminStatsOverview';
import AdminDatabaseSection from '../sections/AdminDatabaseSection';
import AdminUsersSection from '../AdminUsersSection';
import AdminCoinsSection from '../AdminCoinsSection';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complete Admin System</h1>
          <p className="text-muted-foreground">Full access to all 87 database tables and systems</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {adminData?.users?.total || 0} Users • {adminData?.coins?.total || 0} Coins • {adminData?.system?.ai_commands || 0} AI Commands
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

        {/* AI System Tabs - 8 interfaces */}
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

        {/* Error Detection Tabs - 3 interfaces */}
        <TabsContent value="error-knowledge">
          <ErrorKnowledgeManager />
        </TabsContent>

        <TabsContent value="error-market-data">
          <ErrorMarketDataManager />
        </TabsContent>

        <TabsContent value="error-detection">
          <ErrorDetectionManager />
        </TabsContent>

        {/* Marketplace Tabs - 5 interfaces */}
        <TabsContent value="stores">
          <StoresManager />
        </TabsContent>

        <TabsContent value="marketplace-listings">
          <MarketplaceListingsManager />
        </TabsContent>

        <TabsContent value="marketplace-stats">
          <MarketplaceStatsManager />
        </TabsContent>

        <TabsContent value="auctions">
          <AuctionsManager />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsManager />
        </TabsContent>

        {/* Data Sources Tabs - 6 interfaces */}
        <TabsContent value="external-sources">
          <ExternalSourcesManager />
        </TabsContent>

        <TabsContent value="scraping-jobs">
          <ScrapingJobsManager />
        </TabsContent>

        <TabsContent value="data-quality">
          <DataQualityManager />
        </TabsContent>

        <TabsContent value="geographic-data">
          <GeographicDataManager />
        </TabsContent>

        <TabsContent value="price-history">
          <PriceHistoryManager />
        </TabsContent>

        <TabsContent value="data-cache">
          <DataCacheManager />
        </TabsContent>

        {/* Analytics Tabs - 4 interfaces */}
        <TabsContent value="analytics-events">
          <AnalyticsEventsManager />
        </TabsContent>

        <TabsContent value="user-analytics">
          <UserAnalyticsManager />
        </TabsContent>

        <TabsContent value="search-analytics">
          <SearchAnalyticsManager />
        </TabsContent>

        <TabsContent value="market-analytics">
          <MarketAnalyticsManager />
        </TabsContent>

        {/* System Management Tabs - 6 interfaces */}
        <TabsContent value="system-metrics">
          <SystemMetricsManager />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceManager />
        </TabsContent>

        <TabsContent value="security">
          <SecurityManager />
        </TabsContent>

        <TabsContent value="api-keys">
          <APIKeysManager />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsManager />
        </TabsContent>

        <TabsContent value="logs">
          <LogsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullSystemAdminPanel;
