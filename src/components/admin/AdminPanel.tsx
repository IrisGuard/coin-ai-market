
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminUsers, useMarketplaceStats } from '@/hooks/useAdminData';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminTransactionsTab from './tabs/AdminTransactionsTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminErrorMonitoringTab from './tabs/AdminErrorMonitoringTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';
import AdminDataSourcesTab from './tabs/AdminDataSourcesTab';
import AdminScrapingTab from './tabs/AdminScrapingTab';
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Bell, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  Key,
  Database,
  Shield,
  X,
  Globe
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const { data: users } = useAdminUsers();
  const { data: stats } = useMarketplaceStats();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              CoinVision AI Admin Panel
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-4 w-4 mr-1" />
              VPN Protected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.registered_users || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{users?.filter(u => new Date(u.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length || 0} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Listed Coins</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.listed_coins || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.active_auctions || 0} active auctions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.total_volume || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.weekly_transactions || 0} transactions this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  Active data streams
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="data-sources" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
              <TabsTrigger value="data-sources" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data Sources</span>
              </TabsTrigger>
              <TabsTrigger value="scraping" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Scraping</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="coins" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                <span className="hidden sm:inline">Coins</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
              <TabsTrigger value="errors" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Errors</span>
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">API Keys</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="data-sources">
              <AdminDataSourcesTab />
            </TabsContent>

            <TabsContent value="scraping">
              <AdminScrapingTab />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsersTab />
            </TabsContent>

            <TabsContent value="coins">
              <AdminCoinsTab />
            </TabsContent>

            <TabsContent value="transactions">
              <AdminTransactionsTab />
            </TabsContent>

            <TabsContent value="notifications">
              <AdminNotificationsTab />
            </TabsContent>

            <TabsContent value="analytics">
              <AdminAnalyticsTab />
            </TabsContent>

            <TabsContent value="system">
              <AdminSystemTab />
            </TabsContent>

            <TabsContent value="errors">
              <AdminErrorMonitoringTab />
            </TabsContent>

            <TabsContent value="api-keys">
              <AdminApiKeysTab />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
