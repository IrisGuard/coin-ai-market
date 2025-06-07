
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Coins, 
  Database, 
  Building2
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="ai-brain" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        AI Brain
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Users
      </TabsTrigger>
      <TabsTrigger value="coins" className="flex items-center gap-2">
        <Coins className="h-4 w-4" />
        Coins
      </TabsTrigger>
      <TabsTrigger value="data-sources" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        Data Sources
      </TabsTrigger>
      <TabsTrigger value="tenant-management" className="flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        Marketplaces
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
