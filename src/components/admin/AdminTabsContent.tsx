
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminTransactionsTab from './tabs/AdminTransactionsTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminErrorMonitoringTab from './tabs/AdminErrorMonitoringTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';
import AdminDataSourcesTab from './tabs/AdminDataSourcesTab';
import AdminScrapingTab from './tabs/AdminScrapingTab';
import AdminExternalSourcesTab from './tabs/AdminExternalSourcesTab';
import AdminPriceAggregationTab from './tabs/AdminPriceAggregationTab';
import AdminErrorCoinsTab from './tabs/AdminErrorCoinsTab';
import AdminAIBrainTab from './tabs/AdminAIBrainTab';

const AdminTabsContent = () => {
  return (
    <>
      <TabsContent value="ai-brain">
        <AdminAIBrainTab />
      </TabsContent>

      <TabsContent value="external-sources">
        <AdminExternalSourcesTab />
      </TabsContent>

      <TabsContent value="price-aggregation">
        <AdminPriceAggregationTab />
      </TabsContent>

      <TabsContent value="error-coins">
        <AdminErrorCoinsTab />
      </TabsContent>

      <TabsContent value="data-sources">
        <AdminDataSourcesTab />
      </TabsContent>

      <TabsContent value="scraping">
        <AdminScrapingTab />
      </TabsContent>

      <TabsContent value="users">
        <AdminUsersTab />
      </TabsContent>

      <TabsContent value="coins">
        <AdminCoinsTab />
      </TabsContent>

      <TabsContent value="transactions">
        <AdminTransactionsTab />
      </TabsContent>

      <TabsContent value="notifications">
        <AdminNotificationsTab />
      </TabsContent>

      <TabsContent value="analytics">
        <AdminAnalyticsTab />
      </TabsContent>

      <TabsContent value="system">
        <AdminSystemTab />
      </TabsContent>

      <TabsContent value="api-keys">
        <AdminApiKeysTab />
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
