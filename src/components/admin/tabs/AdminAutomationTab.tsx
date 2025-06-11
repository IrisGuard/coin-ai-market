
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Clock, Play, Pause, Settings, RefreshCw, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  rule_type: string;
  is_active: boolean;
  actions: any[];
  conditions: any[];
  execution_count: number;
  last_executed: string | null;
  created_at: string;
}

interface CreateRuleParams {
  name: string;
  rule_type: string;
  trigger_config: any;
  actions: any[];
  conditions: any[];
}

const AdminAutomationTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState<CreateRuleParams>({
    name: '',
    rule_type: 'scheduled',
    trigger_config: {},
    actions: [],
    conditions: []
  });

  const queryClient = useQueryClient();

  // Automation Rules Query
  const { data: automationRules = [], isLoading } = useQuery({
    queryKey: ['admin-automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Command Queue Query
  const { data: commandQueue = [] } = useQuery({
    queryKey: ['admin-command-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('command_queue')
        .select('*')
        .order('scheduled_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Automation Statistics
  const { data: automationStats } = useQuery({
    queryKey: ['admin-automation-stats'],
    queryFn: async () => {
      const totalRules = automationRules.length;
      const activeRules = automationRules.filter(rule => rule.is_active).length;
      const pendingCommands = commandQueue.filter(cmd => cmd.status === 'pending').length;
      const executedToday = automationRules.filter(rule => 
        rule.last_executed && new Date(rule.last_executed).toDateString() === new Date().toDateString()
      ).length;
      
      return {
        totalRules,
        activeRules,
        pendingCommands,
        executedToday
      };
    },
    enabled: automationRules.length > 0 || commandQueue.length > 0
  });

  // Create Automation Rule Mutation
  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: CreateRuleParams) => {
      const { error } = await supabase
        .from('automation_rules')
        .insert([ruleData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-automation-rules'] });
      setIsCreateDialogOpen(false);
      setNewRule({
        name: '',
        rule_type: 'scheduled',
        trigger_config: {},
        actions: [],
        conditions: []
      });
      toast({
        title: "Success",
        description: "Automation rule created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Execute Rule Mutation
  const executeRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      const { data, error } = await supabase.rpc('execute_automation_rule', {
        rule_id: ruleId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-automation-rules'] });
      toast({
        title: "Success",
        description: "Automation rule executed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Toggle Rule Status Mutation
  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active: isActive })
        .eq('id', ruleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-automation-rules'] });
      toast({
        title: "Success",
        description: "Rule status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRules = automationRules.filter(rule => {
    const matchesSearch = rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.rule_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && rule.is_active) ||
                         (filterStatus === 'inactive' && !rule.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleCreateRule = () => {
    createRuleMutation.mutate(newRule);
  };

  return (
    <div className="space-y-6">
      {/* Automation Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats?.totalRules || 0}</div>
            <p className="text-xs text-muted-foreground">Automation rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats?.activeRules || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commands</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats?.pendingCommands || 0}</div>
            <p className="text-xs text-muted-foreground">In queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executed Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStats?.executedToday || 0}</div>
            <p className="text-xs text-muted-foreground">Rules executed</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules Management */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Manage automated tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-automation-rules'] })}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Automation Rule</DialogTitle>
                    <DialogDescription>Set up a new automated task</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Rule Name</Label>
                      <Input
                        id="name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rule_type">Rule Type</Label>
                      <select
                        id="rule_type"
                        value={newRule.rule_type}
                        onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="event_driven">Event Driven</option>
                        <option value="conditional">Conditional</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleCreateRule}
                      disabled={createRuleMutation.isPending}
                      className="w-full"
                    >
                      Create Rule
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading automation rules...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Executions</TableHead>
                  <TableHead>Last Executed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{rule.rule_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.execution_count || 0}</TableCell>
                    <TableCell>
                      {rule.last_executed 
                        ? new Date(rule.last_executed).toLocaleString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRuleMutation.mutate({ 
                            ruleId: rule.id, 
                            isActive: !rule.is_active 
                          })}
                          disabled={toggleRuleMutation.isPending}
                        >
                          {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => executeRuleMutation.mutate(rule.id)}
                          disabled={executeRuleMutation.isPending || !rule.is_active}
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Command Queue Status */}
      <Card>
        <CardHeader>
          <CardTitle>Command Queue</CardTitle>
          <CardDescription>Monitor pending and executing commands</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Retries</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commandQueue.slice(0, 10).map((command) => (
                <TableRow key={command.id}>
                  <TableCell className="font-medium">
                    {command.command_id || 'Unknown Command'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(command.status)}>
                      {command.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{command.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(command.scheduled_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {command.retry_count}/{command.max_retries}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAutomationTab;
