
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

const AdminTabsContentWrapper = () => {
  return (
    <>
      <TabsContent value="ai-brain" className="space-y-6">
        <AdminAIBrainTab />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <AdminAnalyticsTab />
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

      <TabsContent value="data-sources" className="space-y-6">
        <AdminDataSourcesTab />
      </TabsContent>

      <TabsContent value="external-sources" className="space-y-6">
        <AdminExternalSourcesTab />
      </TabsContent>

      <TabsContent value="api-keys" className="space-y-6">
        <AdminApiKeysTab />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <AdminNotificationsTab />
      </TabsContent>

      <TabsContent value="system" className="space-y-6">
        <AdminSystemTab />
      </TabsContent>
    </>
  );
};

export default AdminTabsContentWrapper;
