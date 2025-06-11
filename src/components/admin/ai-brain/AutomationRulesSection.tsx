
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Settings, Clock } from 'lucide-react';

const AutomationRulesSection = () => {
  // Mock automation rules data
  const mockRules = [
    {
      id: '1',
      name: 'Auto Price Updates',
      description: 'Automatically update coin prices from external sources every hour',
      rule_type: 'scheduled',
      is_active: true,
      execution_count: 2847,
      success_count: 2834,
      last_executed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      schedule: 'Every hour'
    },
    {
      id: '2',
      name: 'New Listing Notifications',
      description: 'Send notifications to users when new coins matching their alerts are listed',
      rule_type: 'event_triggered',
      is_active: true,
      execution_count: 156,
      success_count: 154,
      last_executed: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      schedule: 'On event'
    },
    {
      id: '3',
      name: 'Data Quality Checks',
      description: 'Validate and clean coin data for consistency and accuracy',
      rule_type: 'scheduled',
      is_active: true,
      execution_count: 728,
      success_count: 726,
      last_executed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      schedule: 'Every 6 hours'
    },
    {
      id: '4',
      name: 'Market Trend Analysis',
      description: 'Analyze market trends and generate insights for coin valuations',
      rule_type: 'scheduled',
      is_active: true,
      execution_count: 342,
      success_count: 339,
      last_executed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      schedule: 'Daily'
    },
    {
      id: '5',
      name: 'Auction End Notifications',
      description: 'Notify bidders when auctions are ending soon',
      rule_type: 'time_based',
      is_active: true,
      execution_count: 89,
      success_count: 87,
      last_executed: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      schedule: '15 min before end'
    },
    {
      id: '6',
      name: 'Backup Data Export',
      description: 'Export critical data for backup purposes',
      rule_type: 'scheduled',
      is_active: false,
      execution_count: 24,
      success_count: 24,
      last_executed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      schedule: 'Weekly'
    }
  ];

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'event_triggered': return 'bg-green-100 text-green-800';
      case 'time_based': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessRate = (rule: any) => {
    return rule.execution_count > 0 ? ((rule.success_count / rule.execution_count) * 100).toFixed(1) : '0';
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm text-muted-foreground">{rule.description}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant={rule.is_active ? "default" : "secondary"}>
                    {rule.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge className={getRuleTypeColor(rule.rule_type)}>
                    {rule.rule_type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {rule.schedule}
                  </Badge>
                  <Badge variant="outline">
                    Executed: {rule.execution_count}
                  </Badge>
                  <Badge variant="outline">
                    Success: {getSuccessRate(rule)}%
                  </Badge>
                  <Badge variant="outline">
                    Last: {getTimeAgo(rule.last_executed)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant={rule.is_active ? "outline" : "default"}
                >
                  {rule.is_active ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Disable
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationRulesSection;
