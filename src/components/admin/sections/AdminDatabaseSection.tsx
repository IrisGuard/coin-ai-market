
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Table, Users, Coins, ShoppingCart, Brain, BarChart3, Settings, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import existing sections
import AdminUsersSection from '../AdminUsersSection';
import AdminCoinsSection from '../AdminCoinsSection';
import AdminAISection from './AdminAISection';
import AdminMarketplaceSection from './AdminMarketplaceSection';
import AdminAnalyticsSection from './AdminAnalyticsSection';
import AdminDataSourcesSection from './AdminDataSourcesSection';
import AdminSystemSection from './AdminSystemSection';

// New comprehensive table sections
import DatabaseTablesManagement from '../database/DatabaseTablesManagement';
import SecurityTablesSection from '../security/SecurityTablesSection';
import PaymentTablesSection from '../payments/PaymentTablesSection';
import ErrorManagementSection from '../errors/ErrorManagementSection';
import GeographicDataSection from '../geographic/GeographicDataSection';

const AdminDatabaseSection = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  
  const tableCategories = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Database,
      color: 'bg-blue-500',
      tables: 84,
      description: 'Database overview and health'
    },
    {
      id: 'users',
      name: 'Users & Auth',
      icon: Users,
      color: 'bg-green-500',
      tables: 8,
      description: 'User management and authentication'
    },
    {
      id: 'coins',
      name: 'Coins & Items',
      icon: Coins,
      color: 'bg-yellow-500',
      tables: 12,
      description: 'Coin catalog and evaluations'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      tables: 9,
      description: 'Marketplace and auctions'
    },
    {
      id: 'ai_system',
      name: 'AI System',
      icon: Brain,
      color: 'bg-indigo-500',
      tables: 14,
      description: 'AI commands and analytics'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'bg-cyan-500',
      tables: 7,
      description: 'Analytics and reporting'
    },
    {
      id: 'data_sources',
      name: 'Data Sources',
      icon: Database,
      color: 'bg-orange-500',
      tables: 11,
      description: 'External data and APIs'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: 'bg-red-500',
      tables: 6,
      description: 'Security and admin logs'
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: Zap,
      color: 'bg-emerald-500',
      tables: 4,
      description: 'Payment transactions'
    },
    {
      id: 'errors',
      name: 'Error Management',
      icon: Settings,
      color: 'bg-rose-500',
      tables: 8,
      description: 'Error tracking and logs'
    },
    {
      id: 'geographic',
      name: 'Geographic',
      icon: Table,
      color: 'bg-teal-500',
      tables: 5,
      description: 'Geographic and regional data'
    }
  ];

  const CategoryIcon = ({ category }: { category: typeof tableCategories[0] }) => {
    const IconComponent = category.icon;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Database Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">All database tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RLS Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">Security policies active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11</div>
            <p className="text-xs text-muted-foreground">Organized categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Optimal</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Navigation */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tableCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeCategory === category.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-md ${category.color} text-white`}>
                  <CategoryIcon category={category} />
                </div>
                <Badge variant="secondary">{category.tables}</Badge>
              </div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CategoryIcon category={tableCategories.find(c => c.id === activeCategory) || tableCategories[0]} />
            {tableCategories.find(c => c.id === activeCategory)?.name || 'Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCategory === 'overview' && <DatabaseTablesManagement />}
          {activeCategory === 'users' && <AdminUsersSection />}
          {activeCategory === 'coins' && <AdminCoinsSection />}
          {activeCategory === 'marketplace' && <AdminMarketplaceSection />}
          {activeCategory === 'ai_system' && <AdminAISection />}
          {activeCategory === 'analytics' && <AdminAnalyticsSection />}
          {activeCategory === 'data_sources' && <AdminDataSourcesSection />}
          {activeCategory === 'security' && <SecurityTablesSection />}
          {activeCategory === 'payments' && <PaymentTablesSection />}
          {activeCategory === 'errors' && <ErrorManagementSection />}
          {activeCategory === 'geographic' && <GeographicDataSection />}
          {activeCategory === 'system' && <AdminSystemSection />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDatabaseSection;
