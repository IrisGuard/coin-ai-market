import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, Users, Coins, ShoppingCart, CreditCard, Brain, 
  BarChart3, Settings, Shield, AlertTriangle, Activity,
  Rocket, Bot, Zap, TrendingUp, Store
} from 'lucide-react';

// Import existing admin components
import AdminDatabaseSection from '@/components/admin/sections/AdminDatabaseSection';
import AdminUsersSection from '@/components/admin/AdminUsersSection';
import AdminCoinsSection from '@/components/admin/AdminCoinsSection';
import AdminPaymentsTab from '@/components/admin/tabs/AdminPaymentsTab';
import AdminAIBrainTab from '@/components/admin/tabs/AdminAIBrainTab';
import AdminAnalyticsTab from '@/components/admin/tabs/AdminAnalyticsTab';
import AdminSecurityTab from '@/components/admin/tabs/AdminSecurityTab';
import AdminProductionTab from '@/components/admin/tabs/AdminProductionTab';
import AdminGCAITokenTab from '@/components/admin/tabs/AdminGCAITokenTab';
import AdminStoreManagerTab from '@/components/admin/AdminStoreManagerTab';
import { useRealTimeSystemStatus } from '@/hooks/useRealTimeSystemStatus';

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('production');
  const systemStatus = useRealTimeSystemStatus();

  const adminTabs = [
    {
      id: 'production',
      name: 'Production',
      icon: Rocket,
      color: 'text-red-600',
      component: AdminProductionTab,
      badge: 'LIVE'
    },
    {
      id: 'gcai-token',
      name: 'GCAI Token',
      icon: Coins,
      color: 'text-orange-600',
      component: AdminGCAITokenTab,
      badge: 'LIVE'
    },
    {
      id: 'database',
      name: 'Database',
      icon: Database,
      color: 'text-blue-600',
      component: AdminDatabaseSection,
      badge: '87 Tables'
    },
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      color: 'text-green-600',
      component: AdminUsersSection,
      badge: systemStatus.activeUsers.toString()
    },
    {
      id: 'coins',
      name: 'Coins',
      icon: Coins,
      color: 'text-yellow-600',
      component: AdminCoinsSection,
      badge: systemStatus.totalCoins.toString()
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: CreditCard,
      color: 'text-purple-600',
      component: AdminPaymentsTab,
      badge: 'Active'
    },
    {
      id: 'ai-brain',
      name: 'AI Brain',
      icon: Brain,
      color: 'text-indigo-600',
      component: AdminAIBrainTab,
      badge: systemStatus.aiCommands.toString()
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: 'text-cyan-600',
      component: AdminAnalyticsTab,
      badge: 'Live'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: 'text-red-500',
      component: AdminSecurityTab,
      badge: 'Secure'
    },
    {
      id: 'store-manager',
      name: 'Store Manager',
      icon: Store,
      color: 'text-green-600',
      component: AdminStoreManagerTab,
      badge: 'Admin Stores'
    }
  ];

  const activeTabData = adminTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component || AdminProductionTab;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">Full System Admin Panel</div>
                <div className="text-sm text-muted-foreground">
                  Complete platform management with GCAI Token integration
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Badge className="bg-green-100 text-green-800">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE PLATFORM
                </Badge>
                <Badge className="bg-orange-100 text-orange-800">
                  <Coins className="h-3 w-3 mr-1" />
                  GCAI ACTIVE
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  87 Tables Active
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold">{systemStatus.scrapingJobs}</div>
                <div className="text-xs text-muted-foreground">Scraping Jobs</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <Bot className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold">{systemStatus.aiCommands}</div>
                <div className="text-xs text-muted-foreground">AI Commands</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <div className="text-lg font-bold">{systemStatus.activeUsers}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <Coins className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <div className="text-lg font-bold">{systemStatus.totalCoins}</div>
                <div className="text-xs text-muted-foreground">Total Coins</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <ShoppingCart className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <div className="text-lg font-bold">{systemStatus.liveAuctions}</div>
                <div className="text-xs text-muted-foreground">Live Auctions</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <Zap className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <div className="text-lg font-bold">{systemStatus.automationRules}</div>
                <div className="text-xs text-muted-foreground">Auto Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Admin Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {adminTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <IconComponent className={`h-5 w-5 ${tab.color}`} />
                        <span className="font-medium">{tab.name}</span>
                        {tab.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {tab.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeTabData && (
                    <>
                      <activeTabData.icon className={`h-6 w-6 ${activeTabData.color}`} />
                      {activeTabData.name}
                      {activeTabData.badge && (
                        <Badge variant="secondary">{activeTabData.badge}</Badge>
                      )}
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActiveComponent />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status Footer */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">System Status: LIVE</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Updated: {systemStatus.lastUpdated.toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>GCAI Token: Live</span>
                <span>Database: 87 Tables Active</span>
                <span>Platform: Production Mode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FullSystemAdminPanel;
