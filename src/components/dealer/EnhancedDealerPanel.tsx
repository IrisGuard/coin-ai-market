import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Upload, Wallet, Receipt, BarChart3, Settings, TrendingUp } from 'lucide-react';

import DealerCoinsList from './DealerCoinsList';
import WalletManagementTab from './WalletManagementTab';
import DealerSubscriptionUpgrade from './DealerSubscriptionUpgrade';
import TransactionHistory from './TransactionHistory';
import AdvancedDealerUploadPanelRefactored from './AdvancedDealerUploadPanelRefactored';

const EnhancedDealerPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dealer Panel</h1>
            <p className="text-gray-600">Manage your coin store and inventory</p>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Enhanced Dashboard
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
            Upgrade
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
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
          <DealerSubscriptionUpgrade />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Store configuration and preferences will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDealerPanel;
