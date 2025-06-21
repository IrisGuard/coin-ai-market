import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Table, Users, Coins, ShoppingCart, Brain, BarChart3, Settings, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DatabaseTablesManagement from '@/components/admin/database/DatabaseTablesManagement';
import AdminUsersSection from '@/components/admin/AdminUsersSection';
import AdminCoinsSection from '@/components/admin/AdminCoinsSection';
import AdminMarketplaceSection from './AdminMarketplaceSection';
import AdminAISection from './AdminAISection';
import AdminAnalyticsSection from './AdminAnalyticsSection';
import AdminDataSourcesSection from './AdminDataSourcesSection';
import SecurityTablesSection from '@/components/admin/security/SecurityTablesSection';
import PaymentTablesSection from '@/components/admin/payments/PaymentTablesSection';
import ErrorManagementSection from '@/components/admin/errors/ErrorManagementSection';
import GeographicDataSection from '@/components/admin/geographic/GeographicDataSection';
import AdminSystemSection from './AdminSystemSection';
import { useDatabaseStats } from '@/hooks/useDatabaseStats';

const AdminDatabaseSection = () => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const { data: dbStats, isLoading } = useDatabaseStats();
  
  // Icon mapping for dynamic rendering
  const iconMap = {
    'Database': Database,
    'Users': Users,
    'Coins': Coins,
    'ShoppingCart': ShoppingCart,
    'Brain': Brain,
    'BarChart3': BarChart3,
    'Shield': Shield,
    'Zap': Zap,
    'Settings': Settings,
    'Table': Table
  };

  const CategoryIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Database;
    return <IconComponent className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Overview Cards - REAL DATA */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.totalTables || 0}</div>
            <p className="text-xs text-muted-foreground">All database tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RLS Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.rlsPolicies || 0}</div>
            <p className="text-xs text-muted-foreground">Security policies active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.totalRecords?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">All database records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dbStats?.systemHealth || 'Loading...'}</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Brain Statistics - SPECIAL HIGHLIGHT */}
      {dbStats?.aiStats && (
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Brain className="h-6 w-6" />
              AI Brain Statistics - THOUSANDS OF FUNCTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{dbStats.aiStats.totalCommands.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total AI Commands</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{dbStats.aiStats.activeCommands.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Active Commands</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{dbStats.aiStats.totalPredictions.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Prediction Models</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">{dbStats.aiStats.totalKnowledgeEntries.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Knowledge Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Navigation - REAL DATA */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dbStats?.categories?.map((category) => (
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
                  <CategoryIcon iconName={category.icon} />
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">{category.tables} tables</Badge>
                  <div className="text-xs text-gray-500">{category.records.toLocaleString()} records</div>
                </div>
              </div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
            </CardContent>
          </Card>
        )) || []}
      </div>

      {/* Category Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {dbStats?.categories?.find(c => c.id === activeCategory) && (
              <CategoryIcon iconName={dbStats.categories.find(c => c.id === activeCategory)!.icon} />
            )}
            {dbStats?.categories?.find(c => c.id === activeCategory)?.name || 'Overview'}
            <Badge variant="outline" className="ml-2">
              {dbStats?.categories?.find(c => c.id === activeCategory)?.records.toLocaleString() || 0} records
            </Badge>
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
