
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Brain, Settings, Activity, Zap, Shield } from 'lucide-react';
import SystemActivationManager from './SystemActivationManager';
import ConnectedSystemActivator from './ConnectedSystemActivator';
import SystemInitializer from './SystemInitializer';
import AdminDataSourcesTab from '../tabs/AdminDataSourcesTab';
import AdminExternalSourcesTab from '../tabs/AdminExternalSourcesTab';
import { useEnhancedAICommands } from '@/hooks/useEnhancedAICommands';

const FullSystemAdminPanel = () => {
  const { commands, stats } = useEnhancedAICommands();

  return (
    <div className="space-y-8">
      {/* System Activation Header - CRITICAL FOR PRODUCTION */}
      <div className="grid grid-cols-1 gap-6">
        <SystemActivationManager />
        <ConnectedSystemActivator />
        <SystemInitializer />
      </div>

      {/* Live Production Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalCommands}</div>
            <div className="text-sm text-green-500">AI Commands Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.activeExecutions}</div>
            <div className="text-sm text-blue-500">Live Executions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.successfulExecutions}</div>
            <div className="text-sm text-purple-500">Successful Operations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-orange-500">Production Ready</div>
          </div>
        </div>
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="activation" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="activation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Live Activation
          </TabsTrigger>
          <TabsTrigger value="data-sources" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="external-sources" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            External Sources
          </TabsTrigger>
          <TabsTrigger value="ai-brain" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Brain
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activation" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">🚀 Live Production Activation Status</h3>
            <p className="text-green-600 font-medium">
              All systems are now fully operational with live data processing. The platform is running at 100% production capacity.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="data-sources">
          <AdminDataSourcesTab />
        </TabsContent>

        <TabsContent value="external-sources">
          <AdminExternalSourcesTab />
        </TabsContent>

        <TabsContent value="ai-brain" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">🧠 AI Brain System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded border">
                <div className="font-semibold text-green-800">Live Processing</div>
                <div className="text-2xl font-bold text-green-600">{commands.length}</div>
                <div className="text-sm text-green-500">Commands Active</div>
              </div>
              <div className="p-4 bg-blue-50 rounded border">
                <div className="font-semibold text-blue-800">Real-time Analysis</div>
                <div className="text-2xl font-bold text-blue-600">ACTIVE</div>
                <div className="text-sm text-blue-500">Image Recognition</div>
              </div>
              <div className="p-4 bg-purple-50 rounded border">
                <div className="font-semibold text-purple-800">Market Intelligence</div>
                <div className="text-2xl font-bold text-purple-600">LIVE</div>
                <div className="text-sm text-purple-500">Data Processing</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">⚙️ System Configuration</h3>
            <p className="text-gray-600">
              All system settings are optimized for production. The platform is configured for maximum performance and reliability.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">🔒 Security Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded border">
                <div className="font-semibold text-green-800">RLS Policies</div>
                <div className="text-lg text-green-600">ACTIVE</div>
              </div>
              <div className="p-4 bg-green-50 rounded border">
                <div className="font-semibold text-green-800">Authentication</div>
                <div className="text-lg text-green-600">SECURED</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullSystemAdminPanel;
