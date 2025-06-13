
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, Shield, Users, Coins, Brain, ShoppingCart, BarChart3, 
  Globe, Settings, AlertTriangle, Key, Activity, Store, Gavel, 
  TrendingUp, Search, Bot, Cog, Bell, FileText, Eye
} from 'lucide-react';

const ExpandedAdminTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-8 gap-1">
      {/* Core System */}
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        Overview
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

      {/* AI System */}
      <TabsTrigger value="ai-commands" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        AI Commands
      </TabsTrigger>
      <TabsTrigger value="ai-executions" className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        AI Executions
      </TabsTrigger>
      <TabsTrigger value="ai-predictions" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        AI Predictions
      </TabsTrigger>
      <TabsTrigger value="automation-rules" className="flex items-center gap-2">
        <Cog className="h-4 w-4" />
        Automation
      </TabsTrigger>

      {/* Error & Knowledge */}
      <TabsTrigger value="error-knowledge" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Error Knowledge
      </TabsTrigger>
      <TabsTrigger value="error-market-data" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Error Market
      </TabsTrigger>
      <TabsTrigger value="error-detection" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Error Detection
      </TabsTrigger>

      {/* Marketplace */}
      <TabsTrigger value="stores" className="flex items-center gap-2">
        <Store className="h-4 w-4" />
        Stores
      </TabsTrigger>
      <TabsTrigger value="marketplace-listings" className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Listings
      </TabsTrigger>
      <TabsTrigger value="marketplace-stats" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Marketplace Stats
      </TabsTrigger>
      <TabsTrigger value="auctions" className="flex items-center gap-2">
        <Gavel className="h-4 w-4" />
        Auctions
      </TabsTrigger>
      <TabsTrigger value="transactions" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Transactions
      </TabsTrigger>

      {/* Data Sources */}
      <TabsTrigger value="external-sources" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        External Sources
      </TabsTrigger>
      <TabsTrigger value="scraping-jobs" className="flex items-center gap-2">
        <Bot className="h-4 w-4" />
        Scraping Jobs
      </TabsTrigger>
      <TabsTrigger value="data-quality" className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Data Quality
      </TabsTrigger>
      <TabsTrigger value="geographic-data" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Geographic
      </TabsTrigger>
      <TabsTrigger value="price-history" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Price History
      </TabsTrigger>
      <TabsTrigger value="data-cache" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        Data Cache
      </TabsTrigger>

      {/* Analytics */}
      <TabsTrigger value="analytics-events" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Analytics Events
      </TabsTrigger>
      <TabsTrigger value="user-analytics" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        User Analytics
      </TabsTrigger>
      <TabsTrigger value="search-analytics" className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        Search Analytics
      </TabsTrigger>
      <TabsTrigger value="market-analytics" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Market Analytics
      </TabsTrigger>

      {/* Performance & AI */}
      <TabsTrigger value="ai-performance" className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        AI Performance
      </TabsTrigger>
      <TabsTrigger value="ai-training" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        AI Training
      </TabsTrigger>
      <TabsTrigger value="ai-cache" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        AI Cache
      </TabsTrigger>
      <TabsTrigger value="ai-config" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        AI Config
      </TabsTrigger>

      {/* System Management */}
      <TabsTrigger value="system-metrics" className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        System Metrics
      </TabsTrigger>
      <TabsTrigger value="performance" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Performance
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Security
      </TabsTrigger>
      <TabsTrigger value="api-keys" className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        API Keys
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
      </TabsTrigger>
      <TabsTrigger value="logs" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Logs
      </TabsTrigger>
    </TabsList>
  );
};

export default ExpandedAdminTabs;
