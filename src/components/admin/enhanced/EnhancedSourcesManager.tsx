import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  BarChart3,
  Zap,
  Shield,
  Target,
  Database
} from 'lucide-react';
import BulkSourceImporter from './BulkSourceImporter';
import SourceTemplateManager from './SourceTemplateManager';
import PerformanceAnalytics from './PerformanceAnalytics';
import AISourceDiscovery from './AISourceDiscovery';
import GeographicSourceMap from './GeographicSourceMap';

const EnhancedSourcesManager = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Sources Management</h2>
          <p className="text-muted-foreground">
            Comprehensive global coin marketplace intelligence system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="h-4 w-4 mr-1" />
            Active Obfuscation
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Zap className="h-4 w-4 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bulk-import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="ai-discovery" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            AI Discovery
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="geographic" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geographic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Global Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150+</div>
                <p className="text-sm text-muted-foreground">Active sources worldwide</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>North America</span>
                    <span>45</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Europe</span>
                    <span>65</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Asia Pacific</span>
                    <span>25</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Others</span>
                    <span>15</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Obfuscation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <p className="text-sm text-muted-foreground">Detection avoidance rate</p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Proxy Rotation</span>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Behavioral Mimicking</span>
                    <Badge variant="outline" className="text-green-600">Enabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limiting</span>
                    <Badge variant="outline" className="text-blue-600">Adaptive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  AI Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <p className="text-sm text-muted-foreground">Continuous discovery</p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Auto-Discovery</span>
                    <span className="text-green-600">12 new/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Config</span>
                    <span className="text-blue-600">85% accuracy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Analysis</span>
                    <span className="text-purple-600">Real-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk-import">
          <BulkSourceImporter />
        </TabsContent>

        <TabsContent value="ai-discovery">
          <AISourceDiscovery />
        </TabsContent>

        <TabsContent value="templates">
          <SourceTemplateManager />
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="geographic">
          <GeographicSourceMap sources={sources || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSourcesManager;
