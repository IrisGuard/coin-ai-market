
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ExpandedAdminTabs from './ExpandedAdminTabs';
import SystemInitializer from './SystemInitializer';
import LiveSystemMetrics from './LiveSystemMetrics';

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

// Enhanced AI Brain Dashboard
import EnhancedAIBrainDashboard from '../ai-brain/EnhancedAIBrainDashboard';

// NEW: Moved admin components from Dealer Panel
import ConnectedAIAnalysis from './ai/ConnectedAIAnalysis';
import ConnectedMarketIntelligence from './market/ConnectedMarketIntelligence';
import ConnectedErrorDetection from './error/ConnectedErrorDetection';

// Error & Knowledge components
import ErrorKnowledgeBaseManager from './ErrorKnowledgeBaseManager';
import ErrorMarketDataManager from './ErrorMarketDataManager';
import AdminErrorDetectionSection from '../sections/AdminErrorDetectionSection';

// Marketplace components
import MarketplaceManager from './MarketplaceManager';
import AdminExternalSourcesTab from '../tabs/AdminExternalSourcesTab';
import AuctionBidsManager from './AuctionBidsManager';

// Data Sources components
import ScrapingJobsManager from './ScrapingJobsManager';
import SystemAnalyticsManager from './SystemAnalyticsManager';
import SecurityManager from './SecurityManager';

const FullSystemAdminPanel = () => {
  // 🧠 DEFAULT TO AI BRAIN - THE CENTRAL HUB
  const [activeTab, setActiveTab] = useState('ai-brain');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ExpandedAdminTabs />

          {/* 🧠 AI BRAIN - PRIMARY INTERFACE - NOW AT TOP */}
          <TabsContent value="ai-brain">
            <div className="space-y-6">
              <EnhancedAIBrainDashboard />
            </div>
          </TabsContent>

          {/* Core System Tabs */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <LiveSystemMetrics />
              <AdminStatsOverview />
            </div>
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

          {/* AI System Tabs - Enhanced with moved components */}
          <TabsContent value="ai-commands">
            <div className="space-y-6">
              <AICommandsManager />
              <ConnectedAIAnalysis />
            </div>
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

          {/* Error & Knowledge Management - Enhanced */}
          <TabsContent value="error-knowledge">
            <ErrorKnowledgeBaseManager />
          </TabsContent>

          <TabsContent value="error-market-data">
            <ErrorMarketDataManager />
          </TabsContent>

          <TabsContent value="error-detection">
            <div className="space-y-6">
              <AdminErrorDetectionSection />
              <ConnectedErrorDetection />
            </div>
          </TabsContent>

          {/* Marketplace Management - Enhanced */}
          <TabsContent value="stores">
            <MarketplaceManager />
          </TabsContent>

          <TabsContent value="marketplace-listings">
            <MarketplaceManager />
          </TabsContent>

          <TabsContent value="marketplace-stats">
            <div className="space-y-6">
              <MarketplaceManager />
              <ConnectedMarketIntelligence />
            </div>
          </TabsContent>

          <TabsContent value="auctions">
            <AuctionBidsManager />
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
            <div className="space-y-6">
              <SystemAnalyticsManager />
              <ConnectedMarketIntelligence />
            </div>
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

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <LiveSystemMetrics />
              <SystemInitializer />
              <SystemAnalyticsManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel;
