
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Zap, Activity, TrendingUp, Search, Filter } from 'lucide-react';
import { useAICommandCategories } from '@/hooks/useAICommandCategories';
import { useEnhancedAICommands } from '@/hooks/useEnhancedAICommands';
import { useAIExecutionLogs, useAIPerformanceAnalytics } from '@/hooks/useAIExecutionLogs';
import EnhancedCommandGrid from './components/EnhancedCommandGrid';
import AIPerformanceDashboard from './components/AIPerformanceDashboard';
import CommandExecutionMonitor from './components/CommandExecutionMonitor';

const EnhancedAIBrainDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('commands');

  const { data: categories = [] } = useAICommandCategories();
  const { commands, isLoading, executeCommand, isExecuting } = useEnhancedAICommands(
    selectedCategory === 'all' ? undefined : selectedCategory
  );
  const { data: executionLogs = [] } = useAIExecutionLogs();
  const { data: performanceData = [] } = useAIPerformanceAnalytics();

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalCommands: commands.length,
    activeCategories: categories.length,
    totalExecutions: executionLogs.length,
    successRate: executionLogs.length > 0 
      ? Math.round((executionLogs.filter(log => log.success).length / executionLogs.length) * 100)
      : 0,
    avgExecutionTime: executionLogs.length > 0
      ? Math.round(executionLogs.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / executionLogs.length)
      : 0
  };

  // Fix: Make executeCommand async to match the expected type
  const handleExecuteCommand = async (commandId: string, inputData: any = {}) => {
    return await executeCommand(commandId, inputData);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Commands</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCommands}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.activeCategories} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              From {stats.totalExecutions} executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.avgExecutionTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average execution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Commands
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commands" className="space-y-4">
          {/* Search and Filter Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Command Center
                  <Badge variant="outline">{filteredCommands.length} commands</Badge>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search commands by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Quick Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Categories
                </Button>
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    style={{ 
                      backgroundColor: selectedCategory === category.name ? category.color : undefined,
                      borderColor: category.color 
                    }}
                  >
                    {category.icon} {category.description?.split(' ')[0]}
                  </Button>
                ))}
              </div>

              <EnhancedCommandGrid
                commands={filteredCommands}
                categories={categories}
                onExecute={handleExecuteCommand}
                isExecuting={isExecuting}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <AIPerformanceDashboard 
            performanceData={performanceData}
            executionLogs={executionLogs}
          />
        </TabsContent>

        <TabsContent value="monitoring">
          <CommandExecutionMonitor 
            executionLogs={executionLogs}
            commands={commands}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Advanced analytics dashboard coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIBrainDashboard;
