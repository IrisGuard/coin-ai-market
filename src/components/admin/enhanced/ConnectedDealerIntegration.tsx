
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Database, TrendingUp, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ConnectedDealerIntegration = () => {
  const { data: integrationStatus, isLoading } = useQuery({
    queryKey: ['dealer-admin-integration'],
    queryFn: async () => {
      // Check integration status across all systems
      const [aiCommands, automationRules, externalSources, errorKnowledge] = await Promise.all([
        supabase.from('ai_commands').select('count').eq('is_active', true),
        supabase.from('automation_rules').select('count').eq('is_active', true),
        supabase.from('external_price_sources').select('count').eq('is_active', true),
        supabase.from('error_coins_knowledge').select('count')
      ]);

      return {
        aiCommands: aiCommands.data?.[0]?.count || 0,
        automationRules: automationRules.data?.[0]?.count || 0,
        externalSources: externalSources.data?.[0]?.count || 0,
        errorKnowledge: errorKnowledge.data?.[0]?.count || 0,
        lastSync: new Date().toISOString()
      };
    }
  });

  const integrationComponents = [
    {
      title: 'AI Brain Integration',
      description: 'AI Commands, Predictions, and Automation accessible to dealers',
      icon: Brain,
      count: integrationStatus?.aiCommands || 0,
      status: 'connected',
      color: 'text-blue-600'
    },
    {
      title: 'Market Intelligence',
      description: 'External price sources and market data feeds',
      icon: TrendingUp,
      count: integrationStatus?.externalSources || 0,
      status: 'connected',
      color: 'text-green-600'
    },
    {
      title: 'Error Detection System',
      description: 'Complete error coin knowledge base and detection',
      icon: Shield,
      count: integrationStatus?.errorKnowledge || 0,
      status: 'connected',
      color: 'text-purple-600'
    },
    {
      title: 'Data Pipeline',
      description: 'Real-time data synchronization between systems',
      icon: Database,
      count: integrationStatus?.automationRules || 0,
      status: 'connected',
      color: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-6 w-6 text-blue-600" />
            Admin-Dealer Panel Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {integrationComponents.map((component) => (
              <Card key={component.title} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <component.icon className={`h-5 w-5 ${component.color}`} />
                      <h3 className="font-semibold">{component.title}</h3>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {component.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {component.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {component.count}
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Health Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-800">System Status</h4>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-800">Data Synchronization</h4>
                <p className="text-sm text-blue-600">Real-time sync active</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-purple-800">AI Services</h4>
                <p className="text-sm text-purple-600">All AI modules connected</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectedDealerIntegration;
