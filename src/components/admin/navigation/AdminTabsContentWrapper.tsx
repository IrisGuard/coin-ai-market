
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminUsersTab from '../tabs/AdminUsersTab';
import AdminCoinsTab from '../tabs/AdminCoinsTab';
import AdminApiKeysTab from '../tabs/AdminApiKeysTab';
import AdminAnalyticsTab from '../tabs/AdminAnalyticsTab';
import AdminSystemTab from '../tabs/AdminSystemTab';
import AdminProfileTab from '../tabs/AdminProfileTab';
import AdminAIBrainTab from '../tabs/AdminAIBrainTab';
import AdminDataSourcesTab from '../tabs/AdminDataSourcesTab';
import AdminScrapingTab from '../tabs/AdminScrapingTab';
import AdminExternalSourcesTab from '../tabs/AdminExternalSourcesTab';
import AdminPriceAggregationTab from '../tabs/AdminPriceAggregationTab';
import AdminErrorMonitoringTab from '../tabs/AdminErrorMonitoringTab';
import AdminErrorCoinsTab from '../tabs/AdminErrorCoinsTab';
import AdminNotificationsTab from '../tabs/AdminNotificationsTab';
import AdminTransactionsTab from '../tabs/AdminTransactionsTab';
import AdminCategoriesTab from '../tabs/AdminCategoriesTab';
import AdminStoreManagementTab from '../tabs/AdminStoreManagementTab';

const AdminTabsContentWrapper = () => {
  return (
    <div className="mt-6">
      <TabsContent value="ai-brain" className="space-y-4">
        <AdminAIBrainTab />
      </TabsContent>
      
      <TabsContent value="profile" className="space-y-4">
        <AdminProfileTab />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <AdminUsersTab />
      </TabsContent>
      
      <TabsContent value="coins" className="space-y-4">
        <AdminCoinsTab />
      </TabsContent>

      <TabsContent value="error-coins" className="space-y-4">
        <AdminErrorCoinsTab />
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <AdminCategoriesTab />
      </TabsContent>

      <TabsContent value="store-management" className="space-y-4">
        <AdminStoreManagementTab />
      </TabsContent>
      
      <TabsContent value="data-sources" className="space-y-4">
        <AdminDataSourcesTab />
      </TabsContent>

      <TabsContent value="external-sources" className="space-y-4">
        <AdminExternalSourcesTab />
      </TabsContent>

      <TabsContent value="scraping" className="space-y-4">
        <AdminScrapingTab />
      </TabsContent>

      <TabsContent value="price-aggregation" className="space-y-4">
        <AdminPriceAggregationTab />
      </TabsContent>
      
      <TabsContent value="api-keys" className="space-y-4">
        <AdminApiKeysTab />
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-4">
        <AdminAnalyticsTab />
      </TabsContent>

      <TabsContent value="error-monitoring" className="space-y-4">
        <AdminErrorMonitoringTab />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <AdminNotificationsTab />
      </TabsContent>

      <TabsContent value="transactions" className="space-y-4">
        <AdminTransactionsTab />
      </TabsContent>
      
      <TabsContent value="system" className="space-y-4">
        <AdminSystemTab />
      </TabsContent>
    </div>
  );
};

export default AdminTabsContentWrapper;
