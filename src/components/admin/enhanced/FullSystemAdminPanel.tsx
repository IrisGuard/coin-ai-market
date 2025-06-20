import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ExpandedAdminTabs from './ExpandedAdminTabs';

// Import all existing tabs
import AdminOverviewTab from '@/components/admin/tabs/AdminOverviewTab';
import AdminOpenStoreTab from '@/components/admin/tabs/AdminOpenStoreTab';
import AdminCleanupTab from '@/components/admin/tabs/AdminCleanupTab';

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('open-store');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-[95vw] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧠 Complete Admin System
          </h1>
          <p className="text-gray-600">
            Full AI-powered marketplace management with unlimited store creation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ExpandedAdminTabs />
          
          {/* Store Management */}
          <TabsContent value="open-store">
            <AdminOpenStoreTab />
          </TabsContent>
          
          <TabsContent value="cleanup">
            <AdminCleanupTab />
          </TabsContent>

          {/* Core Tabs */}
          <TabsContent value="overview">
            <AdminOverviewTab />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="coins">
            <AdminCoinsTab />
          </TabsContent>

          <TabsContent value="ai-brain">
            <AdminAIBrainTab />
          </TabsContent>

          <TabsContent value="security">
            <AdminSecurityTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsTab />
          </TabsContent>

          <TabsContent value="system-phases">
            <AdminSystemPhasesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel;
