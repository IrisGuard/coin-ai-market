
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="users">Users</TabsTrigger>
      <TabsTrigger value="coins">Coins</TabsTrigger>
      <TabsTrigger value="ai-brain">AI Brain</TabsTrigger>
      <TabsTrigger value="security">Security</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="api-keys">API Keys</TabsTrigger>
      <TabsTrigger value="auctions">Auctions</TabsTrigger>
      <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
      <TabsTrigger value="logs">Logs</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
