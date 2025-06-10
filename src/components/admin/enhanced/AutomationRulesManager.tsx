
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, Pause, Clock, CheckCircle, AlertTriangle, 
  Calendar, Settings, TrendingUp, Zap, Filter
} from 'lucide-react';
import { useAutomationRules, useExecuteAutomationRule } from '@/hooks/admin/useEnhancedAIBrain';

const AutomationRulesManager = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { data: rules, isLoading } = useAutomationRules();
  const executeRule = useExecuteAutomationRule();

  const filteredRules = rules?.filter(rule => {
    const matchesType = filterType === 'all' || rule.rule_type === filterType;
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  }) || [];

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'event_triggered': return <Zap className="w-4 h-4" />;
      case 'condition_based': return <TrendingUp className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'event_triggered': return 'bg-purple-100 text-purple-800';
      case 'condition_based': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-gray-400';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading automation rules...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Automation Rules Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="scheduled">Scheduled</option>
                <option value="event_triggered">Event Triggered</option>
                <option value="condition_based">Condition Based</option>
              </select>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRuleTypeIcon(rule.rule_type)}
                        <h3 className="font-semibold">{rule.name}</h3>
                      </div>
                      <Badge className={getRuleTypeColor(rule.rule_type)}>
                        {rule.rule_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600">{rule.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Executions:</span>
                        <span className="ml-1 font-medium">{rule.execution_count}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Success:</span>
                        <span className="ml-1 font-medium">{rule.success_count}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Run:</span>
                        <span className="ml-1 font-medium">
                          {rule.last_executed 
                            ? new Date(rule.last_executed).toLocaleString()
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-1 font-medium ${getStatusColor(rule.is_active)}`}>
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeRule.mutate(rule.id)}
                        disabled={executeRule.isPending || !rule.is_active}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Execute
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No automation rules found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {rules?.filter(r => r.is_active).length || 0}
            </div>
            <div className="text-sm text-gray-600">Active Rules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {rules?.filter(r => r.rule_type === 'scheduled').length || 0}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {rules?.filter(r => r.rule_type === 'event_triggered').length || 0}
            </div>
            <div className="text-sm text-gray-600">Event Triggered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {rules?.reduce((sum, r) => sum + r.execution_count, 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Total Executions</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationRulesManager;
