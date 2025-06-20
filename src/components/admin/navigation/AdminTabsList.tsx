
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, Users, Coins, Store, Wallet, Shield, 
  CreditCard, Package, Gavel, Database, Activity
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 mb-8">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      
      <TabsTrigger value="users" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      
      <TabsTrigger value="coins" className="flex items-center gap-2">
        <Coins className="w-4 h-4" />
        <span className="hidden sm:inline">Coins</span>
      </TabsTrigger>
      
      <TabsTrigger value="stores" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <Store className="w-4 h-4" />
        <span className="hidden sm:inline">Stores</span>
        <Badge className="bg-green-600 text-white ml-1">UNLIMITED</Badge>
      </TabsTrigger>

      <TabsTrigger value="dealer-panel" className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <Package className="w-4 h-4" />
        <span className="hidden sm:inline">Dealer Panel</span>
        <Badge className="bg-orange-600 text-white ml-1">LIVE</Badge>
      </TabsTrigger>
      
      <TabsTrigger value="wallet" className="flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Wallet</span>
      </TabsTrigger>
      
      <TabsTrigger value="payments" className="flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        <span className="hidden sm:inline">Payments</span>
      </TabsTrigger>
      
      <TabsTrigger value="security" className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
      
      <TabsTrigger value="bulk-ops" className="flex items-center gap-2">
        <Package className="w-4 h-4" />
        <span className="hidden sm:inline">Bulk Ops</span>
      </TabsTrigger>
      
      <TabsTrigger value="auctions" className="flex items-center gap-2">
        <Gavel className="w-4 h-4" />
        <span className="hidden sm:inline">Auctions</span>
      </TabsTrigger>
      
      <TabsTrigger value="scraping" className="flex items-center gap-2">
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">Data</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsList;
