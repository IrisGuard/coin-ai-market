
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Store, Coins, Grid3X3, Upload } from 'lucide-react';
import DealerOverview from './DealerOverview';
import DealerStoreManagement from './DealerStoreManagement';
import DealerCoinManagement from './DealerCoinManagement';
import DealerCategoriesGrid from './DealerCategoriesGrid';
import DealerUploadManager from './DealerUploadManager';
import AdminPanelButton from './AdminPanelButton';

const SimpleDealerPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <AdminPanelButton />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏪 Dealer Panel
          </h1>
          <p className="text-gray-600">
            Complete marketplace management with AI-powered tools
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-16 bg-white shadow-lg rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col items-center gap-1 h-14 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs font-medium">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stores" 
              className="flex flex-col items-center gap-1 h-14 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Store className="h-5 w-5" />
              <span className="text-xs font-medium">Stores</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coins" 
              className="flex flex-col items-center gap-1 h-14 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              <Coins className="h-5 w-5" />
              <span className="text-xs font-medium">Coins</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex flex-col items-center gap-1 h-14 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Grid3X3 className="h-5 w-5" />
              <span className="text-xs font-medium">Categories</span>
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="flex flex-col items-center gap-1 h-14 data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs font-medium">Upload</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DealerOverview />
          </TabsContent>

          <TabsContent value="stores">
            <DealerStoreManagement />
          </TabsContent>

          <TabsContent value="coins">
            <DealerCoinManagement />
          </TabsContent>

          <TabsContent value="categories">
            <DealerCategoriesGrid />
          </TabsContent>

          <TabsContent value="upload">
            <DealerUploadManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimpleDealerPanel;
