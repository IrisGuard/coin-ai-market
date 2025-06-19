
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, Settings, Activity, TrendingUp, Zap, 
  AlertTriangle, CheckCircle, Loader2, Cpu, Database
} from 'lucide-react';
import { toast } from 'sonner';

interface AIProvider {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  responseTime: number;
  accuracy: number;
  cost: number;
}

const AdvancedAIControls = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch AI commands count
  const { data: commandsData } = useQuery({
    queryKey: ['ai-commands-count'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_commands')
        .select('id')
        .eq('is_active', true);
      return { count: data?.length || 0 };
    }
  });

  // Fetch automation rules count
  const { data: rulesData } = useQuery({
    queryKey: ['automation-rules-count'],
    queryFn: async () => {
      const { data } = await supabase
        .from('automation_rules')
        .select('id')
        .eq('is_active', true);
      return { count: data?.length || 0 };
    }
  });

  // Mock AI providers data
  const aiProviders: AIProvider[] = [
    {
      id: 'claude',
      name: 'Claude AI',
      status: 'active',
      responseTime: 1200,
      accuracy: 0.94,
      cost: 0.015
    },
    {
      id: 'gpt4',
      name: 'GPT-4',
      status: 'active',
      responseTime: 800,
      accuracy: 0.92,
      cost: 0.020
    },
    {
      id: 'gemini',
      name: 'Gemini Pro',
      status: 'inactive',
      responseTime: 900,
      accuracy: 0.89,
      cost: 0.012
    }
  ];

  // Test AI provider
  const testProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      // Simulate provider test
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, responseTime: Math.random() * 1000 + 500 };
    },
    onSuccess: (data, providerId) => {
      toast.success(`Provider ${providerId} test completed successfully`);
      queryClient.invalidateQueries({ queryKey: ['ai-providers'] });
    },
    onError: () => {
      toast.error('Provider test failed');
    }
  });

  const switchProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      // Simulate provider switch
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success('AI provider switched successfully');
      queryClient.invalidateQueries({ queryKey: ['ai-providers'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {commandsData?.count || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active Commands</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {rulesData?.count || 0}
                </div>
                <p className="text-xs text-muted-foreground">Automation Rules</p>
              </div>
              <Settings className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">1.2s</div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiProviders.map((provider) => (
                  <div key={provider.id} className={`p-4 rounded-lg border ${getStatusColor(provider.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(provider.status)}
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Response: {provider.responseTime}ms</span>
                            <span>Accuracy: {Math.round(provider.accuracy * 100)}%</span>
                            <span>Cost: ${provider.cost}/1k tokens</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testProviderMutation.mutate(provider.id)}
                          disabled={testProviderMutation.isPending}
                        >
                          {testProviderMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Test'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => switchProviderMutation.mutate(provider.id)}
                          disabled={switchProviderMutation.isPending || provider.status === 'active'}
                        >
                          {provider.status === 'active' ? 'Active' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="max-tokens">Max Tokens per Request</Label>
                <Input id="max-tokens" type="number" defaultValue="4000" />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input id="temperature" type="number" step="0.1" defaultValue="0.7" />
              </div>
              <div>
                <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                <Input id="timeout" type="number" defaultValue="30" />
              </div>
              <Button>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Cpu className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-sm text-blue-600">Active Processes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Database className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-lg font-bold text-green-600">256MB</div>
                  <div className="text-sm text-green-600">Memory Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAIControls;
