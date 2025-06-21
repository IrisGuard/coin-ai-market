import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

const DatabaseTableTab = ({ tableName, displayName }: { tableName: string; displayName: string }) => {
  const { data: tableData, isLoading } = useQuery({
    queryKey: [`table-${tableName}`],
    queryFn: async () => {
      try {
        const { data, error, count } = await supabase
          .from(tableName as any)
          .select('*', { count: 'exact' })
          .limit(100);
        
        if (error) throw error;
        return { data: data || [], count: count || 0 };
      } catch (error) {
        console.log(`Table ${tableName} not accessible:`, error);
        return { data: [], count: 0 };
      }
    },
    refetchInterval: 30000
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{displayName}</CardTitle>
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
          {displayName}
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
          <TabsList className="grid w-full grid-cols-1 gap-2 h-auto p-2">
            {/* ROW 1 - Open Store FIRST, AI Brain SECOND */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="open-store" className="text-xs px-2 py-1">🏪 Open Store</TabsTrigger>
              <TabsTrigger value="ai-brain" className="text-xs px-2 py-1">🧠 AI Brain</TabsTrigger>
              <TabsTrigger value="cleanup" className="text-xs px-2 py-1">🚀 Cleanup</TabsTrigger>
              <TabsTrigger value="overview" className="text-xs px-2 py-1">📊 Overview</TabsTrigger>
              <TabsTrigger value="users" className="text-xs px-2 py-1">👥 Users</TabsTrigger>
              <TabsTrigger value="coins" className="text-xs px-2 py-1">🪙 Coins</TabsTrigger>
              <TabsTrigger value="security" className="text-xs px-2 py-1">🔒 Security</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs px-2 py-1">📈 Analytics</TabsTrigger>
              <TabsTrigger value="system-phases" className="text-xs px-2 py-1">⚙️ System Phases</TabsTrigger>
            </div>

            {/* ROW 2 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="admin-activity-logs" className="text-xs px-2 py-1">📋 Admin Activity Logs</TabsTrigger>
              <TabsTrigger value="admin-roles" className="text-xs px-2 py-1">📋 Admin Roles</TabsTrigger>
              <TabsTrigger value="aggregated-coin-prices" className="text-xs px-2 py-1">📋 Aggregated Coin Prices</TabsTrigger>
              <TabsTrigger value="ai-command-categories" className="text-xs px-2 py-1">📋 AI Command Categories</TabsTrigger>
              <TabsTrigger value="ai-command-execution-logs" className="text-xs px-2 py-1">📋 AI Command Execution Logs</TabsTrigger>
              <TabsTrigger value="ai-command-executions" className="text-xs px-2 py-1">📋 AI Command Executions</TabsTrigger>
              <TabsTrigger value="ai-command-workflows" className="text-xs px-2 py-1">📋 AI Command Workflows</TabsTrigger>
              <TabsTrigger value="ai-commands" className="text-xs px-2 py-1">📋 AI Commands</TabsTrigger>
              <TabsTrigger value="ai-configuration" className="text-xs px-2 py-1">📋 AI Configuration</TabsTrigger>
            </div>

            {/* ROW 3 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="ai-error-detection-logs" className="text-xs px-2 py-1">📋 AI Error Detection Logs</TabsTrigger>
              <TabsTrigger value="ai-performance-analytics" className="text-xs px-2 py-1">📋 AI Performance Analytics</TabsTrigger>
              <TabsTrigger value="ai-performance-metrics" className="text-xs px-2 py-1">📋 AI Performance Metrics</TabsTrigger>
              <TabsTrigger value="ai-recognition-cache" className="text-xs px-2 py-1">📋 AI Recognition Cache</TabsTrigger>
              <TabsTrigger value="ai-search-filters" className="text-xs px-2 py-1">📋 AI Search Filters</TabsTrigger>
              <TabsTrigger value="ai-training-data" className="text-xs px-2 py-1">📋 AI Training Data</TabsTrigger>
              <TabsTrigger value="analytics-events" className="text-xs px-2 py-1">📋 Analytics Events</TabsTrigger>
              <TabsTrigger value="api-key-categories" className="text-xs px-2 py-1">📋 API Key Categories</TabsTrigger>
              <TabsTrigger value="api-key-rotations" className="text-xs px-2 py-1">📋 API Key Rotations</TabsTrigger>
            </div>

            {/* ROW 4 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="api-keys" className="text-xs px-2 py-1">📋 API Keys</TabsTrigger>
              <TabsTrigger value="auction-bids" className="text-xs px-2 py-1">📋 Auction Bids</TabsTrigger>
              <TabsTrigger value="automation-rules" className="text-xs px-2 py-1">📋 Automation Rules</TabsTrigger>
              <TabsTrigger value="bids" className="text-xs px-2 py-1">📋 Bids</TabsTrigger>
              <TabsTrigger value="bulk-operations" className="text-xs px-2 py-1">📋 Bulk Operations</TabsTrigger>
              <TabsTrigger value="categories" className="text-xs px-2 py-1">📋 Categories</TabsTrigger>
              <TabsTrigger value="coin-analysis-logs" className="text-xs px-2 py-1">📋 Coin Analysis Logs</TabsTrigger>
              <TabsTrigger value="coin-data-cache" className="text-xs px-2 py-1">📋 Coin Data Cache</TabsTrigger>
              <TabsTrigger value="coin-evaluations" className="text-xs px-2 py-1">📋 Coin Evaluations</TabsTrigger>
            </div>

            {/* ROW 5 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="coin-history" className="text-xs px-2 py-1">📋 Coin History</TabsTrigger>
              <TabsTrigger value="coin-images" className="text-xs px-2 py-1">📋 Coin Images</TabsTrigger>
              <TabsTrigger value="coin-price-history" className="text-xs px-2 py-1">📋 Coin Price History</TabsTrigger>
              <TabsTrigger value="coin-store-connections" className="text-xs px-2 py-1">📋 Coin Store Connections</TabsTrigger>
              <TabsTrigger value="coins-table" className="text-xs px-2 py-1">📋 Coins Table</TabsTrigger>
              <TabsTrigger value="console-errors" className="text-xs px-2 py-1">📋 Console Errors</TabsTrigger>
              <TabsTrigger value="data-sources" className="text-xs px-2 py-1">📋 Data Sources</TabsTrigger>
              <TabsTrigger value="data-quality-reports" className="text-xs px-2 py-1">📋 Data Quality Reports</TabsTrigger>
              <TabsTrigger value="dual-image-analysis" className="text-xs px-2 py-1">📋 Dual Image Analysis</TabsTrigger>
            </div>

            {/* ROW 6 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="error-logs" className="text-xs px-2 py-1">📋 Error Logs</TabsTrigger>
              <TabsTrigger value="external-price-sources" className="text-xs px-2 py-1">📋 External Price Sources</TabsTrigger>
              <TabsTrigger value="geographic-data" className="text-xs px-2 py-1">📋 Geographic Data</TabsTrigger>
              <TabsTrigger value="github-violations" className="text-xs px-2 py-1">📋 GitHub Violations</TabsTrigger>
              <TabsTrigger value="listing-views" className="text-xs px-2 py-1">📋 Listing Views</TabsTrigger>
              <TabsTrigger value="marketplace-listings" className="text-xs px-2 py-1">📋 Marketplace Listings</TabsTrigger>
              <TabsTrigger value="market-analytics" className="text-xs px-2 py-1">📋 Market Analytics</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs px-2 py-1">📋 Notifications</TabsTrigger>
              <TabsTrigger value="page-views" className="text-xs px-2 py-1">📋 Page Views</TabsTrigger>
            </div>

            {/* ROW 7 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="payment-transactions" className="text-xs px-2 py-1">📋 Payment Transactions</TabsTrigger>
              <TabsTrigger value="performance-metrics" className="text-xs px-2 py-1">📋 Performance Metrics</TabsTrigger>
              <TabsTrigger value="photo-quality-assessments" className="text-xs px-2 py-1">📋 Photo Quality Assessments</TabsTrigger>
              <TabsTrigger value="prediction-models" className="text-xs px-2 py-1">📋 Prediction Models</TabsTrigger>
              <TabsTrigger value="price-alerts" className="text-xs px-2 py-1">📋 Price Alerts</TabsTrigger>
              <TabsTrigger value="profiles" className="text-xs px-2 py-1">📋 Profiles</TabsTrigger>
              <TabsTrigger value="revenue-forecasts" className="text-xs px-2 py-1">📋 Revenue Forecasts</TabsTrigger>
              <TabsTrigger value="scraping-jobs" className="text-xs px-2 py-1">📋 Scraping Jobs</TabsTrigger>
              <TabsTrigger value="search-analytics" className="text-xs px-2 py-1">📋 Search Analytics</TabsTrigger>
            </div>

            {/* ROW 8 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="security-incidents" className="text-xs px-2 py-1">📋 Security Incidents</TabsTrigger>
              <TabsTrigger value="static-coins-db" className="text-xs px-2 py-1">📋 Static Coins DB</TabsTrigger>
              <TabsTrigger value="store-activity-logs" className="text-xs px-2 py-1">📋 Store Activity Logs</TabsTrigger>
              <TabsTrigger value="store-reviews" className="text-xs px-2 py-1">📋 Store Reviews</TabsTrigger>
              <TabsTrigger value="stores" className="text-xs px-2 py-1">📋 Stores</TabsTrigger>
              <TabsTrigger value="subscription-plans" className="text-xs px-2 py-1">📋 Subscription Plans</TabsTrigger>
              <TabsTrigger value="system-alerts" className="text-xs px-2 py-1">📋 System Alerts</TabsTrigger>
              <TabsTrigger value="system-metrics" className="text-xs px-2 py-1">📋 System Metrics</TabsTrigger>
              <TabsTrigger value="user-favorites" className="text-xs px-2 py-1">📋 User Favorites</TabsTrigger>
            </div>

            {/* ROW 9 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="user-portfolios" className="text-xs px-2 py-1">📋 User Portfolios</TabsTrigger>
              <TabsTrigger value="user-purchases" className="text-xs px-2 py-1">📋 User Purchases</TabsTrigger>
              <TabsTrigger value="user-roles" className="text-xs px-2 py-1">📋 User Roles</TabsTrigger>
              <TabsTrigger value="user-settings" className="text-xs px-2 py-1">📋 User Settings</TabsTrigger>
              <TabsTrigger value="user-subscriptions" className="text-xs px-2 py-1">📋 User Subscriptions</TabsTrigger>
              <TabsTrigger value="visual-coin-matches" className="text-xs px-2 py-1">📋 Visual Coin Matches</TabsTrigger>
              <TabsTrigger value="vpn-proxies" className="text-xs px-2 py-1">📋 VPN Proxies</TabsTrigger>
              <TabsTrigger value="wallet-balances" className="text-xs px-2 py-1">📋 Wallet Balances</TabsTrigger>
              <TabsTrigger value="watchlist" className="text-xs px-2 py-1">📋 Watchlist</TabsTrigger>
            </div>

            {/* ROW 10 */}
            <div className="flex flex-wrap gap-1">
              <TabsTrigger value="web-discovery-results" className="text-xs px-2 py-1">📋 Web Discovery Results</TabsTrigger>
            </div>
          </TabsList>

          {/* ALL TAB CONTENTS */}
          <TabsContent value="open-store"><AdminStoreManagerTab /></TabsContent>
          <TabsContent value="ai-brain"><AdminAIBrainTab /></TabsContent>
          <TabsContent value="cleanup"><AdminCleanupTab /></TabsContent>
          <TabsContent value="overview"><AdminOverviewTab /></TabsContent>
          <TabsContent value="users"><AdminUsersTab /></TabsContent>
          <TabsContent value="coins"><AdminCoinsTab /></TabsContent>
          <TabsContent value="security"><AdminSecurityTab /></TabsContent>
          <TabsContent value="analytics"><AdminAnalyticsTab /></TabsContent>
          <TabsContent value="system-phases"><AdminSystemPhasesTab /></TabsContent>
          
          {/* ALL DATABASE TABLE CONTENTS */}
          <TabsContent value="admin-activity-logs"><DatabaseTableTab tableName="admin_activity_logs" displayName="Admin Activity Logs" /></TabsContent>
          <TabsContent value="admin-roles"><DatabaseTableTab tableName="admin_roles" displayName="Admin Roles" /></TabsContent>
          <TabsContent value="aggregated-coin-prices"><DatabaseTableTab tableName="aggregated_coin_prices" displayName="Aggregated Coin Prices" /></TabsContent>
          <TabsContent value="ai-command-categories"><DatabaseTableTab tableName="ai_command_categories" displayName="AI Command Categories" /></TabsContent>
          <TabsContent value="ai-command-execution-logs"><DatabaseTableTab tableName="ai_command_execution_logs" displayName="AI Command Execution Logs" /></TabsContent>
          <TabsContent value="ai-command-executions"><DatabaseTableTab tableName="ai_command_executions" displayName="AI Command Executions" /></TabsContent>
          <TabsContent value="ai-command-workflows"><DatabaseTableTab tableName="ai_command_workflows" displayName="AI Command Workflows" /></TabsContent>
          <TabsContent value="ai-commands"><DatabaseTableTab tableName="ai_commands" displayName="AI Commands" /></TabsContent>
          <TabsContent value="ai-configuration"><DatabaseTableTab tableName="ai_configuration" displayName="AI Configuration" /></TabsContent>
          <TabsContent value="ai-error-detection-logs"><DatabaseTableTab tableName="ai_error_detection_logs" displayName="AI Error Detection Logs" /></TabsContent>
          <TabsContent value="ai-performance-analytics"><DatabaseTableTab tableName="ai_performance_analytics" displayName="AI Performance Analytics" /></TabsContent>
          <TabsContent value="ai-performance-metrics"><DatabaseTableTab tableName="ai_performance_metrics" displayName="AI Performance Metrics" /></TabsContent>
          <TabsContent value="ai-recognition-cache"><DatabaseTableTab tableName="ai_recognition_cache" displayName="AI Recognition Cache" /></TabsContent>
          <TabsContent value="ai-search-filters"><DatabaseTableTab tableName="ai_search_filters" displayName="AI Search Filters" /></TabsContent>
          <TabsContent value="ai-training-data"><DatabaseTableTab tableName="ai_training_data" displayName="AI Training Data" /></TabsContent>
          <TabsContent value="analytics-events"><DatabaseTableTab tableName="analytics_events" displayName="Analytics Events" /></TabsContent>
          <TabsContent value="api-key-categories"><DatabaseTableTab tableName="api_key_categories" displayName="API Key Categories" /></TabsContent>
          <TabsContent value="api-key-rotations"><DatabaseTableTab tableName="api_key_rotations" displayName="API Key Rotations" /></TabsContent>
          <TabsContent value="api-keys"><DatabaseTableTab tableName="api_keys" displayName="API Keys" /></TabsContent>
          <TabsContent value="auction-bids"><DatabaseTableTab tableName="auction_bids" displayName="Auction Bids" /></TabsContent>
          <TabsContent value="automation-rules"><DatabaseTableTab tableName="automation_rules" displayName="Automation Rules" /></TabsContent>
          <TabsContent value="bids"><DatabaseTableTab tableName="bids" displayName="Bids" /></TabsContent>
          <TabsContent value="bulk-operations"><DatabaseTableTab tableName="bulk_operations" displayName="Bulk Operations" /></TabsContent>
          <TabsContent value="categories"><DatabaseTableTab tableName="categories" displayName="Categories" /></TabsContent>
          <TabsContent value="coin-analysis-logs"><DatabaseTableTab tableName="coin_analysis_logs" displayName="Coin Analysis Logs" /></TabsContent>
          <TabsContent value="coin-data-cache"><DatabaseTableTab tableName="coin_data_cache" displayName="Coin Data Cache" /></TabsContent>
          <TabsContent value="coin-evaluations"><DatabaseTableTab tableName="coin_evaluations" displayName="Coin Evaluations" /></TabsContent>
          <TabsContent value="coin-history"><DatabaseTableTab tableName="coin_history" displayName="Coin History" /></TabsContent>
          <TabsContent value="coin-images"><DatabaseTableTab tableName="coin_images" displayName="Coin Images" /></TabsContent>
          <TabsContent value="coin-price-history"><DatabaseTableTab tableName="coin_price_history" displayName="Coin Price History" /></TabsContent>
          <TabsContent value="coin-store-connections"><DatabaseTableTab tableName="coin_store_connections" displayName="Coin Store Connections" /></TabsContent>
          <TabsContent value="coins-table"><DatabaseTableTab tableName="coins" displayName="Coins Table" /></TabsContent>
          <TabsContent value="console-errors"><DatabaseTableTab tableName="console_errors" displayName="Console Errors" /></TabsContent>
          <TabsContent value="data-sources"><DatabaseTableTab tableName="data_sources" displayName="Data Sources" /></TabsContent>
          <TabsContent value="data-quality-reports"><DatabaseTableTab tableName="data_quality_reports" displayName="Data Quality Reports" /></TabsContent>
          <TabsContent value="dual-image-analysis"><DatabaseTableTab tableName="dual_image_analysis" displayName="Dual Image Analysis" /></TabsContent>
          <TabsContent value="error-logs"><DatabaseTableTab tableName="error_logs" displayName="Error Logs" /></TabsContent>
          <TabsContent value="external-price-sources"><DatabaseTableTab tableName="external_price_sources" displayName="External Price Sources" /></TabsContent>
          <TabsContent value="geographic-data"><DatabaseTableTab tableName="geographic_data" displayName="Geographic Data" /></TabsContent>
          <TabsContent value="github-violations"><DatabaseTableTab tableName="github_violations" displayName="GitHub Violations" /></TabsContent>
          <TabsContent value="listing-views"><DatabaseTableTab tableName="listing_views" displayName="Listing Views" /></TabsContent>
          <TabsContent value="marketplace-listings"><DatabaseTableTab tableName="marketplace_listings" displayName="Marketplace Listings" /></TabsContent>
          <TabsContent value="market-analytics"><DatabaseTableTab tableName="market_analytics" displayName="Market Analytics" /></TabsContent>
          <TabsContent value="notifications"><DatabaseTableTab tableName="notifications" displayName="Notifications" /></TabsContent>
          <TabsContent value="page-views"><DatabaseTableTab tableName="page_views" displayName="Page Views" /></TabsContent>
          <TabsContent value="payment-transactions"><DatabaseTableTab tableName="payment_transactions" displayName="Payment Transactions" /></TabsContent>
          <TabsContent value="performance-metrics"><DatabaseTableTab tableName="performance_metrics" displayName="Performance Metrics" /></TabsContent>
          <TabsContent value="photo-quality-assessments"><DatabaseTableTab tableName="photo_quality_assessments" displayName="Photo Quality Assessments" /></TabsContent>
          <TabsContent value="prediction-models"><DatabaseTableTab tableName="prediction_models" displayName="Prediction Models" /></TabsContent>
          <TabsContent value="price-alerts"><DatabaseTableTab tableName="price_alerts" displayName="Price Alerts" /></TabsContent>
          <TabsContent value="profiles"><DatabaseTableTab tableName="profiles" displayName="Profiles" /></TabsContent>
          <TabsContent value="revenue-forecasts"><DatabaseTableTab tableName="revenue_forecasts" displayName="Revenue Forecasts" /></TabsContent>
          <TabsContent value="scraping-jobs"><DatabaseTableTab tableName="scraping_jobs" displayName="Scraping Jobs" /></TabsContent>
          <TabsContent value="search-analytics"><DatabaseTableTab tableName="search_analytics" displayName="Search Analytics" /></TabsContent>
          <TabsContent value="security-incidents"><DatabaseTableTab tableName="security_incidents" displayName="Security Incidents" /></TabsContent>
          <TabsContent value="static-coins-db"><DatabaseTableTab tableName="static_coins_db" displayName="Static Coins DB" /></TabsContent>
          <TabsContent value="store-activity-logs"><DatabaseTableTab tableName="store_activity_logs" displayName="Store Activity Logs" /></TabsContent>
          <TabsContent value="store-reviews"><DatabaseTableTab tableName="store_reviews" displayName="Store Reviews" /></TabsContent>
          <TabsContent value="stores"><DatabaseTableTab tableName="stores" displayName="Stores" /></TabsContent>
          <TabsContent value="subscription-plans"><DatabaseTableTab tableName="subscription_plans" displayName="Subscription Plans" /></TabsContent>
          <TabsContent value="system-alerts"><DatabaseTableTab tableName="system_alerts" displayName="System Alerts" /></TabsContent>
          <TabsContent value="system-metrics"><DatabaseTableTab tableName="system_metrics" displayName="System Metrics" /></TabsContent>
          <TabsContent value="user-favorites"><DatabaseTableTab tableName="user_favorites" displayName="User Favorites" /></TabsContent>
          <TabsContent value="user-portfolios"><DatabaseTableTab tableName="user_portfolios" displayName="User Portfolios" /></TabsContent>
          <TabsContent value="user-purchases"><DatabaseTableTab tableName="user_purchases" displayName="User Purchases" /></TabsContent>
          <TabsContent value="user-roles"><DatabaseTableTab tableName="user_roles" displayName="User Roles" /></TabsContent>
          <TabsContent value="user-settings"><DatabaseTableTab tableName="user_settings" displayName="User Settings" /></TabsContent>
          <TabsContent value="user-subscriptions"><DatabaseTableTab tableName="user_subscriptions" displayName="User Subscriptions" /></TabsContent>
          <TabsContent value="visual-coin-matches"><DatabaseTableTab tableName="visual_coin_matches" displayName="Visual Coin Matches" /></TabsContent>
          <TabsContent value="vpn-proxies"><DatabaseTableTab tableName="vpn_proxies" displayName="VPN Proxies" /></TabsContent>
          <TabsContent value="wallet-balances"><DatabaseTableTab tableName="wallet_balances" displayName="Wallet Balances" /></TabsContent>
          <TabsContent value="watchlist"><DatabaseTableTab tableName="watchlist" displayName="Watchlist" /></TabsContent>
          <TabsContent value="web-discovery-results"><DatabaseTableTab tableName="web_discovery_results" displayName="Web Discovery Results" /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel; 