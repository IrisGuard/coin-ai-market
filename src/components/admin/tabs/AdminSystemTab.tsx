
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Shield, Zap } from 'lucide-react';

// Import enhanced components
import SuperSystemIntegration from '../enhanced/SuperSystemIntegration';
import UnifiedDataManager from '../enhanced/UnifiedDataManager';

const AdminSystemTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">System Administration</h2>
      </div>

      <Tabs defaultValue="integration" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integration">System Integration</TabsTrigger>
          <TabsTrigger value="data-manager">Data Manager</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="integration">
          <SuperSystemIntegration />
        </TabsContent>

        <TabsContent value="data-manager">
          <UnifiedDataManager />
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Database className="w-4 h-4" />
                      Database Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connection Pool:</span>
                      <span className="font-medium">Optimized</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Query Timeout:</span>
                      <span className="font-medium">30s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Auto Vacuum:</span>
                      <span className="font-medium">Enabled</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>RLS Enabled:</span>
                      <span className="font-medium text-green-600">✓ Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Function Security:</span>
                      <span className="font-medium text-green-600">✓ Hardened</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>API Rate Limits:</span>
                      <span className="font-medium text-green-600">✓ Configured</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cache Strategy:</span>
                      <span className="font-medium">Redis + Memory</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CDN Status:</span>
                      <span className="font-medium text-green-600">✓ Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Compression:</span>
                      <span className="font-medium text-green-600">✓ Enabled</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemTab;
