
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Settings, Zap, BarChart3, Database } from 'lucide-react';
import ExternalSourcesManager from '../enhanced/ExternalSourcesManager';
import DataAggregationDashboard from '../enhanced/DataAggregationDashboard';

const AdminExternalSourcesTab = () => {
  const [activeTab, setActiveTab] = useState('sources');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">External Sources Management</h3>
          <p className="text-sm text-muted-foreground">
            Enterprise-level external data integration and aggregation system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Data Sources & External APIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sources" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Sources Manager
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Data Dashboard
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Real-time Monitoring
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="mt-6">
              <ExternalSourcesManager />
            </TabsContent>

            <TabsContent value="dashboard" className="mt-6">
              <DataAggregationDashboard />
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Real-time Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Real-time Monitoring</h3>
                    <p className="text-gray-600 mb-4">
                      Advanced real-time monitoring dashboard for external sources
                    </p>
                    <Button variant="outline">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminExternalSourcesTab;
