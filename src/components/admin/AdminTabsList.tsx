
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Bell, 
  BarChart3, 
  Settings, 
  Key,
  Database,
  Shield,
  Globe,
  DollarSign,
  Target
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
      <TabsTrigger value="external-sources" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">External</span>
      </TabsTrigger>
      <TabsTrigger value="price-aggregation" className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <span className="hidden sm:inline">Prices</span>
      </TabsTrigger>
      <TabsTrigger value="error-coins" className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        <span className="hidden sm:inline">Errors</span>
      </TabsTrigger>
      <TabsTrigger value="data-sources" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span className="hidden sm:inline">Sources</span>
      </TabsTrigger>
      <TabsTrigger value="scraping" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
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
        <span className="hidden sm:inline">Trades</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Alerts</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger value="system" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">System</span>
      </TabsTrigger>
      <TabsTrigger value="api-keys" className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline">Keys</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
