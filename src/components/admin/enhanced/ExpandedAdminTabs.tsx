
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, Users, Coins, Store, Brain, Database, Zap, Bot, TrendingUp, Shield,
  Key, Gavel, ShoppingCart, Bell, FileText, Settings, User, Globe, Eye, AlertTriangle,
  Activity, UserCheck, Monitor, Search, Upload, Target, BookOpen, Microscope,
  Calculator, CloudDownload, Layers, Network, Cpu, HardDrive, Lock
} from 'lucide-react';

const ExpandedAdminTabs = () => {
  const expandedTabs = [
    // Core Dashboard & Database
    { id: 'overview', label: 'Overview', icon: BarChart3, category: 'core' },
    { id: 'database', label: 'Database', icon: Database, category: 'core' },
    { id: 'users', label: 'Users', icon: Users, category: 'core' },
    { id: 'coins', label: 'Coins', icon: Coins, category: 'core' },
    
    // AI Brain - 8 sub-interfaces
    { id: 'ai-commands', label: 'AI Commands', icon: Brain, category: 'ai' },
    { id: 'ai-executions', label: 'AI Executions', icon: Activity, category: 'ai' },
    { id: 'ai-predictions', label: 'AI Predictions', icon: TrendingUp, category: 'ai' },
    { id: 'automation-rules', label: 'Automation', icon: Bot, category: 'ai' },
    { id: 'ai-performance', label: 'AI Performance', icon: Zap, category: 'ai' },
    { id: 'ai-training', label: 'AI Training', icon: Microscope, category: 'ai' },
    { id: 'ai-cache', label: 'AI Cache', icon: HardDrive, category: 'ai' },
    { id: 'ai-config', label: 'AI Config', icon: Settings, category: 'ai' },
    
    // Error Detection - 3 sub-interfaces
    { id: 'error-knowledge', label: 'Error Knowledge', icon: BookOpen, category: 'errors' },
    { id: 'error-market-data', label: 'Error Market', icon: Calculator, category: 'errors' },
    { id: 'error-detection', label: 'Error Detection', icon: AlertTriangle, category: 'errors' },
    
    // Marketplace - 5 sub-interfaces
    { id: 'stores', label: 'Stores', icon: Store, category: 'marketplace' },
    { id: 'marketplace-listings', label: 'Listings', icon: ShoppingCart, category: 'marketplace' },
    { id: 'marketplace-stats', label: 'Market Stats', icon: BarChart3, category: 'marketplace' },
    { id: 'auctions', label: 'Auctions', icon: Gavel, category: 'marketplace' },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp, category: 'marketplace' },
    
    // Data Sources - 6 sub-interfaces
    { id: 'external-sources', label: 'External Sources', icon: Globe, category: 'data' },
    { id: 'scraping-jobs', label: 'Scraping Jobs', icon: CloudDownload, category: 'data' },
    { id: 'data-quality', label: 'Data Quality', icon: Target, category: 'data' },
    { id: 'geographic-data', label: 'Geographic', icon: Globe, category: 'data' },
    { id: 'price-history', label: 'Price History', icon: TrendingUp, category: 'data' },
    { id: 'data-cache', label: 'Data Cache', icon: Database, category: 'data' },
    
    // Analytics - 4 sub-interfaces
    { id: 'analytics-events', label: 'Events', icon: Activity, category: 'analytics' },
    { id: 'user-analytics', label: 'User Analytics', icon: UserCheck, category: 'analytics' },
    { id: 'search-analytics', label: 'Search Analytics', icon: Search, category: 'analytics' },
    { id: 'market-analytics', label: 'Market Analytics', icon: TrendingUp, category: 'analytics' },
    
    // System Management - 6 sub-interfaces
    { id: 'system-metrics', label: 'System Metrics', icon: Monitor, category: 'system' },
    { id: 'performance', label: 'Performance', icon: Cpu, category: 'system' },
    { id: 'security', label: 'Security', icon: Shield, category: 'system' },
    { id: 'api-keys', label: 'API Keys', icon: Key, category: 'system' },
    { id: 'notifications', label: 'Notifications', icon: Bell, category: 'system' },
    { id: 'logs', label: 'Logs', icon: FileText, category: 'system' }
  ];

  return (
    <div className="w-full">
      <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 h-auto p-1 bg-muted rounded-lg">
        {expandedTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:block truncate">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default ExpandedAdminTabs;
