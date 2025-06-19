
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, Users, Coins, Brain, CreditCard, BarChart3, Cog, Settings, Search } from 'lucide-react';

// Import existing sections
import PerformanceOptimizedDashboard from '../PerformanceOptimizedDashboard';
import AdminUsersSection from '../AdminUsersSection';
import AdminCoinsSection from '../AdminCoinsSection';
import AdminDatabaseSection from '../sections/AdminDatabaseSection';
import AdminAISection from '../sections/AdminAISection';
import AdminMarketplaceSection from '../sections/AdminMarketplaceSection';
import AdminAnalyticsSection from '../sections/AdminAnalyticsSection';
import AdminDataSourcesSection from '../sections/AdminDataSourcesSection';
import AdminSystemSection from '../sections/AdminSystemSection';

// Import Production Security Monitoring Component
import UnifiedSecurityMonitoringPanel from './UnifiedSecurityMonitoringPanel';

// Import Phase 15 Validation Panel
import Phase15ValidationPanel from '../validation/Phase15ValidationPanel';

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('security-monitoring');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Complete Admin Control Panel</h1>
              <p className="text-muted-foreground">🔒 Production Data Protection • Live Security Monitoring • 100% Production Ready</p>
            </div>
          </div>
        </div>

        {/* Comprehensive Tabs with Security Monitoring First */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="security-monitoring" className="flex items-center gap-2 bg-red-50 data-[state=active]:bg-red-100">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="font-semibold text-red-700">Security</span>
            </TabsTrigger>
            <TabsTrigger value="phase-validation" className="flex items-center gap-2 bg-blue-50 data-[state=active]:bg-blue-100">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700">15 Phases</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="coins" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Coins
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI System
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="security-monitoring">
            <UnifiedSecurityMonitoringPanel />
          </TabsContent>

          <TabsContent value="phase-validation">
            <Phase15ValidationPanel />
          </TabsContent>

          <TabsContent value="dashboard">
            <PerformanceOptimizedDashboard />
          </TabsContent>

          <TabsContent value="database">
            <AdminDatabaseSection />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersSection />
          </TabsContent>

          <TabsContent value="coins">
            <AdminCoinsSection />
          </TabsContent>

          <TabsContent value="ai">
            <AdminAISection />
          </TabsContent>

          <TabsContent value="marketplace">
            <AdminMarketplaceSection />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsSection />
          </TabsContent>

          <TabsContent value="system">
            <AdminSystemSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel;
