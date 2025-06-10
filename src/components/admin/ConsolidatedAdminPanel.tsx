
import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Clock,
  Activity,
  Users,
  Database,
  Brain,
  Key,
  BarChart3,
  Store,
  Gavel
} from 'lucide-react';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminAIBrainTab from './tabs/AdminAIBrainTab';
import AdminAPIKeysTab from './tabs/AdminAPIKeysTab';
import AdminDataSourcesTab from './tabs/AdminDataSourcesTab';
import AdminMarketplaceTab from './tabs/AdminMarketplaceTab';
import AdminAuctionsTab from './tabs/AdminAuctionsTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';

const ConsolidatedAdminPanel: React.FC = () => {
  const { isAdmin, isAdminAuthenticated, isLoading, sessionTimeLeft, logoutAdmin } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Denied</strong>
            <p className="mt-1">Administrative privileges required. Use Ctrl+Alt+A to access admin panel.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Authentication Required</strong>
            <p className="mt-1">Please use Ctrl+Alt+A to authenticate and access the admin panel.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with session info */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CoinVision Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive administration and monitoring system
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session: {formatTimeLeft(sessionTimeLeft)}
            </Badge>
            <Button variant="outline" onClick={logoutAdmin}>
              Logout Admin
            </Button>
          </div>
        </div>

        {/* Main Admin Tabs */}
        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="ai-brain" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Brain
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="data-sources" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="auctions" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Auctions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <AdminSystemTab />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="ai-brain">
            <AdminAIBrainTab />
          </TabsContent>

          <TabsContent value="api-keys">
            <AdminAPIKeysTab />
          </TabsContent>

          <TabsContent value="data-sources">
            <AdminDataSourcesTab />
          </TabsContent>

          <TabsContent value="marketplace">
            <AdminMarketplaceTab />
          </TabsContent>

          <TabsContent value="auctions">
            <AdminAuctionsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsolidatedAdminPanel;
