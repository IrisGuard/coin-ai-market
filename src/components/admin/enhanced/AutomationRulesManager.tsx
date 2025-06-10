
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Play, Pause, Edit, Trash2 } from 'lucide-react';

const AutomationRulesManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock automation rules data
  const automationRules = [
    {
      id: '1',
      name: 'Price Alert Automation',
      description: 'Automatically notify users when coin prices change by more than 10%',
      rule_type: 'price_monitoring',
      is_active: true,
      execution_count: 45,
      last_executed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      success_count: 43
    },
    {
      id: '2',
      name: 'New Listing Promotion',
      description: 'Automatically promote new high-value listings',
      rule_type: 'listing_promotion',
      is_active: true,
      execution_count: 12,
      last_executed: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      success_count: 12
    },
    {
      id: '3',
      name: 'Quality Check Automation',
      description: 'Automatically flag listings that may need manual review',
      rule_type: 'quality_control',
      is_active: false,
      execution_count: 8,
      last_executed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      success_count: 7
    }
  ];

  const handleToggleRule = (ruleId: string) => {
    console.log('Toggling automation rule:', ruleId);
  };

  const handleExecuteRule = (ruleId: string) => {
    console.log('Executing automation rule:', ruleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automation Rules</h3>
          <p className="text-sm text-gray-600">Manage automated processes and workflows</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Automation Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rule Name</label>
              <Input placeholder="Enter rule name..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe what this rule does..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rule Type</label>
              <select className="w-full p-2 border rounded-md">
                <option value="price_monitoring">Price Monitoring</option>
                <option value="listing_promotion">Listing Promotion</option>
                <option value="quality_control">Quality Control</option>
                <option value="user_engagement">User Engagement</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button>Create Rule</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {automationRules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{rule.name}</h3>
                  <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">{rule.rule_type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={rule.is_active} 
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                  <Button size="sm" variant="outline" onClick={() => handleExecuteRule(rule.id)}>
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{rule.description}</p>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Executions:</span>
                  <span className="ml-2 font-medium">{rule.execution_count}</span>
                </div>
                <div>
                  <span className="text-gray-500">Success Rate:</span>
                  <span className="ml-2 font-medium">
                    {rule.execution_count > 0 ? 
                      Math.round((rule.success_count / rule.execution_count) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Executed:</span>
                  <span className="ml-2 font-medium">
                    {rule.last_executed ? rule.last_executed.toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationRulesManager;
