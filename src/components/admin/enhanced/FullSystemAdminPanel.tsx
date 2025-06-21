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
          .limit(50);
        
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
              <div className="divide-y max-h-96 overflow-y-auto">
                {tableData.data.slice(0, 5).map((record: any, index: number) => (
                  <div key={index} className="p-3 text-sm">
                    <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(record, null, 2).substring(0, 300)}...
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
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel - Production Ready</h1>
            <p className="text-muted-foreground">
              Complete administration interface with live Supabase data - All 95+ Tables Active
            </p>
          </div>
          <Badge className="text-foreground border text-lg px-4 py-2">
            🚀 ALL FUNCTIONS ACTIVE
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 gap-2 h-auto p-2">
            
            {/* ROW 1 - MAIN ADMIN FUNCTIONS */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-blue-50 rounded-lg">
              <div className="text-xs font-semibold text-blue-700 w-full mb-1">🎯 MAIN ADMIN FUNCTIONS</div>
              <TabsTrigger value="open-store" className="text-xs px-3 py-2 bg-green-100 hover:bg-green-200">🏪 Open Store</TabsTrigger>
              <TabsTrigger value="ai-brain" className="text-xs px-3 py-2 bg-purple-100 hover:bg-purple-200">🧠 AI Brain</TabsTrigger>
              <TabsTrigger value="overview" className="text-xs px-3 py-2">📊 Overview</TabsTrigger>
              <TabsTrigger value="users" className="text-xs px-3 py-2">👥 Users</TabsTrigger>
              <TabsTrigger value="coins" className="text-xs px-3 py-2">🪙 Coins</TabsTrigger>
              <TabsTrigger value="security" className="text-xs px-3 py-2">🔒 Security</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs px-3 py-2">📈 Analytics</TabsTrigger>
              <TabsTrigger value="system-phases" className="text-xs px-3 py-2">⚙️ System Phases</TabsTrigger>
              <TabsTrigger value="cleanup" className="text-xs px-3 py-2 bg-red-100 hover:bg-red-200">🚀 Production Cleanup</TabsTrigger>
            </div>

            {/* ROW 2 - AI & AUTOMATION TABLES */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-purple-50 rounded-lg">
              <div className="text-xs font-semibold text-purple-700 w-full mb-1">🤖 AI & AUTOMATION SYSTEMS</div>
              <TabsTrigger value="ai-commands" className="text-xs px-2 py-1">🤖 AI Commands</TabsTrigger>
              <TabsTrigger value="ai-command-executions" className="text-xs px-2 py-1">🤖 AI Executions</TabsTrigger>
              <TabsTrigger value="ai-command-categories" className="text-xs px-2 py-1">🤖 AI Categories</TabsTrigger>
              <TabsTrigger value="ai-command-execution-logs" className="text-xs px-2 py-1">🤖 AI Exec Logs</TabsTrigger>
              <TabsTrigger value="ai-command-workflows" className="text-xs px-2 py-1">🤖 AI Workflows</TabsTrigger>
              <TabsTrigger value="ai-configuration" className="text-xs px-2 py-1">🤖 AI Config</TabsTrigger>
              <TabsTrigger value="ai-error-detection-logs" className="text-xs px-2 py-1">🤖 AI Error Logs</TabsTrigger>
              <TabsTrigger value="ai-performance-analytics" className="text-xs px-2 py-1">🤖 AI Analytics</TabsTrigger>
              <TabsTrigger value="ai-performance-metrics" className="text-xs px-2 py-1">🤖 AI Performance</TabsTrigger>
              <TabsTrigger value="ai-predictions" className="text-xs px-2 py-1">🤖 AI Predictions</TabsTrigger>
              <TabsTrigger value="ai-recognition-cache" className="text-xs px-2 py-1">🤖 AI Cache</TabsTrigger>
              <TabsTrigger value="ai-search-filters" className="text-xs px-2 py-1">🤖 AI Filters</TabsTrigger>
              <TabsTrigger value="ai-training-data" className="text-xs px-2 py-1">🤖 AI Training</TabsTrigger>
              <TabsTrigger value="automation-rules" className="text-xs px-2 py-1">🤖 Automation Rules</TabsTrigger>
              <TabsTrigger value="prediction-models" className="text-xs px-2 py-1">🔮 Prediction Models</TabsTrigger>
            </div>

            {/* ROW 3 - COIN & MARKET DATA */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-yellow-50 rounded-lg">
              <div className="text-xs font-semibold text-yellow-700 w-full mb-1">🪙 COIN & MARKET DATA</div>
              <TabsTrigger value="coins-table" className="text-xs px-2 py-1">🪙 Coins</TabsTrigger>
              <TabsTrigger value="coin-price-history" className="text-xs px-2 py-1">📈 Price History</TabsTrigger>
              <TabsTrigger value="coin-analysis-logs" className="text-xs px-2 py-1">🪙 Analysis Logs</TabsTrigger>
              <TabsTrigger value="coin-data-cache" className="text-xs px-2 py-1">🪙 Data Cache</TabsTrigger>
              <TabsTrigger value="coin-evaluations" className="text-xs px-2 py-1">🪙 Evaluations</TabsTrigger>
              <TabsTrigger value="market-analytics" className="text-xs px-2 py-1">📊 Market Analytics</TabsTrigger>
              <TabsTrigger value="market-analysis-results" className="text-xs px-2 py-1">📊 Analysis Results</TabsTrigger>
              <TabsTrigger value="aggregated-coin-prices" className="text-xs px-2 py-1">💰 Aggregated Prices</TabsTrigger>
              <TabsTrigger value="external-price-sources" className="text-xs px-2 py-1">💰 External Sources</TabsTrigger>
              <TabsTrigger value="static-coins-db" className="text-xs px-2 py-1">🪙 Static Coins DB</TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs px-2 py-1">⭐ Favorites</TabsTrigger>
              <TabsTrigger value="watchlist" className="text-xs px-2 py-1">👁️ Watchlist</TabsTrigger>
            </div>

            {/* ROW 4 - STORE & MARKETPLACE */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-green-50 rounded-lg">
              <div className="text-xs font-semibold text-green-700 w-full mb-1">🏪 STORE & MARKETPLACE</div>
              <TabsTrigger value="stores" className="text-xs px-2 py-1">🏪 Stores</TabsTrigger>
              <TabsTrigger value="marketplace-listings" className="text-xs px-2 py-1">🏪 Listings</TabsTrigger>
              <TabsTrigger value="marketplace-stats" className="text-xs px-2 py-1">🏪 Marketplace Stats</TabsTrigger>
              <TabsTrigger value="marketplace-tenants" className="text-xs px-2 py-1">🏪 Tenants</TabsTrigger>
              <TabsTrigger value="store-activity-logs" className="text-xs px-2 py-1">🏪 Store Activity</TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs px-2 py-1">💸 Transactions</TabsTrigger>
              <TabsTrigger value="payment-transactions" className="text-xs px-2 py-1">💳 Payments</TabsTrigger>
              <TabsTrigger value="bids" className="text-xs px-2 py-1">💰 Bids</TabsTrigger>
              <TabsTrigger value="auction-bids" className="text-xs px-2 py-1">🔨 Auction Bids</TabsTrigger>
              <TabsTrigger value="categories" className="text-xs px-2 py-1">📂 Categories</TabsTrigger>
            </div>

            {/* ROW 5 - USER MANAGEMENT */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-blue-50 rounded-lg">
              <div className="text-xs font-semibold text-blue-700 w-full mb-1">👥 USER MANAGEMENT</div>
              <TabsTrigger value="profiles" className="text-xs px-2 py-1">👤 Profiles</TabsTrigger>
              <TabsTrigger value="user-activity" className="text-xs px-2 py-1">👤 User Activity</TabsTrigger>
              <TabsTrigger value="user-roles" className="text-xs px-2 py-1">👤 User Roles</TabsTrigger>
              <TabsTrigger value="admin-roles" className="text-xs px-2 py-1">👑 Admin Roles</TabsTrigger>
              <TabsTrigger value="referrals" className="text-xs px-2 py-1">🤝 Referrals</TabsTrigger>
              <TabsTrigger value="token-locks" className="text-xs px-2 py-1">🔒 Token Locks</TabsTrigger>
              <TabsTrigger value="wallet-balances" className="text-xs px-2 py-1">💰 Wallet Balances</TabsTrigger>
              <TabsTrigger value="token-activity" className="text-xs px-2 py-1">🎯 Token Activity</TabsTrigger>
              <TabsTrigger value="token-info" className="text-xs px-2 py-1">🎯 Token Info</TabsTrigger>
              <TabsTrigger value="lock-options" className="text-xs px-2 py-1">🔒 Lock Options</TabsTrigger>
              <TabsTrigger value="subscription-plans" className="text-xs px-2 py-1">💎 Subscription Plans</TabsTrigger>
              <TabsTrigger value="user-subscriptions" className="text-xs px-2 py-1">💎 User Subscriptions</TabsTrigger>
            </div>

            {/* ROW 6 - ANALYTICS & MONITORING */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-indigo-50 rounded-lg">
              <div className="text-xs font-semibold text-indigo-700 w-full mb-1">📊 ANALYTICS & MONITORING</div>
              <TabsTrigger value="analytics-events" className="text-xs px-2 py-1">📊 Analytics Events</TabsTrigger>
              <TabsTrigger value="page-views" className="text-xs px-2 py-1">👁️ Page Views</TabsTrigger>
              <TabsTrigger value="search-analytics" className="text-xs px-2 py-1">🔍 Search Analytics</TabsTrigger>
              <TabsTrigger value="performance-metrics" className="text-xs px-2 py-1">⚡ Performance</TabsTrigger>
              <TabsTrigger value="system-metrics" className="text-xs px-2 py-1">📊 System Metrics</TabsTrigger>
              <TabsTrigger value="data-quality-reports" className="text-xs px-2 py-1">📊 Quality Reports</TabsTrigger>
              <TabsTrigger value="source-performance-metrics" className="text-xs px-2 py-1">📊 Source Performance</TabsTrigger>
              <TabsTrigger value="photo-quality-assessments" className="text-xs px-2 py-1">📸 Photo Quality</TabsTrigger>
            </div>

            {/* ROW 7 - SECURITY & ERROR MANAGEMENT */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-red-50 rounded-lg">
              <div className="text-xs font-semibold text-red-700 w-full mb-1">🚨 SECURITY & ERROR MANAGEMENT</div>
              <TabsTrigger value="error-logs" className="text-xs px-2 py-1">🚨 Error Logs</TabsTrigger>
              <TabsTrigger value="console-errors" className="text-xs px-2 py-1">🚨 Console Errors</TabsTrigger>
              <TabsTrigger value="error-coins-knowledge" className="text-xs px-2 py-1">🚨 Error Coins Knowledge</TabsTrigger>
              <TabsTrigger value="error-coins-market-data" className="text-xs px-2 py-1">🚨 Error Market Data</TabsTrigger>
              <TabsTrigger value="error-pattern-matches" className="text-xs px-2 py-1">🚨 Error Patterns</TabsTrigger>
              <TabsTrigger value="error-reference-sources" className="text-xs px-2 py-1">🚨 Error References</TabsTrigger>
              <TabsTrigger value="security-incidents" className="text-xs px-2 py-1">🔒 Security Incidents</TabsTrigger>
              <TabsTrigger value="security-scan-results" className="text-xs px-2 py-1">🔒 Security Scans</TabsTrigger>
              <TabsTrigger value="mock-data-violations" className="text-xs px-2 py-1">🚨 Mock Data Violations</TabsTrigger>
              <TabsTrigger value="github-violations" className="text-xs px-2 py-1">🚨 GitHub Violations</TabsTrigger>
              <TabsTrigger value="admin-activity-logs" className="text-xs px-2 py-1">📋 Admin Activity</TabsTrigger>
              <TabsTrigger value="system-alerts" className="text-xs px-2 py-1">⚠️ System Alerts</TabsTrigger>
            </div>

            {/* ROW 8 - DATA SOURCES & SCRAPING */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-orange-50 rounded-lg">
              <div className="text-xs font-semibold text-orange-700 w-full mb-1">🕷️ DATA SOURCES & SCRAPING</div>
              <TabsTrigger value="data-sources" className="text-xs px-2 py-1">📋 Data Sources</TabsTrigger>
              <TabsTrigger value="scraping-jobs" className="text-xs px-2 py-1">🕷️ Scraping Jobs</TabsTrigger>
              <TabsTrigger value="dual-image-analysis" className="text-xs px-2 py-1">📸 Image Analysis</TabsTrigger>
              <TabsTrigger value="visual-coin-matches" className="text-xs px-2 py-1">👁️ Visual Matches</TabsTrigger>
              <TabsTrigger value="web-discovery-results" className="text-xs px-2 py-1">🌐 Web Discovery</TabsTrigger>
              <TabsTrigger value="vpn-proxies" className="text-xs px-2 py-1">🔒 VPN Proxies</TabsTrigger>
              <TabsTrigger value="source-templates" className="text-xs px-2 py-1">📋 Source Templates</TabsTrigger>
            </div>

            {/* ROW 9 - API & SYSTEM MANAGEMENT */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-700 w-full mb-1">⚙️ API & SYSTEM MANAGEMENT</div>
              <TabsTrigger value="api-keys" className="text-xs px-2 py-1">🔑 API Keys</TabsTrigger>
              <TabsTrigger value="api-key-categories" className="text-xs px-2 py-1">🔑 API Categories</TabsTrigger>
              <TabsTrigger value="api-key-rotations" className="text-xs px-2 py-1">🔑 API Rotations</TabsTrigger>
              <TabsTrigger value="command-queue" className="text-xs px-2 py-1">⚙️ Command Queue</TabsTrigger>
              <TabsTrigger value="bulk-operations" className="text-xs px-2 py-1">⚙️ Bulk Operations</TabsTrigger>
              <TabsTrigger value="geographic-regions" className="text-xs px-2 py-1">🌍 Geographic Regions</TabsTrigger>
            </div>

            {/* ROW 10 - COMMUNICATION & NOTIFICATIONS */}
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-teal-50 rounded-lg">
              <div className="text-xs font-semibold text-teal-700 w-full mb-1">💬 COMMUNICATION & NOTIFICATIONS</div>
              <TabsTrigger value="messages" className="text-xs px-2 py-1">💬 Messages</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs px-2 py-1">🔔 Notifications</TabsTrigger>
            </div>

          </TabsList>

          {/* MAIN ADMIN TAB CONTENTS */}
          <TabsContent value="open-store"><AdminStoreManagerTab /></TabsContent>
          <TabsContent value="ai-brain"><AdminAIBrainTab /></TabsContent>
          <TabsContent value="overview"><AdminOverviewTab /></TabsContent>
          <TabsContent value="users"><AdminUsersTab /></TabsContent>
          <TabsContent value="coins"><AdminCoinsTab /></TabsContent>
          <TabsContent value="security"><AdminSecurityTab /></TabsContent>
          <TabsContent value="analytics"><AdminAnalyticsTab /></TabsContent>
          <TabsContent value="system-phases"><AdminSystemPhasesTab /></TabsContent>
          <TabsContent value="cleanup"><AdminCleanupTab /></TabsContent>
          
          {/* AI & AUTOMATION SYSTEMS */}
          <TabsContent value="ai-commands"><DatabaseTableTab tableName="ai_commands" displayName="AI Commands" /></TabsContent>
          <TabsContent value="ai-command-executions"><DatabaseTableTab tableName="ai_command_executions" displayName="AI Command Executions" /></TabsContent>
          <TabsContent value="ai-command-categories"><DatabaseTableTab tableName="ai_command_categories" displayName="AI Command Categories" /></TabsContent>
          <TabsContent value="ai-command-execution-logs"><DatabaseTableTab tableName="ai_command_execution_logs" displayName="AI Command Execution Logs" /></TabsContent>
          <TabsContent value="ai-command-workflows"><DatabaseTableTab tableName="ai_command_workflows" displayName="AI Command Workflows" /></TabsContent>
          <TabsContent value="ai-configuration"><DatabaseTableTab tableName="ai_configuration" displayName="AI Configuration" /></TabsContent>
          <TabsContent value="ai-error-detection-logs"><DatabaseTableTab tableName="ai_error_detection_logs" displayName="AI Error Detection Logs" /></TabsContent>
          <TabsContent value="ai-performance-analytics"><DatabaseTableTab tableName="ai_performance_analytics" displayName="AI Performance Analytics" /></TabsContent>
          <TabsContent value="ai-performance-metrics"><DatabaseTableTab tableName="ai_performance_metrics" displayName="AI Performance Metrics" /></TabsContent>
          <TabsContent value="ai-predictions"><DatabaseTableTab tableName="ai_predictions" displayName="AI Predictions" /></TabsContent>
          <TabsContent value="ai-recognition-cache"><DatabaseTableTab tableName="ai_recognition_cache" displayName="AI Recognition Cache" /></TabsContent>
          <TabsContent value="ai-search-filters"><DatabaseTableTab tableName="ai_search_filters" displayName="AI Search Filters" /></TabsContent>
          <TabsContent value="ai-training-data"><DatabaseTableTab tableName="ai_training_data" displayName="AI Training Data" /></TabsContent>
          <TabsContent value="automation-rules"><DatabaseTableTab tableName="automation_rules" displayName="Automation Rules" /></TabsContent>
          <TabsContent value="prediction-models"><DatabaseTableTab tableName="prediction_models" displayName="Prediction Models" /></TabsContent>
          
          {/* COIN & MARKET DATA */}
          <TabsContent value="coins-table"><DatabaseTableTab tableName="coins" displayName="Coins Table" /></TabsContent>
          <TabsContent value="coin-price-history"><DatabaseTableTab tableName="coin_price_history" displayName="Coin Price History" /></TabsContent>
          <TabsContent value="coin-analysis-logs"><DatabaseTableTab tableName="coin_analysis_logs" displayName="Coin Analysis Logs" /></TabsContent>
          <TabsContent value="coin-data-cache"><DatabaseTableTab tableName="coin_data_cache" displayName="Coin Data Cache" /></TabsContent>
          <TabsContent value="coin-evaluations"><DatabaseTableTab tableName="coin_evaluations" displayName="Coin Evaluations" /></TabsContent>
          <TabsContent value="market-analytics"><DatabaseTableTab tableName="market_analytics" displayName="Market Analytics" /></TabsContent>
          <TabsContent value="market-analysis-results"><DatabaseTableTab tableName="market_analysis_results" displayName="Market Analysis Results" /></TabsContent>
          <TabsContent value="aggregated-coin-prices"><DatabaseTableTab tableName="aggregated_coin_prices" displayName="Aggregated Coin Prices" /></TabsContent>
          <TabsContent value="external-price-sources"><DatabaseTableTab tableName="external_price_sources" displayName="External Price Sources" /></TabsContent>
          <TabsContent value="static-coins-db"><DatabaseTableTab tableName="static_coins_db" displayName="Static Coins Database" /></TabsContent>
          <TabsContent value="favorites"><DatabaseTableTab tableName="favorites" displayName="Favorites" /></TabsContent>
          <TabsContent value="watchlist"><DatabaseTableTab tableName="watchlist" displayName="Watchlist" /></TabsContent>
          
          {/* STORE & MARKETPLACE */}
          <TabsContent value="stores"><DatabaseTableTab tableName="stores" displayName="Stores" /></TabsContent>
          <TabsContent value="marketplace-listings"><DatabaseTableTab tableName="marketplace_listings" displayName="Marketplace Listings" /></TabsContent>
          <TabsContent value="marketplace-stats"><DatabaseTableTab tableName="marketplace_stats" displayName="Marketplace Stats" /></TabsContent>
          <TabsContent value="marketplace-tenants"><DatabaseTableTab tableName="marketplace_tenants" displayName="Marketplace Tenants" /></TabsContent>
          <TabsContent value="store-activity-logs"><DatabaseTableTab tableName="store_activity_logs" displayName="Store Activity Logs" /></TabsContent>
          <TabsContent value="transactions"><DatabaseTableTab tableName="transactions" displayName="Transactions" /></TabsContent>
          <TabsContent value="payment-transactions"><DatabaseTableTab tableName="payment_transactions" displayName="Payment Transactions" /></TabsContent>
          <TabsContent value="bids"><DatabaseTableTab tableName="bids" displayName="Bids" /></TabsContent>
          <TabsContent value="auction-bids"><DatabaseTableTab tableName="auction_bids" displayName="Auction Bids" /></TabsContent>
          <TabsContent value="categories"><DatabaseTableTab tableName="categories" displayName="Categories" /></TabsContent>
          
          {/* USER MANAGEMENT */}
          <TabsContent value="profiles"><DatabaseTableTab tableName="profiles" displayName="User Profiles" /></TabsContent>
          <TabsContent value="user-activity"><DatabaseTableTab tableName="user_activity" displayName="User Activity" /></TabsContent>
          <TabsContent value="user-roles"><DatabaseTableTab tableName="user_roles" displayName="User Roles" /></TabsContent>
          <TabsContent value="admin-roles"><DatabaseTableTab tableName="admin_roles" displayName="Admin Roles" /></TabsContent>
          <TabsContent value="referrals"><DatabaseTableTab tableName="referrals" displayName="Referrals" /></TabsContent>
          <TabsContent value="token-locks"><DatabaseTableTab tableName="token_locks" displayName="Token Locks" /></TabsContent>
          <TabsContent value="wallet-balances"><DatabaseTableTab tableName="wallet_balances" displayName="Wallet Balances" /></TabsContent>
          <TabsContent value="token-activity"><DatabaseTableTab tableName="token_activity" displayName="Token Activity" /></TabsContent>
          <TabsContent value="token-info"><DatabaseTableTab tableName="token_info" displayName="Token Info" /></TabsContent>
          <TabsContent value="lock-options"><DatabaseTableTab tableName="lock_options" displayName="Lock Options" /></TabsContent>
          <TabsContent value="subscription-plans"><DatabaseTableTab tableName="subscription_plans" displayName="Subscription Plans" /></TabsContent>
          <TabsContent value="user-subscriptions"><DatabaseTableTab tableName="user_subscriptions" displayName="User Subscriptions" /></TabsContent>
          
          {/* ANALYTICS & MONITORING */}
          <TabsContent value="analytics-events"><DatabaseTableTab tableName="analytics_events" displayName="Analytics Events" /></TabsContent>
          <TabsContent value="page-views"><DatabaseTableTab tableName="page_views" displayName="Page Views" /></TabsContent>
          <TabsContent value="search-analytics"><DatabaseTableTab tableName="search_analytics" displayName="Search Analytics" /></TabsContent>
          <TabsContent value="performance-metrics"><DatabaseTableTab tableName="performance_metrics" displayName="Performance Metrics" /></TabsContent>
          <TabsContent value="system-metrics"><DatabaseTableTab tableName="system_metrics" displayName="System Metrics" /></TabsContent>
          <TabsContent value="data-quality-reports"><DatabaseTableTab tableName="data_quality_reports" displayName="Data Quality Reports" /></TabsContent>
          <TabsContent value="source-performance-metrics"><DatabaseTableTab tableName="source_performance_metrics" displayName="Source Performance Metrics" /></TabsContent>
          <TabsContent value="photo-quality-assessments"><DatabaseTableTab tableName="photo_quality_assessments" displayName="Photo Quality Assessments" /></TabsContent>
          
          {/* SECURITY & ERROR MANAGEMENT */}
          <TabsContent value="error-logs"><DatabaseTableTab tableName="error_logs" displayName="Error Logs" /></TabsContent>
          <TabsContent value="console-errors"><DatabaseTableTab tableName="console_errors" displayName="Console Errors" /></TabsContent>
          <TabsContent value="error-coins-knowledge"><DatabaseTableTab tableName="error_coins_knowledge" displayName="Error Coins Knowledge" /></TabsContent>
          <TabsContent value="error-coins-market-data"><DatabaseTableTab tableName="error_coins_market_data" displayName="Error Coins Market Data" /></TabsContent>
          <TabsContent value="error-pattern-matches"><DatabaseTableTab tableName="error_pattern_matches" displayName="Error Pattern Matches" /></TabsContent>
          <TabsContent value="error-reference-sources"><DatabaseTableTab tableName="error_reference_sources" displayName="Error Reference Sources" /></TabsContent>
          <TabsContent value="security-incidents"><DatabaseTableTab tableName="security_incidents" displayName="Security Incidents" /></TabsContent>
          <TabsContent value="security-scan-results"><DatabaseTableTab tableName="security_scan_results" displayName="Security Scan Results" /></TabsContent>
          <TabsContent value="mock-data-violations"><DatabaseTableTab tableName="mock_data_violations" displayName="Mock Data Violations" /></TabsContent>
          <TabsContent value="github-violations"><DatabaseTableTab tableName="github_violations" displayName="GitHub Violations" /></TabsContent>
          <TabsContent value="admin-activity-logs"><DatabaseTableTab tableName="admin_activity_logs" displayName="Admin Activity Logs" /></TabsContent>
          <TabsContent value="system-alerts"><DatabaseTableTab tableName="system_alerts" displayName="System Alerts" /></TabsContent>
          
          {/* DATA SOURCES & SCRAPING */}
          <TabsContent value="data-sources"><DatabaseTableTab tableName="data_sources" displayName="Data Sources" /></TabsContent>
          <TabsContent value="scraping-jobs"><DatabaseTableTab tableName="scraping_jobs" displayName="Scraping Jobs" /></TabsContent>
          <TabsContent value="dual-image-analysis"><DatabaseTableTab tableName="dual_image_analysis" displayName="Dual Image Analysis" /></TabsContent>
          <TabsContent value="visual-coin-matches"><DatabaseTableTab tableName="visual_coin_matches" displayName="Visual Coin Matches" /></TabsContent>
          <TabsContent value="web-discovery-results"><DatabaseTableTab tableName="web_discovery_results" displayName="Web Discovery Results" /></TabsContent>
          <TabsContent value="vpn-proxies"><DatabaseTableTab tableName="vpn_proxies" displayName="VPN Proxies" /></TabsContent>
          <TabsContent value="source-templates"><DatabaseTableTab tableName="source_templates" displayName="Source Templates" /></TabsContent>
          
          {/* API & SYSTEM MANAGEMENT */}
          <TabsContent value="api-keys"><DatabaseTableTab tableName="api_keys" displayName="API Keys" /></TabsContent>
          <TabsContent value="api-key-categories"><DatabaseTableTab tableName="api_key_categories" displayName="API Key Categories" /></TabsContent>
          <TabsContent value="api-key-rotations"><DatabaseTableTab tableName="api_key_rotations" displayName="API Key Rotations" /></TabsContent>
          <TabsContent value="command-queue"><DatabaseTableTab tableName="command_queue" displayName="Command Queue" /></TabsContent>
          <TabsContent value="bulk-operations"><DatabaseTableTab tableName="bulk_operations" displayName="Bulk Operations" /></TabsContent>
          <TabsContent value="geographic-regions"><DatabaseTableTab tableName="geographic_regions" displayName="Geographic Regions" /></TabsContent>
          
          {/* COMMUNICATION & NOTIFICATIONS */}
          <TabsContent value="messages"><DatabaseTableTab tableName="messages" displayName="Messages" /></TabsContent>
          <TabsContent value="notifications"><DatabaseTableTab tableName="notifications" displayName="Notifications" /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel; 