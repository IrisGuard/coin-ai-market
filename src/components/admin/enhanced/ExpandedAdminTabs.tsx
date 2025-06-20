
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, Database, Users, Coins, Bot, Brain, Target, 
  TrendingUp, Store, ShoppingCart, ExternalLink, Cog, 
  Shield, Key, Bell, FileText, Activity, Search, Globe,
  AlertTriangle, Eye, DollarSign, Zap, Settings, Lock
} from 'lucide-react';

const ExpandedAdminTabs = () => {
  return (
    <TabsList className="h-auto p-2 bg-white border rounded-lg shadow-sm w-full">
      <div className="grid grid-cols-8 xl:grid-cols-10 gap-2 w-full">
        {/* Row 1 - AI & Core Features */}
        <TabsTrigger value="ai-brain" className="flex flex-col items-center gap-1 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-700">
          <Brain className="h-5 w-5" />
          <span className="text-xs font-bold">🧠 AI BRAIN</span>
        </TabsTrigger>
        <TabsTrigger value="overview" className="flex flex-col items-center gap-1 h-16">
          <Activity className="h-4 w-4" />
          <span className="text-xs">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="database" className="flex flex-col items-center gap-1 h-16">
          <Database className="h-4 w-4" />
          <span className="text-xs">Database</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="flex flex-col items-center gap-1 h-16">
          <Users className="h-4 w-4" />
          <span className="text-xs">Users</span>
        </TabsTrigger>
        <TabsTrigger value="coins" className="flex flex-col items-center gap-1 h-16">
          <Coins className="h-4 w-4" />
          <span className="text-xs">Coins</span>
        </TabsTrigger>
        <TabsTrigger value="stores" className="flex flex-col items-center gap-1 h-16">
          <Store className="h-4 w-4" />
          <span className="text-xs">Stores</span>
        </TabsTrigger>
        <TabsTrigger value="ai-commands" className="flex flex-col items-center gap-1 h-16">
          <Bot className="h-4 w-4" />
          <span className="text-xs">AI Commands</span>
        </TabsTrigger>
        <TabsTrigger value="ai-executions" className="flex flex-col items-center gap-1 h-16">
          <Zap className="h-4 w-4" />
          <span className="text-xs">Executions</span>
        </TabsTrigger>
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:gap-1 xl:h-16">
          <TabsTrigger value="ai-predictions" className="flex flex-col items-center gap-1 h-16 w-full">
            <Brain className="h-4 w-4" />
            <span className="text-xs">Predictions</span>
          </TabsTrigger>
        </div>
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:gap-1 xl:h-16">
          <TabsTrigger value="automation-rules" className="flex flex-col items-center gap-1 h-16 w-full">
            <Target className="h-4 w-4" />
            <span className="text-xs">Automation</span>
          </TabsTrigger>
        </div>

        {/* Row 2 - AI System Management */}
        <TabsTrigger value="ai-performance" className="flex flex-col items-center gap-1 h-16">
          <Brain className="h-4 w-4" />
          <span className="text-xs">AI Perf</span>
        </TabsTrigger>
        <TabsTrigger value="ai-training" className="flex flex-col items-center gap-1 h-16">
          <Target className="h-4 w-4" />
          <span className="text-xs">Training</span>
        </TabsTrigger>
        <TabsTrigger value="error-knowledge" className="flex flex-col items-center gap-1 h-16">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">Error Base</span>
        </TabsTrigger>
        <TabsTrigger value="error-market-data" className="flex flex-col items-center gap-1 h-16">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">Market Data</span>
        </TabsTrigger>
        <TabsTrigger value="error-detection" className="flex flex-col items-center gap-1 h-16">
          <Eye className="h-4 w-4" />
          <span className="text-xs">Detection</span>
        </TabsTrigger>
        <TabsTrigger value="ai-cache" className="flex flex-col items-center gap-1 h-16">
          <Database className="h-4 w-4" />
          <span className="text-xs">AI Cache</span>
        </TabsTrigger>
        <TabsTrigger value="ai-config" className="flex flex-col items-center gap-1 h-16">
          <Settings className="h-4 w-4" />
          <span className="text-xs">AI Config</span>
        </TabsTrigger>
        <TabsTrigger value="marketplace-listings" className="flex flex-col items-center gap-1 h-16">
          <ShoppingCart className="h-4 w-4" />
          <span className="text-xs">Listings</span>
        </TabsTrigger>
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:gap-1 xl:h-16">
          <TabsTrigger value="auctions" className="flex flex-col items-center gap-1 h-16 w-full">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs">Auctions</span>
          </TabsTrigger>
        </div>
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:gap-1 xl:h-16">
          <TabsTrigger value="transactions" className="flex flex-col items-center gap-1 h-16 w-full">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Transactions</span>
          </TabsTrigger>
        </div>

        {/* Row 3 - Data & Analytics */}
        <TabsTrigger value="external-sources" className="flex flex-col items-center gap-1 h-16">
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs">Sources</span>
        </TabsTrigger>
        <TabsTrigger value="scraping-jobs" className="flex flex-col items-center gap-1 h-16">
          <Bot className="h-4 w-4" />
          <span className="text-xs">Scraping</span>
        </TabsTrigger>
        <TabsTrigger value="data-quality" className="flex flex-col items-center gap-1 h-16">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Quality</span>
        </TabsTrigger>
        <TabsTrigger value="analytics-events" className="flex flex-col items-center gap-1 h-16">
          <BarChart3 className="h-4 w-4" />
          <span className="text-xs">Events</span>
        </TabsTrigger>
        <TabsTrigger value="user-analytics" className="flex flex-col items-center gap-1 h-16">
          <Users className="h-4 w-4" />
          <span className="text-xs">User Stats</span>
        </TabsTrigger>
        <TabsTrigger value="search-analytics" className="flex flex-col items-center gap-1 h-16">
          <Search className="h-4 w-4" />
          <span className="text-xs">Search</span>
        </TabsTrigger>
        <TabsTrigger value="market-analytics" className="flex flex-col items-center gap-1 h-16">
          <Globe className="h-4 w-4" />
          <span className="text-xs">Market</span>
        </TabsTrigger>
        <TabsTrigger value="geographic-data" className="flex flex-col items-center gap-1 h-16">
          <Globe className="h-4 w-4" />
          <span className="text-xs">Geography</span>
        </TabsTrigger>
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:gap-1 xl:h-16">
          <TabsTrigger value="price-history" className="flex flex-col items-center gap-1 h-16 w-full">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Price Hist</span>
          </TabsTrigger>
        </div>
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:gap-1 xl:h-16">
          <TabsTrigger value="system-metrics" className="flex flex-col items-center gap-1 h-16 w-full">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Metrics</span>
          </TabsTrigger>
        </div>

        {/* Row 4 - System Management */}
        <TabsTrigger value="performance" className="flex flex-col items-center gap-1 h-16">
          <Zap className="h-4 w-4" />
          <span className="text-xs">Performance</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex flex-col items-center gap-1 h-16">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Security</span>
        </TabsTrigger>
        <TabsTrigger value="api-keys" className="flex flex-col items-center gap-1 h-16">
          <Key className="h-4 w-4" />
          <span className="text-xs">API Keys</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 h-16">
          <Bell className="h-4 w-4" />
          <span className="text-xs">Alerts</span>
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex flex-col items-center gap-1 h-16">
          <FileText className="h-4 w-4" />
          <span className="text-xs">Logs</span>
        </TabsTrigger>
        <TabsTrigger value="data-cache" className="flex flex-col items-center gap-1 h-16">
          <Database className="h-4 w-4" />
          <span className="text-xs">Data Cache</span>
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 h-16">
          <BarChart3 className="h-4 w-4" />
          <span className="text-xs">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="marketplace-stats" className="flex flex-col items-center gap-1 h-16">
          <BarChart3 className="h-4 w-4" />
          <span className="text-xs">MP Stats</span>
        </TabsTrigger>
      </div>
    </TabsList>
  );
};

export default ExpandedAdminTabs;
