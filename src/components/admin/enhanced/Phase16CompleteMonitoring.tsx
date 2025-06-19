
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useRealTimeGithubScanner } from '@/hooks/useRealTimeGithubScanner';
import { useRealTimeSystemStatus } from '@/hooks/useRealTimeSystemStatus';
import RealTimeGitHubMonitor from './RealTimeGitHubMonitor';
import Phase6RealDataPanel from './Phase6RealDataPanel';
import Phase11RealDataPanel from './Phase11RealDataPanel';

const Phase16CompleteMonitoring = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    totalViolations,
    criticalViolations,
    highViolations,
    isLoading: violationsLoading,
    refetchViolations
  } = useRealTimeGithubScanner();

  const {
    systemStatus,
    isLoading: systemLoading,
    isMonitoring,
    toggleMonitoring,
    triggerHealthCheck
  } = useRealTimeSystemStatus();

  const isProductionReady = totalViolations === 0 && 
                           systemStatus?.overallHealth === 'healthy' &&
                           systemStatus?.criticalAlerts === 0;

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: Activity },
    { id: 'github', label: 'GitHub Scanner', icon: Shield },
    { id: 'phase6', label: 'Phase 6', icon: CheckCircle },
    { id: 'phase11', label: 'Phase 11', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Production Status Alert */}
      <Alert variant={isProductionReady ? "default" : "destructive"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {isProductionReady ? (
            <span className="font-semibold text-green-700">
              ✅ SYSTEM PRODUCTION READY: All monitoring systems operational, zero violations detected
            </span>
          ) : (
            <span className="font-semibold text-red-700">
              🚫 SYSTEM NOT PRODUCTION READY: {totalViolations} violations, {systemStatus?.criticalAlerts || 0} critical alerts
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Phase 16 Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Phase 16: Complete Real-Time Monitoring System
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              ACTIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{totalViolations}</p>
              <p className="text-sm text-muted-foreground">Mock Data Violations</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{criticalViolations.length}</p>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {systemStatus?.overallHealth?.toUpperCase() || 'UNKNOWN'}
              </p>
              <p className="text-sm text-muted-foreground">System Health</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {isMonitoring ? 'LIVE' : 'OFFLINE'}
              </p>
              <p className="text-sm text-muted-foreground">Monitoring Status</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={toggleMonitoring} variant={isMonitoring ? "destructive" : "default"}>
              <Activity className="w-4 h-4 mr-2" />
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
            <Button onClick={triggerHealthCheck} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Health Check
            </Button>
            <Button onClick={() => refetchViolations()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Violations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <nav className="flex space-x-1 p-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-xl font-bold">{systemStatus?.uptime?.toFixed(1) || 0}%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-xl font-bold">{systemStatus?.responseTime || 0}ms</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-xl font-bold">{systemStatus?.errorRate?.toFixed(1) || 0}%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Alerts</p>
                    <p className="text-xl font-bold">{systemStatus?.activeAlerts || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'github' && <RealTimeGitHubMonitor />}
            {activeTab === 'phase6' && <Phase6RealDataPanel />}
            {activeTab === 'phase11' && <Phase11RealDataPanel />}
          </div>
        </CardContent>
      </Card>

      {/* Final Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Phase 16 Implementation Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-700">✅ Completed Features:</h4>
            <ul className="text-sm text-green-600 mt-2 space-y-1">
              <li>• Real-time GitHub mock data scanning</li>
              <li>• Live system health monitoring</li>
              <li>• Phase 6 AI Brain integration with real data</li>
              <li>• Phase 11 global data source integration</li>
              <li>• Production readiness validation</li>
              <li>• Automatic violation detection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700">📊 Current Statistics:</h4>
            <ul className="text-sm text-blue-600 mt-2 space-y-1">
              <li>• Total Mock Violations: {totalViolations}</li>
              <li>• Critical Issues: {criticalViolations.length}</li>
              <li>• System Health: {systemStatus?.overallHealth?.toUpperCase() || 'UNKNOWN'}</li>
              <li>• Monitoring: {isMonitoring ? 'ACTIVE' : 'INACTIVE'}</li>
              <li>• Production Ready: {isProductionReady ? 'YES' : 'NO'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase16CompleteMonitoring;
