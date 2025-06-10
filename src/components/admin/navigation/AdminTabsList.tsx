
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Coins, 
  Database, 
  Building2,
  DollarSign,
  Bot,
  CreditCard,
  BarChart3,
  AlertTriangle,
  User,
  Key,
  Bell,
  Settings,
  Grid3X3,
  Globe
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-5 lg:grid-cols-16 gap-1">
      <TabsTrigger value="ai-brain" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        <span className="hidden sm:inline">AI Brain</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      <TabsTrigger value="coins" className="flex items-center gap-2">
        <Coins className="h-4 w-4" />
        <span className="hidden sm:inline">Coins</span>
      </TabsTrigger>
      <TabsTrigger value="categories" className="flex items-center gap-2">
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">Categories</span>
      </TabsTrigger>
      <TabsTrigger value="data-sources" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span className="hidden sm:inline">Sources</span>
      </TabsTrigger>
      <TabsTrigger value="external-sources" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">External</span>
      </TabsTrigger>
      <TabsTrigger value="tenant-management" className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        <span className="hidden sm:inline">Stores</span>
      </TabsTrigger>
      <TabsTrigger value="price-aggregation" className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <span className="hidden sm:inline">Pricing</span>
      </TabsTrigger>
      <TabsTrigger value="scraping" className="flex items-center gap-2">
        <Bot className="h-4 w-4" />
        <span className="hidden sm:inline">Scraping</span>
      </TabsTrigger>
      <TabsTrigger value="transactions" className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        <span className="hidden sm:inline">Payments</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger value="error-coins" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="hidden sm:inline">Errors</span>
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>
      <TabsTrigger value="api-keys" className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline">API Keys</span>
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Notifications</span>
      </TabsTrigger>
      <TabsTrigger value="system" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">System</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
