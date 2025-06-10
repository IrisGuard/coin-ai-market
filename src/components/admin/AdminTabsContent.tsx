import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Users, BarChart3, Database, Settings, 
  TrendingUp, Activity, Package, AlertTriangle,
  Brain, Search, Store, CreditCard, Key
} from 'lucide-react';

// Import existing tabs
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminTransactionsTab from './tabs/AdminTransactionsTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminSecurityAuditTab from './tabs/AdminSecurityAuditTab';
import AdminStoreManagementTab from './tabs/AdminStoreManagementTab';
import AdminPaymentManagementTab from './tabs/AdminPaymentManagementTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';
import AdminAIBrainTab from './tabs/AdminAIBrainTab';

// Import new Phase 4 tabs
import AdminAdvancedAnalyticsTab from './tabs/AdminAdvancedAnalyticsTab';
import AdminRealTimeMonitoringTab from './tabs/AdminRealTimeMonitoringTab';
import AdminBulkOperationsTab from './tabs/AdminBulkOperationsTab';

const AdminTabsContent = () => {
  return (
    <Tabs defaultValue="advanced-analytics" className="space-y-6">
      <TabsList className="grid grid-cols-6 lg:grid-cols-12 gap-1 h-auto p-1">
        <TabsTrigger value="advanced-analytics" className="flex items-center gap-1 text-xs">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="real-time-monitoring" className="flex items-center gap-1 text-xs">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Monitoring</span>
        </TabsTrigger>
        <TabsTrigger value="bulk-operations" className="flex items-center gap-1 text-xs">
          <Package className="w-4 h-4" />
          <span className="hidden sm:inline">Bulk Ops</span>
        </TabsTrigger>
        <TabsTrigger value="ai-brain" className="flex items-center gap-1 text-xs">
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">AI Brain</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Users</span>
        </TabsTrigger>
        <TabsTrigger value="coins" className="flex items-center gap-1 text-xs">
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Coins</span>
        </TabsTrigger>
        <TabsTrigger value="stores" className="flex items-center gap-1 text-xs">
          <Store className="w-4 h-4" />
          <span className="hidden sm:inline">Stores</span>
        </TabsTrigger>
        <TabsTrigger value="transactions" className="flex items-center gap-1 text-xs">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Transactions</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-1 text-xs">
          <CreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">Payments</span>
        </TabsTrigger>
        <TabsTrigger value="api-keys" className="flex items-center gap-1 text-xs">
          <Key className="w-4 h-4" />
          <span className="hidden sm:inline">API Keys</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-1 text-xs">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="system" className="flex items-center gap-1 text-xs">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">System</span>
        </TabsTrigger>
      </TabsList>

      {/* Phase 4 Advanced Features */}
      <TabsContent value="advanced-analytics">
        <AdminAdvancedAnalyticsTab />
      </TabsContent>

      <TabsContent value="real-time-monitoring">
        <AdminRealTimeMonitoringTab />
      </TabsContent>

      <TabsContent value="bulk-operations">
        <AdminBulkOperationsTab />
      </TabsContent>

      {/* Existing Core Features */}
      <TabsContent value="ai-brain">
        <AdminAIBrainTab />
      </TabsContent>

      <TabsContent value="users">
        <AdminUsersTab />
      </TabsContent>

      <TabsContent value="coins">
        <AdminCoinsTab />
      </TabsContent>

      <TabsContent value="stores">
        <AdminStoreManagementTab />
      </TabsContent>

      <TabsContent value="transactions">
        <AdminTransactionsTab />
      </TabsContent>

      <TabsContent value="payments">
        <AdminPaymentManagementTab />
      </TabsContent>

      <TabsContent value="api-keys">
        <AdminApiKeysTab />
      </TabsContent>

      <TabsContent value="security">
        <AdminSecurityAuditTab />
      </TabsContent>

      <TabsContent value="system">
        <AdminSystemTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContent;
