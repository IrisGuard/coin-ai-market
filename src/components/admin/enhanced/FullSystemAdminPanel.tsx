
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import AdminOverviewTab from '@/components/admin/tabs/AdminOverviewTab';
import AdminUsersTab from '@/components/admin/tabs/AdminUsersTab';
import AdminCoinsTab from '@/components/admin/tabs/AdminCoinsTab';
import AdminAIBrainTab from '@/components/admin/tabs/AdminAIBrainTab';
import AdminSecurityTab from '@/components/admin/tabs/AdminSecurityTab';
import AdminAnalyticsTab from '@/components/admin/tabs/AdminAnalyticsTab';
import AdminSystemPhasesTab from '@/components/admin/tabs/AdminSystemPhasesTab';
import AdminCleanupTab from '@/components/admin/tabs/AdminCleanupTab';

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('cleanup');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Full System Admin Panel</h1>
            <p className="text-muted-foreground">
              Complete administration interface with Production Optimization - Ready for Live Launch
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            System Status: READY FOR OPTIMIZATION
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="cleanup">🚀 Cleanup</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="coins">Coins</TabsTrigger>
            <TabsTrigger value="ai-brain">AI Brain</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system-phases">System Phases</TabsTrigger>
          </TabsList>

          <TabsContent value="cleanup" className="space-y-6">
            <AdminCleanupTab />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverviewTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="coins" className="space-y-6">
            <AdminCoinsTab />
          </TabsContent>

          <TabsContent value="ai-brain" className="space-y-6">
            <AdminAIBrainTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <AdminSecurityTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalyticsTab />
          </TabsContent>

          <TabsContent value="system-phases" className="space-y-6">
            <AdminSystemPhasesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel;
