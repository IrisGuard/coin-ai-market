
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Database, Zap, Brain, TrendingUp, Globe } from 'lucide-react';
import { useConnectionStatus, useSystemCleanup } from '@/hooks/useSystemCleanup';

const SystemRestorationStatus = () => {
  const { data: connectionStatus, isLoading } = useConnectionStatus();
  const { cleanup, isCleaningUp } = useSystemCleanup();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Database className="animate-spin h-6 w-6 text-blue-600" />
            <span>Checking system restoration status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const systemChecks = [
    {
      name: 'AI Commands',
      connected: connectionStatus?.systemStatus.ai_commands || false,
      icon: Brain,
      description: 'AI command execution system'
    },
    {
      name: 'Automation Rules',
      connected: connectionStatus?.systemStatus.automation_rules || false,
      icon: Zap,
      description: 'Automated workflow system'
    },
    {
      name: 'External Sources',
      connected: connectionStatus?.systemStatus.external_sources || false,
      icon: Globe,
      description: 'External price data sources'
    },
    {
      name: 'Error Knowledge',
      connected: connectionStatus?.systemStatus.error_knowledge || false,
      icon: AlertCircle,
      description: 'Error detection knowledge base'
    },
    {
      name: 'Performance Metrics',
      connected: connectionStatus?.systemStatus.performance_metrics || false,
      icon: TrendingUp,
      description: 'System performance monitoring'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            System Restoration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Admin Panel</h3>
                <p className="text-sm text-muted-foreground">ComprehensiveAdminPanel with 9 tabs</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                RESTORED
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Dealer Panel Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Connected to admin brain ({connectionStatus?.connectedSystems || 0}/5 systems)
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={
                  connectionStatus?.isFullyConnected 
                    ? "text-green-600 border-green-600" 
                    : "text-orange-600 border-orange-600"
                }
              >
                {connectionStatus?.isFullyConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    CONNECTED
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    PARTIAL
                  </>
                )}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">System Connections:</h4>
            {systemChecks.map((check) => {
              const IconComponent = check.icon;
              return (
                <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <h5 className="font-medium">{check.name}</h5>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      check.connected 
                        ? "text-green-600 border-green-600" 
                        : "text-red-600 border-red-600"
                    }
                  >
                    {check.connected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Disconnected
                      </>
                    )}
                  </Badge>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button 
              onClick={cleanup}
              disabled={isCleaningUp}
              className="w-full"
            >
              {isCleaningUp ? 'Cleaning System...' : 'Complete System Cleanup'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemRestorationStatus;
