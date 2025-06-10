
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Coins, 
  Database, 
  Building2,
  Grid3X3,
  Store,
  TrendingUp,
  Image,
  Activity
} from 'lucide-react';

const EnhancedAdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
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
      <TabsTrigger value="categories" className="flex items-center gap-2">
        <Grid3X3 className="h-4 w-4" />
        Categories
      </TabsTrigger>
      <TabsTrigger value="enhanced-categories" className="flex items-center gap-2">
        <Image className="h-4 w-4" />
        Enhanced Categories
      </TabsTrigger>
      <TabsTrigger value="store-management" className="flex items-center gap-2">
        <Store className="h-4 w-4" />
        Stores
      </TabsTrigger>
      <TabsTrigger value="enhanced-stores" className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Enhanced Stores
      </TabsTrigger>
      <TabsTrigger value="category-analytics" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Analytics
      </TabsTrigger>
    </TabsList>
  );
};

export default EnhancedAdminTabsList;
