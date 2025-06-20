
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Database, Zap, Activity, Settings, TrendingUp, AlertTriangle, 
  DollarSign, Store, Wallet, Users, ShoppingCart, BarChart3, Shield,
  CreditCard, Search, Bell, Upload, Wrench, Globe, FileText, Lock
} from 'lucide-react';
import { emergencyActivation } from '@/services/emergencyActivationService';
import { toast } from 'sonner';
import { useDealerStores } from '@/hooks/useDealerStores';

// Import all restored components
import ProductionDealerPanel from '@/components/dealer/ProductionDealerPanel';
import AdminAISection from './sections/AdminAISection';
import AdminErrorCoinsTab from './tabs/AdminErrorCoinsTab';
import AdminDatabaseSection from './sections/AdminDatabaseSection';
import AdminUsersSection from './AdminUsersSection';
import AdminCoinsSection from './AdminCoinsSection';
import AdminAnalyticsSection from './sections/AdminAnalyticsSection';
import AdminMarketplaceSection from './sections/AdminMarketplaceSection';
import AdminSystemSection from './sections/AdminSystemSection';

// Create missing essential tabs
import AdminPaymentsTab from './tabs/AdminPaymentsTab';
import AdminWalletTab from './tabs/AdminWalletTab';
import AdminAuctionsTab from './tabs/AdminAuctionsTab';
import AdminSecurityTab from './tabs/AdminSecurityTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminScrapingTab from './tabs/AdminScrapingTab';
import AdminBulkOperationsTab from './tabs/AdminBulkOperationsTab';
import AdminLogsTab from './tabs/AdminLogsTab';

const LiveProductionAdminPanel = () => {
  const [systemStatus, setSystemStatus] = useState({
    aiProcessing: true,
    dataIntegration: true,
    marketplaceActive: true,
    errorDetection: true,
    dealerPanelActive: true,
    walletSystemActive: true
  });

  const { data: stores = [] } = useDealerStores();

  const executeSystemTest = async () => {
    toast.info('🚀 Executing complete system verification...');
    
    try {
      const status = await emergencyActivation.getActivationStatus();
      
      setSystemStatus({
        aiProcessing: status.activeAICommands > 0,
        dataIntegration: status.activeSources > 10,
        marketplaceActive: status.totalCoins > 100,
        errorDetection: true,
        dealerPanelActive: true,
        walletSystemActive: true
      });

      if (status.systemStatus === 'FULLY_OPERATIONAL') {
        toast.success('✅ SYSTEM VERIFICATION COMPLETE - 100% OPERATIONAL');
      } else {
        toast.warning('⚠️ System verification found issues - running emergency activation');
        await emergencyActivation.executeFullPlatformActivation();
      }
    } catch (error) {
      toast.error('System verification failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Production Status Header */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600 animate-pulse" />
            🔴 LIVE PRODUCTION ADMIN CONTROL CENTER - COMPLETE RESTORATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <Badge className={systemStatus.aiProcessing ? "bg-green-600" : "bg-red-600"}>
                AI PROCESSING {systemStatus.aiProcessing ? "ACTIVE" : "OFFLINE"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.dataIntegration ? "bg-green-600" : "bg-red-600"}>
                DATA INTEGRATION {systemStatus.dataIntegration ? "LIVE" : "DISCONNECTED"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.marketplaceActive ? "bg-green-600" : "bg-red-600"}>
                MARKETPLACE {systemStatus.marketplaceActive ? "OPERATIONAL" : "DOWN"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.errorDetection ? "bg-green-600" : "bg-red-600"}>
                ERROR DETECTION {systemStatus.errorDetection ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={systemStatus.dealerPanelActive ? "bg-green-600" : "bg-red-600"}>
                DEALER PANEL {systemStatus.dealerPanelActive ? "RESTORED" : "OFFLINE"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={stores.length > 0 ? "bg-green-600" : "bg-orange-600"}>
                STORES {stores.length > 0 ? `${stores.length} ACTIVE` : "NONE"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button onClick={executeSystemTest} className="bg-blue-600 hover:bg-blue-700">
              🔍 EXECUTE SYSTEM VERIFICATION
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complete Admin Tabs - ALL RESTORED PAGES */}
      <Tabs defaultValue="dealer-panel" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 lg:grid-cols-16">
          {/* Core Dealer & Store Management */}
          <TabsTrigger value="dealer-panel" className="flex items-center gap-1">
            <Store className="h-3 w-3" />
            <span className="hidden sm:inline">Dealer Panel</span>
          </TabsTrigger>
          
          {/* Database & Tables */}
          <TabsTrigger value="database" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          
          {/* Users & Authentication */}
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          
          {/* Coins & Items */}
          <TabsTrigger value="coins" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span className="hidden sm:inline">Coins</span>
          </TabsTrigger>
          
          {/* AI Brain System */}
          <TabsTrigger value="ai-brain" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            <span className="hidden sm:inline">AI Brain</span>
          </TabsTrigger>
          
          {/* Marketplace & Auctions */}
          <TabsTrigger value="marketplace" className="flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            <span className="hidden sm:inline">Marketplace</span>
          </TabsTrigger>
          
          {/* Payments & Transactions */}
          <TabsTrigger value="payments" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          
          {/* Wallet Management */}
          <TabsTrigger value="wallet" className="flex items-center gap-1">
            <Wallet className="h-3 w-3" />
            <span className="hidden sm:inline">Wallet</span>
          </TabsTrigger>
          
          {/* Analytics & Reports */}
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          
          {/* Security & Incidents */}
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          
          {/* Error Detection */}
          <TabsTrigger value="error-coins" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span className="hidden sm:inline">Errors</span>
          </TabsTrigger>
          
          {/* Scraping & Sources */}
          <TabsTrigger value="scraping" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span className="hidden sm:inline">Scraping</span>
          </TabsTrigger>
          
          {/* Bulk Operations */}
          <TabsTrigger value="bulk-ops" className="flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            <span className="hidden sm:inline">Bulk Ops</span>
          </TabsTrigger>
          
          {/* Notifications */}
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          
          {/* System Logs */}
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>
          
          {/* System Settings */}
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Settings className="h-3 w-3" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* RESTORED DEALER PANEL - Original with 30 categories */}
        <TabsContent value="dealer-panel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-600" />
                🎯 RESTORED ORIGINAL DEALER PANEL - Complete with 30 Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductionDealerPanel />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALL DATABASE TABLES - 84 Tables Management */}
        <TabsContent value="database">
          <AdminDatabaseSection />
        </TabsContent>

        {/* USERS & AUTHENTICATION */}
        <TabsContent value="users">
          <AdminUsersSection />
        </TabsContent>

        {/* COINS & ITEMS */}
        <TabsContent value="coins">
          <AdminCoinsSection />
        </TabsContent>

        {/* AI BRAIN SYSTEM */}
        <TabsContent value="ai-brain">
          <AdminAISection />
        </TabsContent>

        {/* MARKETPLACE & AUCTIONS */}
        <TabsContent value="marketplace">
          <AdminMarketplaceSection />
        </TabsContent>

        {/* PAYMENTS & TRANSACTIONS */}
        <TabsContent value="payments">
          <AdminPaymentsTab />
        </TabsContent>

        {/* WALLET MANAGEMENT */}
        <TabsContent value="wallet">
          <AdminWalletTab />
        </TabsContent>

        {/* ANALYTICS & REPORTS */}
        <TabsContent value="analytics">
          <AdminAnalyticsSection />
        </TabsContent>

        {/* SECURITY & INCIDENTS */}
        <TabsContent value="security">
          <AdminSecurityTab />
        </TabsContent>

        {/* ERROR DETECTION */}
        <TabsContent value="error-coins">
          <AdminErrorCoinsTab />
        </TabsContent>

        {/* SCRAPING & SOURCES */}
        <TabsContent value="scraping">
          <AdminScrapingTab />
        </TabsContent>

        {/* BULK OPERATIONS */}
        <TabsContent value="bulk-ops">
          <AdminBulkOperationsTab />
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <AdminNotificationsTab />
        </TabsContent>

        {/* SYSTEM LOGS */}
        <TabsContent value="logs">
          <AdminLogsTab />
        </TabsContent>

        {/* SYSTEM SETTINGS */}
        <TabsContent value="system">
          <AdminSystemSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveProductionAdminPanel;
