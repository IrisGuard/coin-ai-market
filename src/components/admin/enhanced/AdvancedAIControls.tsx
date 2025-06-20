
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Brain, 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdvancedAIControls = () => {
  const [selectedCommand, setSelectedCommand] = useState('');
  const [commandInput, setCommandInput] = useState('{}');
  const queryClient = useQueryClient();

  // AI Commands management
  const { data: aiCommands = [], isLoading } = useQuery({
    queryKey: ['ai-commands-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Active automation rules
  const { data: automationRules = [] } = useQuery({
    queryKey: ['automation-rules-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // AI Configuration
  const { data: aiConfig } = useQuery({
    queryKey: ['ai-configuration'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_configuration')
        .select('*')
        .eq('id', 'main')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Execute AI Command
  const executeCommand = useMutation({
    mutationFn: async ({ commandId, inputData }: { commandId: string; inputData: any }) => {
      const { data, error } = await supabase
        .rpc('execute_ai_command', {
          p_command_id: commandId,
          p_input_data: inputData
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('AI Command executed successfully');
      queryClient.invalidateQueries({ queryKey: ['recent-ai-executions'] });
    },
    onError: (error) => {
      toast.error('Failed to execute AI command');
      console.error(error);
    }
  });

  // Toggle automation rule
  const toggleAutomationRule = useMutation({
    mutationFn: async ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Automation rule updated');
      queryClient.invalidateQueries({ queryKey: ['automation-rules-management'] });
    }
  });

  // Execute automation rule
  const executeAutomationRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { data, error } = await supabase
        .rpc('execute_automation_rule', { rule_id: ruleId });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Automation rule executed');
      queryClient.invalidateQueries({ queryKey: ['automation-rules-management'] });
    }
  });

  const handleExecuteCommand = async () => {
    if (!selectedCommand) {
      toast.error('Please select a command');
      return;
    }

    try {
      const inputData = JSON.parse(commandInput);
      await executeCommand.mutateAsync({
        commandId: selectedCommand,
        inputData
      });
    } catch (error) {
      toast.error('Invalid JSON input');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Control Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600" />
            🧠 Advanced AI Brain Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{aiCommands.length}</div>
              <div className="text-sm text-muted-foreground">Total Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {aiCommands.filter(cmd => cmd.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{automationRules.length}</div>
              <div className="text-sm text-muted-foreground">Automation Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {automationRules.filter(rule => rule.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Rules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Controls Tabs */}
      <Tabs defaultValue="commands">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commands">AI Commands</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="execution">Manual Execution</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="commands">
          <Card>
            <CardHeader>
              <CardTitle>AI Commands Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiCommands.map((command) => (
                    <TableRow key={command.id}>
                      <TableCell className="font-medium">{command.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{command.category}</Badge>
                      </TableCell>
                      <TableCell>{command.command_type}</TableCell>
                      <TableCell>
                        <Badge className={command.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {command.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{command.priority}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{rule.rule_type}</Badge>
                        <Badge className={rule.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAutomationRule.mutate({
                          ruleId: rule.id,
                          isActive: rule.is_active
                        })}
                        disabled={toggleAutomationRule.isPending}
                      >
                        {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeAutomationRule.mutate(rule.id)}
                        disabled={executeAutomationRule.isPending || !rule.is_active}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution">
          <Card>
            <CardHeader>
              <CardTitle>Manual AI Command Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Command</label>
                  <Select value={selectedCommand} onValueChange={setSelectedCommand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an AI command..." />
                    </SelectTrigger>
                    <SelectContent>
                      {aiCommands.filter(cmd => cmd.is_active).map((command) => (
                        <SelectItem key={command.id} value={command.id}>
                          {command.name} ({command.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Input Data (JSON)</label>
                  <Input
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder='{"key": "value"}'
                    className="font-mono"
                  />
                </div>

                <Button
                  onClick={handleExecuteCommand}
                  disabled={executeCommand.isPending || !selectedCommand}
                  className="w-full"
                >
                  {executeCommand.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Command
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>AI System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">System Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Brain Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Operational
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Command Processing</span>
                        <Badge className="bg-green-100 text-green-800">
                          <Activity className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Automation Engine</span>
                        <Badge className="bg-green-100 text-green-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Running
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium">< 200ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-medium">99.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Queue Processing</span>
                        <span className="text-sm font-medium">Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>

                {aiConfig && (
                  <div>
                    <h4 className="font-medium mb-2">Current Configuration</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(aiConfig.config, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAIControls;
