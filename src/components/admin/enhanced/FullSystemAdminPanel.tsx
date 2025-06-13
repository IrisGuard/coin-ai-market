
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ExpandedAdminTabs from './ExpandedAdminTabs';
import { useComprehensiveAdminData } from '@/hooks/useComprehensiveAdminData';

// Import existing detailed management components
import AICommandsManager from './ai/AICommandsManager';
import AIExecutionsManager from './ai/AIExecutionsManager';
import AIPredictionsManager from './ai/AIPredictionsManager';

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

  // Safely extract data with proper type checking
  const safeAdminData = adminData && typeof adminData === 'object' && !Array.isArray(adminData) ? adminData as any : {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complete Admin System</h1>
          <p className="text-muted-foreground">Full access to all 87 database tables and systems</p>
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

        {/* AI System Tabs - 3 interfaces */}
        <TabsContent value="ai-commands">
          <AICommandsManager />
        </TabsContent>

        <TabsContent value="ai-executions">
          <AIExecutionsManager />
        </TabsContent>

        <TabsContent value="ai-predictions">
          <AIPredictionsManager />
        </TabsContent>

        {/* For other tabs, show placeholder content until components are created */}
        <TabsContent value="automation-rules">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Automation Rules Manager</h2>
            <p>Coming soon - Full automation rules management interface</p>
          </div>
        </TabsContent>

        <TabsContent value="ai-performance">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Performance Manager</h2>
            <p>Coming soon - AI performance monitoring and analytics</p>
          </div>
        </TabsContent>

        <TabsContent value="ai-training">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Training Manager</h2>
            <p>Coming soon - AI model training and management</p>
          </div>
        </TabsContent>

        <TabsContent value="ai-cache">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Cache Manager</h2>
            <p>Coming soon - AI recognition cache management</p>
          </div>
        </TabsContent>

        <TabsContent value="ai-config">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Configuration</h2>
            <p>Coming soon - AI system configuration</p>
          </div>
        </TabsContent>

        {/* Error Detection Tabs */}
        <TabsContent value="error-knowledge">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Error Knowledge Manager</h2>
            <p>Coming soon - Error coin knowledge base management</p>
          </div>
        </TabsContent>

        <TabsContent value="error-market-data">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Error Market Data</h2>
            <p>Coming soon - Error coin market data analysis</p>
          </div>
        </TabsContent>

        <TabsContent value="error-detection">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Error Detection</h2>
            <p>Coming soon - Error detection system</p>
          </div>
        </TabsContent>

        {/* Add placeholder content for all other tabs */}
        {[
          'stores', 'marketplace-listings', 'marketplace-stats', 'auctions', 'transactions',
          'external-sources', 'scraping-jobs', 'data-quality', 'geographic-data', 'price-history', 'data-cache',
          'analytics-events', 'user-analytics', 'search-analytics', 'market-analytics',
          'system-metrics', 'performance', 'security', 'api-keys', 'notifications', 'logs'
        ].map(tabId => (
          <TabsContent key={tabId} value={tabId}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 capitalize">
                {tabId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              <p>Coming soon - Full {tabId.replace('-', ' ')} management interface</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FullSystemAdminPanel;
