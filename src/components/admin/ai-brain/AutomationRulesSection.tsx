
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Settings, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AutomationRulesSection = () => {
  const { data: rules, isLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'event_triggered': return 'bg-green-100 text-green-800';
      case 'time_based': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Never';
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No automation rules configured yet
            </div>
          ) : (
            rules?.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-sm text-muted-foreground">{rule.description}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={rule.is_active ? "default" : "secondary"}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge className={getRuleTypeColor(rule.rule_type)}>
                      {rule.rule_type?.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {rule.rule_type === 'scheduled' ? 'Scheduled' : 'Event-driven'}
                    </Badge>
                    <Badge variant="outline">
                      Executed: {rule.execution_count || 0}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationRulesSection;
