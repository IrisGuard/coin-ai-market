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
import AdminStoreManagerTab from '@/components/admin/AdminStoreManagerTab';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Database Table Component
const DatabaseTableTab = ({ tableName, displayName }: { tableName: string; displayName: string }) => {
  const { data: tableData, isLoading } = useQuery({
    queryKey: [`table-${tableName}`],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(100);
      
      if (error) throw error;
      return { data: data || [], count: count || 0 };
    },
    refetchInterval: 30000
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{displayName} Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading real data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {displayName} Table
          <Badge variant="outline">
            {tableData?.count || 0} Records
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Real-time data from {tableName} table
          </div>
          {tableData?.data && tableData.data.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-2 font-semibold">
                Latest {Math.min(5, tableData.data.length)} Records
              </div>
              <div className="divide-y">
                {tableData.data.slice(0, 5).map((record: any, index: number) => (
                  <div key={index} className="p-3 text-sm">
                    <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(record, null, 2).substring(0, 200)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('open-store');

  // All 95 database tables
  const databaseTables = [
    { name: 'admin_activity_logs', display: 'Admin Activity Logs' },
    { name: 'admin_roles', display: 'Admin Roles' },
    { name: 'aggregated_coin_prices', display: 'Aggregated Coin Prices' },
    { name: 'ai_command_categories', display: 'AI Command Categories' },
    { name: 'ai_command_execution_logs', display: 'AI Command Execution Logs' },
    { name: 'ai_command_executions', display: 'AI Command Executions' },
    { name: 'ai_command_workflows', display: 'AI Command Workflows' },
    { name: 'ai_commands', display: 'AI Commands' },
    { name: 'ai_configuration', display: 'AI Configuration' },
    { name: 'ai_error_detection_logs', display: 'AI Error Detection Logs' },
    { name: 'ai_performance_analytics', display: 'AI Performance Analytics' },
    { name: 'ai_performance_metrics', display: 'AI Performance Metrics' },
    { name: 'ai_recognition_cache', display: 'AI Recognition Cache' },
    { name: 'ai_search_filters', display: 'AI Search Filters' },
    { name: 'ai_training_data', display: 'AI Training Data' },
    { name: 'analytics_events', display: 'Analytics Events' },
    { name: 'api_key_categories', display: 'API Key Categories' },
    { name: 'api_key_rotations', display: 'API Key Rotations' },
    { name: 'api_keys', display: 'API Keys' },
    { name: 'auction_bids', display: 'Auction Bids' },
    { name: 'automation_rules', display: 'Automation Rules' },
    { name: 'bids', display: 'Bids' },
    { name: 'bulk_operations', display: 'Bulk Operations' },
    { name: 'categories', display: 'Categories' },
    { name: 'coin_analysis_logs', display: 'Coin Analysis Logs' },
    { name: 'coin_data_cache', display: 'Coin Data Cache' },
    { name: 'coin_evaluations', display: 'Coin Evaluations' },
    { name: 'coin_history', display: 'Coin History' },
    { name: 'coin_images', display: 'Coin Images' },
    { name: 'coin_price_history', display: 'Coin Price History' },
    { name: 'coin_store_connections', display: 'Coin Store Connections' },
    { name: 'coins', display: 'Coins' },
    { name: 'console_errors', display: 'Console Errors' },
    { name: 'data_sources', display: 'Data Sources' },
    { name: 'data_quality_reports', display: 'Data Quality Reports' },
    { name: 'dual_image_analysis', display: 'Dual Image Analysis' },
    { name: 'error_logs', display: 'Error Logs' },
    { name: 'external_price_sources', display: 'External Price Sources' },
    { name: 'geographic_data', display: 'Geographic Data' },
    { name: 'github_violations', display: 'GitHub Violations' },
    { name: 'listing_views', display: 'Listing Views' },
    { name: 'marketplace_listings', display: 'Marketplace Listings' },
    { name: 'market_analytics', display: 'Market Analytics' },
    { name: 'notifications', display: 'Notifications' },
    { name: 'page_views', display: 'Page Views' },
    { name: 'payment_transactions', display: 'Payment Transactions' },
    { name: 'performance_metrics', display: 'Performance Metrics' },
    { name: 'photo_quality_assessments', display: 'Photo Quality Assessments' },
    { name: 'prediction_models', display: 'Prediction Models' },
    { name: 'price_alerts', display: 'Price Alerts' },
    { name: 'profiles', display: 'Profiles' },
    { name: 'revenue_forecasts', display: 'Revenue Forecasts' },
    { name: 'scraping_jobs', display: 'Scraping Jobs' },
    { name: 'search_analytics', display: 'Search Analytics' },
    { name: 'security_incidents', display: 'Security Incidents' },
    { name: 'static_coins_db', display: 'Static Coins DB' },
    { name: 'store_activity_logs', display: 'Store Activity Logs' },
    { name: 'store_reviews', display: 'Store Reviews' },
    { name: 'stores', display: 'Stores' },
    { name: 'subscription_plans', display: 'Subscription Plans' },
    { name: 'system_alerts', display: 'System Alerts' },
    { name: 'system_metrics', display: 'System Metrics' },
    { name: 'user_favorites', display: 'User Favorites' },
    { name: 'user_portfolios', display: 'User Portfolios' },
    { name: 'user_purchases', display: 'User Purchases' },
    { name: 'user_roles', display: 'User Roles' },
    { name: 'user_settings', display: 'User Settings' },
    { name: 'user_subscriptions', display: 'User Subscriptions' },
    { name: 'visual_coin_matches', display: 'Visual Coin Matches' },
    { name: 'vpn_proxies', display: 'VPN Proxies' },
    { name: 'wallet_balances', display: 'Wallet Balances' },
    { name: 'watchlist', display: 'Watchlist' },
    { name: 'web_discovery_results', display: 'Web Discovery Results' }
  ];

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
          <Badge className="text-foreground border text-lg px-4 py-2">
            System Status: READY FOR OPTIMIZATION
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-4">
            <TabsTrigger value="open-store">🏪 Open Store</TabsTrigger>
            <TabsTrigger value="cleanup">🚀 Cleanup</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="coins">Coins</TabsTrigger>
            <TabsTrigger value="ai-brain">AI Brain</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system-phases">System Phases</TabsTrigger>
          </TabsList>

          {/* Database Tables Grid - AFTER System Phases */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Database Tables ({databaseTables.length} Total)</h2>
            <div className="grid grid-cols-5 gap-2">
              {databaseTables.map((table) => (
                <TabsTrigger 
                  key={table.name}
                  value={`table-${table.name}`}
                  className="text-xs p-2 h-auto"
                >
                  {table.display}
                </TabsTrigger>
              ))}
            </div>
          </div>

          <TabsContent value="open-store" className="space-y-6">
            <AdminStoreManagerTab />
          </TabsContent>

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

          {/* All Database Table Tabs with REAL DATA */}
          {databaseTables.map((table) => (
            <TabsContent key={table.name} value={`table-${table.name}`} className="space-y-6">
              <DatabaseTableTab tableName={table.name} displayName={table.display} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel;
