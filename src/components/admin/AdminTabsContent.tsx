
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminProfileTab from './tabs/AdminProfileTab';
import AdminAIBrainTab from './tabs/AdminAIBrainTab';
import AdminDataSourcesTab from './tabs/AdminDataSourcesTab';
import AdminScrapingTab from './tabs/AdminScrapingTab';
import AdminExternalSourcesTab from './tabs/AdminExternalSourcesTab';
import AdminPriceAggregationTab from './tabs/AdminPriceAggregationTab';
import AdminErrorMonitoringTab from './tabs/AdminErrorMonitoringTab';
import AdminErrorCoinsTab from './tabs/AdminErrorCoinsTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminTransactionsTab from './tabs/AdminTransactionsTab';
import { 
  Brain,
  Users, 
  Coins, 
  Key,
  BarChart3,
  Settings,
  User,
  Database,
  Globe,
  Zap,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  Bell,
  CreditCard
} from 'lucide-react';

const AdminTabsContent = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="ai-brain" className="space-y-6">
        <div className="border-b">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none bg-transparent p-0 w-max">
              <TabsTrigger 
                value="ai-brain" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Brain className="h-4 w-4" />
                AI Brain
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="coins" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Coins className="h-4 w-4" />
                Coins
              </TabsTrigger>
              <TabsTrigger 
                value="error-coins" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <AlertCircle className="h-4 w-4" />
                Error Coins
              </TabsTrigger>
              <TabsTrigger 
                value="data-sources" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Database className="h-4 w-4" />
                Data Sources
              </TabsTrigger>
              <TabsTrigger 
                value="external-sources" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Globe className="h-4 w-4" />
                External Sources
              </TabsTrigger>
              <TabsTrigger 
                value="scraping" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Zap className="h-4 w-4" />
                Scraping
              </TabsTrigger>
              <TabsTrigger 
                value="price-aggregation" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <DollarSign className="h-4 w-4" />
                Price Aggregation
              </TabsTrigger>
              <TabsTrigger 
                value="api-keys" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="error-monitoring" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <AlertTriangle className="h-4 w-4" />
                Error Monitoring
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <CreditCard className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
              >
                <Settings className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>
        
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
      </Tabs>
    </div>
  );
};

export default AdminTabsContent;
