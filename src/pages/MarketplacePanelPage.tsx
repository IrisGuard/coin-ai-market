
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useMarketplaceStats } from '@/hooks/admin/useAdminSystem';
import { useUserRole } from '@/hooks/marketplace/useUserRole';
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import MarketplacePanelHeader from '@/components/marketplace/MarketplacePanelHeader';
import MarketplaceStatsCards from '@/components/marketplace/MarketplaceStatsCards';
import UserStoresManagement from '@/components/marketplace/UserStoresManagement';
import DealerCoinUploadPanel from '@/components/marketplace/DealerCoinUploadPanel';

const MarketplacePanelPage = () => {
  usePageView();
  
  const { data: stores, isLoading: dealersLoading } = useDealerStores();
  const { data: marketplaceStats } = useMarketplaceStats();
  const { data: userRole } = useUserRole();

  const isDealer = userRole === 'dealer';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketplacePanelHeader 
          title="User Marketplace Panel"
          subtitle="Manage user stores, track performance, and oversee marketplace activity"
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stores">User Stores</TabsTrigger>
            {isDealer && (
              <TabsTrigger value="upload-coins" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Coins
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MarketplaceStatsCards 
              dealersCount={stores?.length || 0}
              registeredUsers={marketplaceStats?.registered_users || 0}
              listedCoins={marketplaceStats?.listed_coins || 0}
            />
          </TabsContent>

          <TabsContent value="stores">
            <UserStoresManagement 
              dealers={stores || []}
              dealersLoading={dealersLoading}
            />
          </TabsContent>

          {isDealer && (
            <TabsContent value="upload-coins">
              <DealerCoinUploadPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePanelPage;
