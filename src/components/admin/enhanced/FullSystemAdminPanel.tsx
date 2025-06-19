import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useSecureAdminUsers, useSecureAdminCoins, useSecureUpdateUserStatus, useSecureApiKeys } from '@/hooks/useSecureAdminData';
import { useRealExternalSources, useRealMarketAnalytics, useRealAICommands, useRealAutomationRules, useRealSystemMetrics, useRealPerformanceMetrics } from '@/hooks/useRealAdminData';
import { useOptimizedDashboardStats, usePerformanceMonitoring } from '@/hooks/useOptimizedAdminData';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import {
  Activity, Users, Coins, KeyRound, TrendingUp,
  ExternalLink, Brain, Gear, MonitorHeart, Rocket,
  AlertTriangle
} from 'lucide-react';
import AdminSystemTab from '../tabs/AdminSystemTab';
import AdminMockDataTab from '../tabs/AdminMockDataTab';
import AdminSystemPhasesTab from '../tabs/AdminSystemPhasesTab';

const FullSystemAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { selectedStoreId, isAdminUser } = useAdminStore();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useSecureAdminUsers();
  const { data: coinsData, isLoading: coinsLoading, error: coinsError } = useSecureAdminCoins();
  const { data: externalSources, isLoading: sourcesLoading, error: sourcesError } = useRealExternalSources();
  const { data: marketAnalytics, isLoading: analyticsLoading, error: analyticsError } = useRealMarketAnalytics();
  const { data: aiCommands, isLoading: commandsLoading, error: commandsError } = useRealAICommands();
  const { data: automationRules, isLoading: rulesLoading, error: rulesError } = useRealAutomationRules();
  const { data: systemMetrics, isLoading: metricsLoading, error: metricsError } = useRealSystemMetrics();
  const { data: performanceMetrics, isLoading: performanceLoading, error: performanceError } = useRealPerformanceMetrics();
  const { data: dashboardStats, isLoading: dashboardLoading, error: dashboardError } = useOptimizedDashboardStats();
  const { data: performanceData, isLoading: performanceIsLoading, error: performanceErrorData } = usePerformanceMonitoring();
  const { mutate: updateUserStatus, isLoading: isUpdating } = useSecureUpdateUserStatus();

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const adminTabs = [
    {
      id: 'users',
      name: 'Users',
      icon: Users,
      color: 'text-blue-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : usersError ? (
              <p>Error: {usersError.message}</p>
            ) : (
              <div className="grid gap-4">
                {usersData?.data.map((user) => (
                  <Card key={user.id}>
                    <CardContent>
                      <p>Name: {user.name}</p>
                      <p>Email: {user.email}</p>
                      <p>Role: {user.role}</p>
                      <Switch
                        id={`user-${user.id}`}
                        checked={user.verified_dealer}
                        onCheckedChange={(checked) => {
                          updateUserStatus({ userId: user.id, verified: checked });
                        }}
                      />
                      <Label htmlFor={`user-${user.id}`}>
                        {user.verified_dealer ? 'Verified' : 'Unverified'}
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'coins',
      name: 'Coins',
      icon: Coins,
      color: 'text-yellow-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Admin Coins</CardTitle>
          </CardHeader>
          <CardContent>
            {coinsLoading ? (
              <p>Loading coins...</p>
            ) : coinsError ? (
              <p>Error: {coinsError.message}</p>
            ) : (
              <div className="grid gap-4">
                {coinsData?.data.map((coin) => (
                  <Card key={coin.id}>
                    <CardContent>
                      <p>Name: {coin.name}</p>
                      <p>Value: {coin.value}</p>
                      <p>User: {coin.profiles?.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'api-keys',
      name: 'API Keys',
      icon: KeyRound,
      color: 'text-purple-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage API keys here.</p>
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: TrendingUp,
      color: 'text-orange-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Market Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <p>Loading analytics...</p>
            ) : analyticsError ? (
              <p>Error: {analyticsError.message}</p>
            ) : (
              <div className="grid gap-4">
                {marketAnalytics?.map((analytic) => (
                  <Card key={analytic.id}>
                    <CardContent>
                      <p>Metric: {analytic.metric_name}</p>
                      <p>Value: {analytic.metric_value}</p>
                      <p>Recorded At: {analytic.recorded_at}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'external-sources',
      name: 'External Sources',
      icon: ExternalLink,
      color: 'text-blue-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>External Price Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {sourcesLoading ? (
              <p>Loading sources...</p>
            ) : sourcesError ? (
              <p>Error: {sourcesError.message}</p>
            ) : (
              <div className="grid gap-4">
                {externalSources?.map((source) => (
                  <Card key={source.id}>
                    <CardContent>
                      <p>Name: {source.source_name}</p>
                      <p>URL: {source.base_url}</p>
                      <p>Priority: {source.priority_score}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'ai-commands',
      name: 'AI Commands',
      icon: Brain,
      color: 'text-green-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>AI Commands</CardTitle>
          </CardHeader>
          <CardContent>
            {commandsLoading ? (
              <p>Loading commands...</p>
            ) : commandsError ? (
              <p>Error: {commandsError.message}</p>
            ) : (
              <div className="grid gap-4">
                {aiCommands?.map((command) => (
                  <Card key={command.id}>
                    <CardContent>
                      <p>Command: {command.command_name}</p>
                      <p>Description: {command.command_description}</p>
                      <p>Priority: {command.priority}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'automation-rules',
      name: 'Automation Rules',
      icon: Gear,
      color: 'text-yellow-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Automation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {rulesLoading ? (
              <p>Loading rules...</p>
            ) : rulesError ? (
              <p>Error: {rulesError.message}</p>
            ) : (
              <div className="grid gap-4">
                {automationRules?.map((rule) => (
                  <Card key={rule.id}>
                    <CardContent>
                      <p>Name: {rule.rule_name}</p>
                      <p>Description: {rule.rule_description}</p>
                      <p>Created At: {rule.created_at}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'system-metrics',
      name: 'System Metrics',
      icon: MonitorHeart,
      color: 'text-red-600',
      component: (
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <p>Loading metrics...</p>
            ) : metricsError ? (
              <p>Error: {metricsError.message}</p>
            ) : (
              <div className="grid gap-4">
                {systemMetrics?.map((metric) => (
                  <Card key={metric.id}>
                    <CardContent>
                      <p>Metric: {metric.metric_name}</p>
                      <p>Value: {metric.metric_value}</p>
                      <p>Created At: {metric.created_at}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: 'system',
      name: 'System Health',
      icon: Activity,
      color: 'text-green-600',
      component: AdminSystemTab,
    },
    {
      id: 'mock-data',
      name: 'Mock Data Monitor', 
      icon: AlertTriangle,
      color: 'text-red-600',
      component: AdminMockDataTab,
      badge: 'CRITICAL'
    },
    {
      id: 'system-phases',
      name: 'System Phases',
      icon: Rocket, 
      color: 'text-purple-600',
      component: AdminSystemPhasesTab,
      badge: '15 Phases'
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Full System Admin Panel</h1>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList>
          {adminTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} onClick={() => handleTabChange(tab.id)} className="flex items-center space-x-2">
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
              {tab.badge && <span className="ml-2 text-xs font-bold">{tab.badge}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        {adminTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            {typeof tab.component === 'function' ? <tab.component /> : tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FullSystemAdminPanel;
