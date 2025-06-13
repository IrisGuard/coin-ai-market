
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Plus, Search, Edit, Trash2, Bot, Clock, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AutomationRulesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rules, isLoading } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching automation rules:', error);
        throw error;
      }
      
      console.log('✅ Automation rules loaded:', data?.length);
      return data || [];
    }
  });

  const filteredRules = rules?.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.rule_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'event_driven': return 'bg-green-100 text-green-800';
      case 'condition_based': return 'bg-yellow-100 text-yellow-800';
      case 'ai_triggered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              Automation Rules Management
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search automation rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{rules?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {rules?.filter(rule => rule.is_active).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {rules?.filter(rule => rule.last_executed && new Date(rule.last_executed) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Executed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(rules?.map(rule => rule.rule_type)).size || 0}
              </div>
              <div className="text-sm text-muted-foreground">Rule Types</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Rules ({filteredRules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Executed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {rule.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRuleTypeColor(rule.rule_type)}>
                      {rule.rule_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {rule.execution_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="text-sm">
                        {rule.execution_count ? Math.round(((rule.success_count || 0) / rule.execution_count) * 100) : 0}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <div className="text-sm">
                        {rule.last_executed ? new Date(rule.last_executed).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AutomationRulesManager;
