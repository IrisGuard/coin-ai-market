
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Coins, 
  Store,
  Brain,
  Database,
  Zap,
  Bot,
  TrendingUp,
  Shield,
  Key,
  Gavel,
  ShoppingCart,
  Bell,
  FileText,
  Settings,
  User,
  Globe,
  Eye,
  AlertTriangle,
  Activity,
  UserCheck,
  Monitor,
  Search
} from 'lucide-react';

const AdminTabsList = () => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'coins', label: 'Coins', icon: Coins },
    { id: 'stores', label: 'Stores', icon: Store },
    
    // AI & Analysis Group
    { id: 'ai-brain', label: 'AI Brain', icon: Brain },
    { id: 'dual-analysis', label: 'Dual Analysis', icon: Eye },
    { id: 'web-discovery', label: 'Web Discovery', icon: Globe },
    { id: 'visual-matching', label: 'Visual Matching', icon: Search },
    { id: 'error-detection', label: 'Error Detection', icon: AlertTriangle },
    { id: 'market-intelligence', label: 'Market Intel', icon: TrendingUp },
    
    // Data & Sources Group
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'ai-performance', label: 'AI Performance', icon: Zap },
    { id: 'automation', label: 'Automation', icon: Bot },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    
    // System & Monitoring Group
    { id: 'real-time-monitoring', label: 'Real-Time Monitor', icon: Monitor },
    { id: 'user-activity', label: 'User Activity', icon: UserCheck },
    { id: 'system-monitoring', label: 'System Monitor', icon: Activity },
    
    // Business Group
    { id: 'categories', label: 'Categories', icon: Coins },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'geography', label: 'Geography', icon: Globe },
    { id: 'error-coins', label: 'Error Coins', icon: AlertTriangle },
    { id: 'bulk-ops', label: 'Bulk Ops', icon: Database },
    
    // Core Admin Group
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'auctions', label: 'Auctions', icon: Gavel },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="w-full">
      <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 h-auto p-1 bg-muted rounded-lg">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:block">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default AdminTabsList;
