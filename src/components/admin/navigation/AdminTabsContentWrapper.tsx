
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminAIBrainTab from '../tabs/AdminAIBrainTab';
import AdminProfileTab from '../tabs/AdminProfileTab';
import AdminUsersTab from '../tabs/AdminUsersTab';
import AdminCoinsTab from '../tabs/AdminCoinsTab';
import AdminErrorCoinsTab from '../tabs/AdminErrorCoinsTab';
import AdminCategoriesTab from '../tabs/AdminCategoriesTab';
import AdminStoreManagementTab from '../tabs/AdminStoreManagementTab';
import AdminDataSourcesTab from '../tabs/AdminDataSourcesTab';
import AdminExternalSourcesTab from '../tabs/AdminExternalSourcesTab';
import AdminScrapingTab from '../tabs/AdminScrapingTab';
import AdminPriceAggregationTab from '../tabs/AdminPriceAggregationTab';
import AdminApiKeysTab from '../tabs/AdminApiKeysTab';
import AdminAnalyticsTab from '../tabs/AdminAnalyticsTab';
import AdminErrorMonitoringTab from '../tabs/AdminErrorMonitoringTab';
import AdminNotificationsTab from '../tabs/AdminNotificationsTab';
import AdminTransactionsTab from '../tabs/AdminTransactionsTab';
import AdminSystemTab from '../tabs/AdminSystemTab';
import EnhancedCategoryManager from '../enhanced/EnhancedCategoryManager';
import EnhancedStoreManager from '../enhanced/EnhancedStoreManager';
import CategoryAnalyticsDashboard from '../enhanced/CategoryAnalyticsDashboard';

const AdminTabsContentWrapper = () => {
  return (
    <>
      <TabsContent value="ai-brain">
        <AdminAIBrainTab />
      </TabsContent>

      <TabsContent value="profile">
        <AdminProfileTab />
      </TabsContent>

      <TabsContent value="users">
        <AdminUsersTab />
      </TabsContent>

      <TabsContent value="coins">
        <AdminCoinsTab />
      </TabsContent>

      <TabsContent value="error-coins">
        <AdminErrorCoinsTab />
      </TabsContent>

      <TabsContent value="categories">
        <AdminCategoriesTab />
      </TabsContent>

      <TabsContent value="enhanced-categories">
        <EnhancedCategoryManager />
      </TabsContent>

      <TabsContent value="store-management">
        <AdminStoreManagementTab />
      </TabsContent>

      <TabsContent value="enhanced-stores">
        <EnhancedStoreManager />
      </TabsContent>

      <TabsContent value="category-analytics">
        <CategoryAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="data-sources">
        <AdminDataSourcesTab />
      </TabsContent>

      <TabsContent value="external-sources">
        <AdminExternalSourcesTab />
      </TabsContent>

      <TabsContent value="scraping">
        <AdminScrapingTab />
      </TabsContent>

      <TabsContent value="price-aggregation">
        <AdminPriceAggregationTab />
      </TabsContent>

      <TabsContent value="api-keys">
        <AdminApiKeysTab />
      </TabsContent>

      <TabsContent value="analytics">
        <AdminAnalyticsTab />
      </TabsContent>

      <TabsContent value="error-monitoring">
        <AdminErrorMonitoringTab />
      </TabsContent>

      <TabsContent value="notifications">
        <AdminNotificationsTab />
      </TabsContent>

      <TabsContent value="transactions">
        <AdminTransactionsTab />
      </TabsContent>

      <TabsContent value="system">
        <AdminSystemTab />
      </TabsContent>
    </>
  );
};

export default AdminTabsContentWrapper;
