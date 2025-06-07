
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminAIBrainTab from './tabs/AdminAIBrainTab';
import AdminExternalSourcesTab from './tabs/AdminExternalSourcesTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import DemoContentManager from './DemoContentManager';

const AdminTabsContent = () => {
  return (
    <>
      <TabsContent value="demo-content" className="space-y-6">
        <DemoContentManager />
      </TabsContent>

      <TabsContent value="ai-brain" className="space-y-6">
        <AdminAIBrainTab />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-6">
        <AdminUsersTab />
      </TabsContent>
      
      <TabsContent value="coins" className="space-y-6">
        <AdminCoinsTab />
      </TabsContent>
      
      <TabsContent value="external-sources" className="space-y-6">
        <AdminExternalSourcesTab />
      </TabsContent>
      
      <TabsContent value="system" className="space-y-6">
        <AdminSystemTab />
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
