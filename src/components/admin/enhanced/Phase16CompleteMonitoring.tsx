
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useRealTimeGithubScanner } from '@/hooks/useRealTimeGithubScanner';
import { useRealTimeSystemStatus } from '@/hooks/useRealTimeSystemStatus';
import ProductionReadyMockDataDetectionPanel from './ProductionReadyMockDataDetectionPanel';
import ProductionSecurityMonitor from './ProductionSecurityMonitor';
import { useProductionAnalytics } from '@/hooks/useProductionAnalytics';

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

  const { data: analytics, isLoading: analyticsLoading } = useProductionAnalytics();

  const isProductionReady = totalViolations === 0 && 
                           systemStatus?.overallHealth === 'healthy' &&
                           systemStatus?.criticalAlerts === 0;

  const tabs = [
    { id: 'overview', label: 'Production Overview', icon: Activity },
    { id: 'security', label: 'Security Monitor', icon: Shield },
    { id: 'analytics', label: 'Real Analytics', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* PHASE 16 PRODUCTION STATUS */}
      <Alert variant={isProductionReady ? "default" : "destructive"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {isProductionReady ? (
            <span className="font-semibold text-green-700">
              ✅ PHASE 16 COMPLETE: Production system fully operational with zero violations
            </span>
          ) : (
            <span className="font-semibold text-red-700">
              🚫 PHASE 16 BLOCKED: {totalViolations} violations must be resolved before production
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Phase 16 Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Phase 16: Complete Production System - REAL DATA ONLY
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {isProductionReady ? 'PRODUCTION READY' : 'NEEDS CLEANUP'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{totalViolations}</p>
              <p className="text-sm text-muted-foreground">Real Violations</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{criticalViolations.length}</p>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {analytics?.users?.total || 0}
              </p>
              <p className="text-sm text-muted-foreground">Real Users</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {analytics?.coins?.total || 0}
              </p>
              <p className="text-sm text-muted-foreground">Real Coins</p>
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
                <h3 className="text-lg font-semibold">Production System Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-xl font-bold">{analytics?.system?.uptime || 0}%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Real Revenue</p>
                    <p className="text-xl font-bold">${analytics?.revenue?.total || 0}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-xl font-bold">{analytics?.users?.active || 0}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-xl font-bold">{analytics?.coins?.totalViews || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && <ProductionSecurityMonitor />}
            
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Real Production Analytics</h3>
                {analyticsLoading ? (
                  <div className="animate-pulse">Loading real analytics data...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{analytics?.users?.total || 0}</p>
                        <p className="text-sm text-muted-foreground">
                          +{analytics?.users?.growth || 0} this month
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Coins</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{analytics?.coins?.total || 0}</p>
                        <p className="text-sm text-muted-foreground">
                          +{analytics?.coins?.newListings || 0} new listings
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">${analytics?.revenue?.total || 0}</p>
                        <p className="text-sm text-muted-foreground">
                          {analytics?.revenue?.transactions || 0} transactions
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mock Data Detection Panel */}
      <ProductionReadyMockDataDetectionPanel />

      {/* Final Production Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Phase 16 Implementation Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-700">✅ Production Features:</h4>
            <ul className="text-sm text-green-600 mt-2 space-y-1">
              <li>• Real Supabase data integration</li>
              <li>• Live GitHub violation scanning</li>
              <li>• Production-grade security monitoring</li>
              <li>• Real user analytics and metrics</li>
              <li>• Zero mock/demo data tolerance</li>
              <li>• Secure random number generation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700">📊 Current Real Statistics:</h4>
            <ul className="text-sm text-blue-600 mt-2 space-y-1">
              <li>• Mock Violations: {totalViolations}</li>
              <li>• Critical Issues: {criticalViolations.length}</li>
              <li>• Real Users: {analytics?.users?.total || 0}</li>
              <li>• Real Coins: {analytics?.coins?.total || 0}</li>
              <li>• System Health: {systemStatus?.overallHealth?.toUpperCase() || 'UNKNOWN'}</li>
              <li>• Production Ready: {isProductionReady ? 'YES' : 'NO'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase16CompleteMonitoring;
