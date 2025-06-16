
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Upload, Wallet, Receipt, BarChart3, Settings, TrendingUp } from 'lucide-react';

import DealerCoinsList from './DealerCoinsList';
import WalletManagementTab from './WalletManagementTab';
import DealerSubscriptionUpgrade from './DealerSubscriptionUpgrade';
import TransactionHistory from './TransactionHistory';
import AdvancedDealerUploadPanelRefactored from './AdvancedDealerUploadPanelRefactored';
import StoreCustomizationSection from './StoreCustomizationSection';
import { useAdminStore } from '@/contexts/AdminStoreContext';

const EnhancedDealerPanel = () => {
  const { user } = useAuth();
  const { isAdminUser } = useAdminStore();
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdminUser ? 'Admin Dealer Panel' : 'Dealer Panel'}
            </h1>
            <p className="text-gray-600">
              {isAdminUser ? 'Manage multiple coin stores and inventory (Admin Mode)' : 'Manage your coin store and inventory'}
            </p>
          </div>
        </div>
        <Badge className={`${isAdminUser ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
          {isAdminUser ? 'Admin Multi-Store Dashboard' : 'Enhanced Dashboard'}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            My Inventory
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {isAdminUser ? 'Store Manager' : 'Upgrade'}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Store Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <AdvancedDealerUploadPanelRefactored />
        </TabsContent>

        <TabsContent value="inventory">
          <DealerCoinsList />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletManagementTab />
        </TabsContent>

        <TabsContent value="upgrade">
          {isAdminUser ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-6 w-6" />
                  Admin Store Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  As an admin, you can create and manage multiple stores. Use the Upload tab to manage store-specific operations.
                </p>
                <Button onClick={() => setActiveTab('upload')} className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Go to Store Management
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DealerSubscriptionUpgrade />
          )}
        </TabsContent>

        <TabsContent value="settings">
          <StoreCustomizationSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDealerPanel;
