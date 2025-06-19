
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, Users, Coins, Brain, CreditCard, BarChart3, Cog, Settings } from 'lucide-react';

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

// Import Unified Security Monitoring Component
import UnifiedSecurityMonitoringPanel from './UnifiedSecurityMonitoringPanel';

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
              <p className="text-muted-foreground">🔒 Mock Data Protection • 84 Tables • 100% RLS Coverage</p>
            </div>
          </div>
        </div>

        {/* Comprehensive Tabs with Security Monitoring First */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="security-monitoring" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
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
