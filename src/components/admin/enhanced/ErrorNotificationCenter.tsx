
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellOff, Settings, Mail, MessageSquare, Smartphone } from 'lucide-react';

const ErrorNotificationCenter = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    sms: false,
    inApp: true,
    critical: true,
    high: true,
    medium: false,
    low: false
  });

  const [recentAlerts] = useState([
    {
      id: '1',
      type: 'critical',
      message: 'Database connection timeout detected',
      timestamp: new Date().toISOString(),
      resolved: false
    },
    {
      id: '2',
      type: 'high',
      message: 'Authentication service experiencing high error rate',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      resolved: true
    },
    {
      id: '3',
      type: 'medium',
      message: 'API response time above threshold',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved: false
    }
  ]);

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Channels */}
            <div>
              <h3 className="text-sm font-medium mb-3">Notification Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email Notifications</span>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleToggle('email')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Slack Integration</span>
                  </div>
                  <Switch 
                    checked={notifications.slack}
                    onCheckedChange={() => handleToggle('slack')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">SMS Alerts</span>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={() => handleToggle('sms')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">In-App Notifications</span>
                  </div>
                  <Switch 
                    checked={notifications.inApp}
                    onCheckedChange={() => handleToggle('inApp')}
                  />
                </div>
              </div>
            </div>

            {/* Severity Levels */}
            <div>
              <h3 className="text-sm font-medium mb-3">Alert Severity Levels</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm">Critical Errors</span>
                  </div>
                  <Switch 
                    checked={notifications.critical}
                    onCheckedChange={() => handleToggle('critical')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-sm">High Priority</span>
                  </div>
                  <Switch 
                    checked={notifications.high}
                    onCheckedChange={() => handleToggle('high')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-sm">Medium Priority</span>
                  </div>
                  <Switch 
                    checked={notifications.medium}
                    onCheckedChange={() => handleToggle('medium')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm">Low Priority</span>
                  </div>
                  <Switch 
                    checked={notifications.low}
                    onCheckedChange={() => handleToggle('low')}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <Alert key={alert.id} className={getAlertColor(alert.type)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="capitalize">
                        {alert.type}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <AlertDescription className="mb-2">
                      {alert.message}
                    </AlertDescription>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button size="sm" variant="outline">
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorNotificationCenter;
