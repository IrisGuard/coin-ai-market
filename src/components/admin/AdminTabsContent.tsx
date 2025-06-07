
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TenantDashboard from '@/components/tenant/TenantDashboard';
import LiveAdminUsersSection from './LiveAdminUsersSection';
import LiveAdminCoinsSection from './LiveAdminCoinsSection';
import AdminSystemSection from './AdminSystemSection';
import LiveExternalSourcesSection from './LiveExternalSourcesSection';

const AdminTabsContent = () => {
  return (
    <>
      <TabsContent value="ai-brain">
        <AdminSystemSection />
      </TabsContent>
      
      <TabsContent value="users">
        <LiveAdminUsersSection />
      </TabsContent>
      
      <TabsContent value="coins">
        <LiveAdminCoinsSection />
      </TabsContent>
      
      <TabsContent value="data-sources">
        <LiveExternalSourcesSection />
      </TabsContent>
      
      <TabsContent value="tenant-management">
        <TenantDashboard />
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
