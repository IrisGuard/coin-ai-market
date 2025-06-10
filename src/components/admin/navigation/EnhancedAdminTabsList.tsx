
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  BarChart3, 
  Settings, 
  Users, 
  Coins, 
  Database, 
  Globe, 
  Key, 
  Bell, 
  TrendingUp, 
  Store,
  CreditCard,
  AlertTriangle,
  Tags
} from 'lucide-react';

const EnhancedAdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1 h-auto p-1">
      <TabsTrigger value="ai-brain" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Brain className="h-4 w-4" />
        <span className="text-xs hidden sm:block">AI Brain</span>
      </TabsTrigger>
      
      <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 p-2 h-auto">
        <BarChart3 className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Analytics</span>
      </TabsTrigger>

      <TabsTrigger value="error-monitoring" className="flex flex-col items-center gap-1 p-2 h-auto">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Errors</span>
      </TabsTrigger>

      <TabsTrigger value="users" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Users className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Users</span>
      </TabsTrigger>

      <TabsTrigger value="coins" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Coins className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Coins</span>
      </TabsTrigger>

      <TabsTrigger value="categories" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Tags className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Categories</span>
      </TabsTrigger>

      <TabsTrigger value="stores" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Store className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Stores</span>
      </TabsTrigger>

      <TabsTrigger value="data-sources" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Database className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Data</span>
      </TabsTrigger>

      <TabsTrigger value="external-sources" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Globe className="h-4 w-4" />
        <span className="text-xs hidden sm:block">External</span>
      </TabsTrigger>

      <TabsTrigger value="api-keys" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Key className="h-4 w-4" />
        <span className="text-xs hidden sm:block">API Keys</span>
      </TabsTrigger>

      <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Bell className="h-4 w-4" />
        <span className="text-xs hidden sm:block">Alerts</span>
      </TabsTrigger>

      <TabsTrigger value="system" className="flex flex-col items-center gap-1 p-2 h-auto">
        <Settings className="h-4 w-4" />
        <span className="text-xs hidden sm:block">System</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default EnhancedAdminTabsList;
