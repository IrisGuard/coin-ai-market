
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
  AlertTriangle
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1">
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
      <TabsTrigger value="data-sources" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span className="hidden sm:inline">Sources</span>
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
    </TabsList>
  );
};

export default AdminTabsList;
