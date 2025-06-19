
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, Brain, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRealTimeGithubScanner } from '@/hooks/useRealTimeGithubScanner';
import Phase16CompleteMonitoring from './Phase16CompleteMonitoring';
import RealTimeGitHubMonitor from './RealTimeGitHubMonitor';
import ProductionReadyMockDataDetectionPanel from './ProductionReadyMockDataDetectionPanel';
import ProductionSecurityMonitor from './ProductionSecurityMonitor';

const UnifiedSecurityMonitoringPanel = () => {
  const {
    totalViolations,
    criticalViolations,
    highViolations,
    isLoading
  } = useRealTimeGithubScanner();

  const isProductionReady = totalViolations === 0;

  return (
    <div className="space-y-6">
      {/* Main Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600" />
            Unified Security & Monitoring Panel - PRODUCTION SYSTEM
            <Badge variant={isProductionReady ? "default" : "destructive"}>
              {isProductionReady ? "PRODUCTION READY" : "VIOLATIONS DETECTED"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-3xl font-bold text-red-600">{totalViolations}</p>
              <p className="text-sm text-muted-foreground">Live Violations Count</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-3xl font-bold text-orange-600">{criticalViolations.length}</p>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold text-green-600">
                {isProductionReady ? '100%' : '0%'}
              </p>
              <p className="text-sm text-muted-foreground">Production Ready</p>
            </div>
          </div>

          {!isProductionReady && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">🚫 SYSTEM NOT PRODUCTION READY</p>
              <p className="text-red-700 text-sm">
                {totalViolations} live violations detected in real repository scan. Critical: {criticalViolations.length}, High: {highViolations.length}
              </p>
            </div>
          )}

          {isProductionReady && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">✅ SYSTEM PRODUCTION READY</p>
              <p className="text-green-700 text-sm">
                No violations detected in live repository scan. All systems operational.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="phase16" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="phase16" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Phase 16
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Live GitHub Scanner
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Security Monitor
          </TabsTrigger>
          <TabsTrigger value="detection" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Mock Detection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phase16">
          <Phase16CompleteMonitoring />
        </TabsContent>

        <TabsContent value="github">
          <RealTimeGitHubMonitor />
        </TabsContent>

        <TabsContent value="security">
          <ProductionSecurityMonitor />
        </TabsContent>

        <TabsContent value="detection">
          <ProductionReadyMockDataDetectionPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedSecurityMonitoringPanel;
