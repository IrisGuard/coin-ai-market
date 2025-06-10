
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminProfileTab from './tabs/AdminProfileTab';

const AdminTabsContent = () => {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="coins">Coins</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <AdminProfileTab />
      </TabsContent>
      
      <TabsContent value="users">
        <AdminUsersTab />
      </TabsContent>
      
      <TabsContent value="coins">
        <AdminCoinsTab />
      </TabsContent>
      
      <TabsContent value="api-keys">
        <AdminApiKeysTab />
      </TabsContent>
      
      <TabsContent value="analytics">
        <AdminAnalyticsTab />
      </TabsContent>
      
      <TabsContent value="system">
        <AdminSystemTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContent;
