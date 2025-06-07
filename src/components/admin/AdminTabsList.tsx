
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Coins, 
  Globe, 
  Settings,
  Database
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
      <TabsTrigger value="demo-content" className="flex items-center gap-2">
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">Demo Content</span>
      </TabsTrigger>
      <TabsTrigger value="ai-brain" className="flex items-center gap-2">
        <Brain className="w-4 h-4" />
        <span className="hidden sm:inline">AI Brain</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      <TabsTrigger value="coins" className="flex items-center gap-2">
        <Coins className="w-4 h-4" />
        <span className="hidden sm:inline">Coins</span>
      </TabsTrigger>
      <TabsTrigger value="external-sources" className="flex items-center gap-2">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">Sources</span>
      </TabsTrigger>
      <TabsTrigger value="system" className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">System</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
