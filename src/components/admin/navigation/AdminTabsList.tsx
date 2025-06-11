
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Coins, 
  Brain, 
  Shield, 
  Key, 
  Gavel, 
  Store, 
  Bell, 
  FileText, 
  Settings,
  User,
  Database,
  Activity,
  Globe,
  Search,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  Monitor,
  Layers,
  HardDrive,
  Cpu,
  WifiOff,
  Clock,
  BarChart2,
  DollarSign,
  MapPin,
  Tags,
  Server,
  Palette
} from 'lucide-react';

const AdminTabsList = () => {
  return (
    <div className="space-y-4">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1">
        <TabsTrigger 
          value="overview" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="users" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Users</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="coins" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Coins className="h-4 w-4" />
          <span className="hidden sm:inline">Coins</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="stores" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Store className="h-4 w-4" />
          <span className="hidden sm:inline">Stores</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="ai-brain" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">AI Brain</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="data-sources" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Database className="h-4 w-4" />
          <span className="hidden sm:inline">Data Sources</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="ai-performance" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">AI Performance</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="scraping" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Scraping</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="automation" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Automation</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="predictions" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Predictions</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="system-monitoring" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Monitor className="h-4 w-4" />
          <span className="hidden sm:inline">System</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="categories" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Tags className="h-4 w-4" />
          <span className="hidden sm:inline">Categories</span>
        </TabsTrigger>
      </TabsList>

      {/* Second row for additional tabs */}
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1">
        <TabsTrigger 
          value="security" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="analytics" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <BarChart2 className="h-4 w-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="api-keys" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Key className="h-4 w-4" />
          <span className="hidden sm:inline">API Keys</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="auctions" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Gavel className="h-4 w-4" />
          <span className="hidden sm:inline">Auctions</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="marketplace" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Store className="h-4 w-4" />
          <span className="hidden sm:inline">Marketplace</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="notifications" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="revenue" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Revenue</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="geography" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Geography</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="error-coins" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden sm:inline">Error Coins</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="bulk-ops" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Bulk Ops</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="logs" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Logs</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="settings" 
          className="flex items-center gap-2 text-xs lg:text-sm"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminTabsList;
