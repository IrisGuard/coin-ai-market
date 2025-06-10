
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
  AlertCircle,
  Bell,
  CreditCard,
  Grid3X3,
  Store
} from 'lucide-react';

const AdminTabsList = () => {
  const tabs = [
    { value: 'ai-brain', icon: Brain, label: 'AI Brain' },
    { value: 'profile', icon: User, label: 'Profile' },
    { value: 'users', icon: Users, label: 'Users' },
    { value: 'coins', icon: Coins, label: 'Coins' },
    { value: 'error-coins', icon: AlertCircle, label: 'Error Coins' },
    { value: 'categories', icon: Grid3X3, label: 'Categories' },
    { value: 'store-management', icon: Store, label: 'Store Management' },
    { value: 'data-sources', icon: Database, label: 'Data Sources' },
    { value: 'external-sources', icon: Globe, label: 'External Sources' },
    { value: 'scraping', icon: Zap, label: 'Scraping' },
    { value: 'price-aggregation', icon: DollarSign, label: 'Price Aggregation' },
    { value: 'api-keys', icon: Key, label: 'API Keys' },
    { value: 'analytics', icon: BarChart3, label: 'Analytics' },
    { value: 'error-monitoring', icon: AlertTriangle, label: 'Error Monitoring' },
    { value: 'notifications', icon: Bell, label: 'Notifications' },
    { value: 'transactions', icon: CreditCard, label: 'Transactions' },
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
              className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 rounded-none"
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

export default AdminTabsList;
