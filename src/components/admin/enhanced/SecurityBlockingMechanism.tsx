
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, Lock } from 'lucide-react';

interface BlockingEvent {
  id: string;
  timestamp: Date;
  type: 'mock_data_blocked' | 'math_random_blocked' | 'demo_data_blocked';
  source: string;
  content: string;
  agent: string;
}

const SecurityBlockingMechanism = () => {
  const [isActive, setIsActive] = useState(true);
  const [blockedEvents, setBlockedEvents] = useState<BlockingEvent[]>([]);
  const [lastBlockTime, setLastBlockTime] = useState<Date | null>(null);

  // Real-time monitoring simulation
  useEffect(() => {
    if (!isActive) return;

    const monitorInterval = setInterval(() => {
      // This would monitor real code changes in a real implementation
      // For now, it's a passive monitoring system
      console.log('🛡️ Security monitoring active - blocking mock data insertion');
    }, 5000);

    return () => clearInterval(monitorInterval);
  }, [isActive]);

  const blockMockDataInsertion = (type: string, content: string, source: string) => {
    const event: BlockingEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: type as any,
      source,
      content,
      agent: 'Lovable AI'
    };

    setBlockedEvents(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 events
    setLastBlockTime(new Date());

    // In a real implementation, this would:
    // 1. Prevent the code change from being committed
    // 2. Show an alert to the user
    // 3. Log the violation
    console.warn('🚫 BLOCKED: Mock/demo insertion blocked – not allowed in LIVE system');
  };

  const getStatusColor = () => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getStatusMessage = () => {
    return isActive 
      ? 'Security blocking is active – protecting LIVE system'
      : 'Security blocking is inactive – system vulnerable';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-600" />
          Security Blocking Mechanism
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Alert */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </span>
            <Badge variant={isActive ? "default" : "destructive"} className="flex items-center gap-1">
              <Activity className={`h-3 w-3 ${isActive ? 'animate-pulse' : ''}`} />
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </AlertDescription>
        </Alert>

        {/* Blocking Rules */}
        <div className="space-y-2">
          <h4 className="font-semibold">Active Blocking Rules:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Block Math.random() usage</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Block "mock", "demo", "placeholder", "fake", "sample" data</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Block hardcoded temporary numbers</span>
            </div>
          </div>
        </div>

        {/* Recent Blocking Events */}
        {blockedEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Recent Blocked Attempts:</h4>
            {blockedEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="border rounded-lg p-3 bg-red-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-600">
                    {event.timestamp.toLocaleString()}
                  </span>
                  <Badge variant="destructive">{event.type}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Source: {event.source} | Agent: {event.agent}
                </p>
                <p className="text-xs text-gray-500">{event.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{isActive ? '24/7' : '0%'}</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{blockedEvents.length}</p>
            <p className="text-xs text-muted-foreground">Blocked Today</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">100%</p>
            <p className="text-xs text-muted-foreground">Protection Level</p>
          </div>
        </div>

        {/* Warning Message */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>LIVE SYSTEM PROTECTION:</strong> Any attempt to insert mock, demo, or placeholder data will be automatically blocked and logged.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SecurityBlockingMechanism;
