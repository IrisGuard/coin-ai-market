
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Coins, 
  Brain, 
  Shield, 
  Key, 
  Gavel, 
  Store, 
  Bell, 
  FileText, 
  Settings,
  User
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1">
      <TabsTrigger 
        value="overview" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="users" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="coins" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Coins className="h-4 w-4" />
        <span className="hidden sm:inline">Coins</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ai-brain" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Brain className="h-4 w-4" />
        <span className="hidden sm:inline">AI Brain</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="security" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="analytics" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="api-keys" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline">API Keys</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="auctions" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Gavel className="h-4 w-4" />
        <span className="hidden sm:inline">Auctions</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="marketplace" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Store className="h-4 w-4" />
        <span className="hidden sm:inline">Marketplace</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="notifications" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Notifications</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="logs" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Logs</span>
      </TabsTrigger>

      <TabsTrigger 
        value="profile" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="settings" 
        className="flex items-center gap-2 text-xs lg:text-sm"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
