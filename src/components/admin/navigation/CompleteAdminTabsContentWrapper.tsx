
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminAIBrainTab from '../tabs/AdminAIBrainTab';
import AdminAnalyticsTab from '../tabs/AdminAnalyticsTab';
import AdminErrorMonitoringTab from '../tabs/AdminErrorMonitoringTab';
import AdminUsersTab from '../tabs/AdminUsersTab';
import AdminCoinsTab from '../tabs/AdminCoinsTab';
import AdminCategoriesTab from '../tabs/AdminCategoriesTab';
import AdminStoreManagementTab from '../tabs/AdminStoreManagementTab';
import AdminDataSourcesTab from '../tabs/AdminDataSourcesTab';
import AdminExternalSourcesTab from '../tabs/AdminExternalSourcesTab';
import AdminApiKeysTab from '../tabs/AdminApiKeysTab';
import AdminNotificationsTab from '../tabs/AdminNotificationsTab';
import AdminSystemTab from '../tabs/AdminSystemTab';
import AdminProfileTab from '../tabs/AdminProfileTab';
import AdminScrapingTab from '../tabs/AdminScrapingTab';
import AdminPriceAggregationTab from '../tabs/AdminPriceAggregationTab';
import EnhancedAdminTransactionsTab from '../tabs/enhanced/EnhancedAdminTransactionsTab';
import AdminPaymentManagementTab from '../tabs/AdminPaymentManagementTab';
import AdminSecurityAuditTab from '../tabs/AdminSecurityAuditTab';
import AdminBulkOperationsTab from '../tabs/AdminBulkOperationsTab';
import AdminMonitoringDashboardTab from '../tabs/AdminMonitoringDashboardTab';

const CompleteAdminTabsContentWrapper = () => {
  return (
    <>
      <TabsContent value="ai-brain" className="space-y-6">
        <AdminAIBrainTab />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <AdminAnalyticsTab />
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-6">
        <AdminMonitoringDashboardTab />
      </TabsContent>

      <TabsContent value="error-monitoring" className="space-y-6">
        <AdminErrorMonitoringTab />
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <AdminUsersTab />
      </TabsContent>

      <TabsContent value="coins" className="space-y-6">
        <AdminCoinsTab />
      </TabsContent>

      <TabsContent value="categories" className="space-y-6">
        <AdminCategoriesTab />
      </TabsContent>

      <TabsContent value="stores" className="space-y-6">
        <AdminStoreManagementTab />
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <EnhancedAdminTransactionsTab />
      </TabsContent>

      <TabsContent value="payments" className="space-y-6">
        <AdminPaymentManagementTab />
      </TabsContent>

      <TabsContent value="bulk-operations" className="space-y-6">
        <AdminBulkOperationsTab />
      </TabsContent>

      <TabsContent value="data-sources" className="space-y-6">
        <AdminDataSourcesTab />
      </TabsContent>

      <TabsContent value="external-sources" className="space-y-6">
        <AdminExternalSourcesTab />
      </TabsContent>

      <TabsContent value="scraping" className="space-y-6">
        <AdminScrapingTab />
      </TabsContent>

      <TabsContent value="price-aggregation" className="space-y-6">
        <AdminPriceAggregationTab />
      </TabsContent>

      <TabsContent value="api-keys" className="space-y-6">
        <AdminApiKeysTab />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <AdminSecurityAuditTab />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <AdminNotificationsTab />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <AdminProfileTab />
      </TabsContent>

      <TabsContent value="system" className="space-y-6">
        <AdminSystemTab />
      </TabsContent>
    </>
  );
};

export default CompleteAdminTabsContentWrapper;
