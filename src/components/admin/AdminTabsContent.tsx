
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TenantDashboard from '@/components/tenant/TenantDashboard';
import AdminUsersSection from './AdminUsersSection';
import AdminCoinsSection from './AdminCoinsSection';
import AdminSystemSection from './AdminSystemSection';
import AdminDataSourcesSection from './AdminDataSourcesSection';

const AdminTabsContent = () => {
  return (
    <>
      <TabsContent value="ai-brain">
        <AdminSystemSection />
      </TabsContent>
      
      <TabsContent value="users">
        <AdminUsersSection />
      </TabsContent>
      
      <TabsContent value="coins">
        <AdminCoinsSection />
      </TabsContent>
      
      <TabsContent value="data-sources">
        <AdminDataSourcesSection />
      </TabsContent>
      
      <TabsContent value="tenant-management">
        <TenantDashboard />
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
