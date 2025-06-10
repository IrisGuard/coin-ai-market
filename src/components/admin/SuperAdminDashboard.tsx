
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Database, Users, Coins, TrendingUp, Activity, 
  Brain, Settings, FileText, DollarSign, Store, Bell,
  BarChart3, Zap, MonitorSpeaker, Search, Upload,
  Lock, AlertTriangle, CheckCircle
} from 'lucide-react';

// Import all existing admin components
import RealTimeSystemMonitor from './RealTimeSystemMonitor';
import AIBrainControlPanel from './enhanced/AIBrainControlPanel';
import { useSystemHealth } from '@/hooks/admin/useSystemHealth';
import { useRealTimeMonitoring } from '@/hooks/admin/useRealTimeMonitoring';
import { useAdminActivityLogs } from '@/hooks/admin/useAdminActivityLogs';
import { useAICommands } from '@/hooks/admin/useAdvancedAIBrain';

// Import tab components
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminTransactionsTab from './tabs/AdminTransactionsTab';
import AdminStoreManagementTab from './tabs/AdminStoreManagementTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';
import AdminErrorMonitoringTab from './tabs/AdminErrorMonitoringTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminSecurityAuditTab from './tabs/AdminSecurityAuditTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminSystemTab from './tabs/AdminSystemTab';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: health } = useSystemHealth();
  const { metrics, isConnected } = useRealTimeMonitoring();
  const { data: activityLogs } = useAdminActivityLogs();
  const { data: aiCommands } = useAICommands();

  const dashboardStats = [
    {
      title: 'Total Users',
      value: health?.total_users || 0,
      icon: Users,
      color: 'text-blue-600',
      trend: '+12%'
    },
    {
      title: 'Total Coins',
      value: health?.total_coins || 0,
      icon: Coins,
      color: 'text-yellow-600',
      trend: '+8%'
    },
    {
      title: 'Total Value',
      value: health?.total_value || 0,
      icon: DollarSign,
      color: 'text-green-600',
      trend: '+15%'
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers,
      icon: Activity,
      color: 'text-purple-600',
      trend: 'Real-time'
    }
  ];

  const securityStatus = {
    overall: health?.status === 'healthy' ? 'secure' : 'warning',
    otp: 'configured',
    passwords: 'protected',
    functions: 'secure'
  };

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'coins', label: 'Coins', icon: Coins },
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'monitoring', label: 'Monitoring', icon: MonitorSpeaker },
    { id: 'ai-brain', label: 'AI Brain', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api-keys', label: 'API Keys', icon: Lock },
    { id: 'errors', label: 'Errors', icon: AlertTriangle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            GlobalCoinsAI Super Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete system control and monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Live' : 'Disconnected'}
            </Badge>
          </div>
          
          <Badge variant={securityStatus.overall === 'secure' ? 'default' : 'destructive'}>
            <Shield className="w-4 h-4 mr-1" />
            Security: {securityStatus.overall}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 xl:grid-cols-13 gap-1 h-auto p-1">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1 p-2 h-auto text-xs"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-green-600">{stat.trend}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* System Health & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>OTP Configuration</span>
                  <Badge variant="default">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    10 min expiry
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Password Protection</span>
                  <Badge variant="default">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    HIBP Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Function Security</span>
                  <Badge variant="default">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Search Paths Secure
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Real-time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>System Load</span>
                  <span className="font-medium">{metrics.systemLoad.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Error Rate</span>
                  <span className="font-medium">{metrics.errorRate.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <span className="font-medium">{metrics.responseTime.toFixed(0)}ms</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLogs?.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.target_type}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Tab Contents */}
        <TabsContent value="users">
          <AdminUsersTab />
        </TabsContent>

        <TabsContent value="coins">
          <AdminCoinsTab />
        </TabsContent>

        <TabsContent value="transactions">
          <AdminTransactionsTab />
        </TabsContent>

        <TabsContent value="stores">
          <AdminStoreManagementTab />
        </TabsContent>

        <TabsContent value="monitoring">
          <RealTimeSystemMonitor />
        </TabsContent>

        <TabsContent value="ai-brain">
          <AIBrainControlPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <AdminAnalyticsTab />
        </TabsContent>

        <TabsContent value="security">
          <AdminSecurityAuditTab />
        </TabsContent>

        <TabsContent value="api-keys">
          <AdminApiKeysTab />
        </TabsContent>

        <TabsContent value="errors">
          <AdminErrorMonitoringTab />
        </TabsContent>

        <TabsContent value="notifications">
          <AdminNotificationsTab />
        </TabsContent>

        <TabsContent value="system">
          <AdminSystemTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
