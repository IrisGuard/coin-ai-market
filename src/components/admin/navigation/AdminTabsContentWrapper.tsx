
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminAIBrainTab from '../tabs/AdminAIBrainTab';
import AdminUsersTab from '../tabs/AdminUsersTab';
import AdminCoinsTab from '../tabs/AdminCoinsTab';
import AdminDataSourcesTab from '../tabs/AdminDataSourcesTab';
import AdminStoreManagementTab from '../tabs/AdminStoreManagementTab';
import EnhancedAdminPriceAggregationTab from '../tabs/EnhancedAdminPriceAggregationTab';
import EnhancedAdminScrapingTab from '../tabs/EnhancedAdminScrapingTab';
import AdminTransactionsTab from '../tabs/AdminTransactionsTab';
import AdminAnalyticsTab from '../tabs/AdminAnalyticsTab';
import AdminErrorCoinsTab from '../tabs/AdminErrorCoinsTab';

const AdminTabsContentWrapper = () => {
  return (
    <>
      <TabsContent value="ai-brain">
        <AdminAIBrainTab />
      </TabsContent>
      
      <TabsContent value="users">
        <AdminUsersTab />
      </TabsContent>
      
      <TabsContent value="coins">
        <AdminCoinsTab />
      </TabsContent>
      
      <TabsContent value="data-sources">
        <AdminDataSourcesTab />
      </TabsContent>
      
      <TabsContent value="tenant-management">
        <AdminStoreManagementTab />
      </TabsContent>

      <TabsContent value="price-aggregation">
        <EnhancedAdminPriceAggregationTab />
      </TabsContent>

      <TabsContent value="scraping">
        <EnhancedAdminScrapingTab />
      </TabsContent>

      <TabsContent value="transactions">
        <AdminTransactionsTab />
      </TabsContent>

      <TabsContent value="analytics">
        <AdminAnalyticsTab />
      </TabsContent>

      <TabsContent value="error-coins">
        <AdminErrorCoinsTab />
      </TabsContent>
    </>
  );
};

export default AdminTabsContentWrapper;
