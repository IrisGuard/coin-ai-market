
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain,
  Users, 
  Coins, 
  Key,
  BarChart3,
  Settings,
  User,
  Database,
  Globe,
  Zap,
  DollarSign,
  AlertTriangle,
  Bell,
  CreditCard,
  Tags,
  Store,
  Shield,
  Package,
  Activity,
  Search
} from 'lucide-react';

const CompleteAdminTabsList = () => {
  const tabs = [
    { value: 'ai-brain', icon: Brain, label: 'AI Brain' },
    { value: 'analytics', icon: BarChart3, label: 'Analytics' },
    { value: 'monitoring', icon: Activity, label: 'Live Monitor' },
    { value: 'error-monitoring', icon: AlertTriangle, label: 'Errors' },
    { value: 'users', icon: Users, label: 'Users' },
    { value: 'coins', icon: Coins, label: 'Coins' },
    { value: 'categories', icon: Tags, label: 'Categories' },
    { value: 'stores', icon: Store, label: 'Stores' },
    { value: 'transactions', icon: CreditCard, label: 'Transactions' },
    { value: 'payments', icon: DollarSign, label: 'Payments' },
    { value: 'bulk-operations', icon: Package, label: 'Bulk Ops' },
    { value: 'data-sources', icon: Database, label: 'Data Sources' },
    { value: 'external-sources', icon: Globe, label: 'External' },
    { value: 'scraping', icon: Zap, label: 'Scraping' },
    { value: 'price-aggregation', icon: Search, label: 'Prices' },
    { value: 'api-keys', icon: Key, label: 'API Keys' },
    { value: 'security', icon: Shield, label: 'Security' },
    { value: 'notifications', icon: Bell, label: 'Alerts' },
    { value: 'profile', icon: User, label: 'Profile' },
    { value: 'system', icon: Settings, label: 'System' }
  ];

  return (
    <div className="border-b">
      <ScrollArea className="w-full">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-none bg-transparent p-0 w-max">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none text-xs"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
    </div>
  );
};

export default CompleteAdminTabsList;
