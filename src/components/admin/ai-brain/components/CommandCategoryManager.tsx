
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, TrendingUp, Zap, Bot } from 'lucide-react';
import { useAICommandCategories } from '@/hooks/useAICommandCategories';
import { useEnhancedAICommands } from '@/hooks/useEnhancedAICommands';

const CommandCategoryManager = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: categories = [] } = useAICommandCategories();
  const { commands, executeCommand, isExecuting } = useEnhancedAICommands(
    selectedCategory === 'all' ? undefined : selectedCategory
  );

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryStats = (categoryName: string) => {
    const categoryCommands = commands.filter(cmd => cmd.category === categoryName);
    return {
      total: categoryCommands.length,
      active: categoryCommands.filter(cmd => cmd.is_active).length,
      avgPriority: categoryCommands.reduce((sum, cmd) => sum + (cmd.priority || 0), 0) / categoryCommands.length || 0
    };
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'web_scraping': return '🕷️';
      case 'expert_analysis': return '🔬';
      case 'market_intelligence': return '📊';
      case 'automation': return '🤖';
      default: return '⚡';
    }
  };

  const handleExecuteCommand = async (commandId: string) => {
    try {
      await executeCommand(commandId, {
        timestamp: new Date().toISOString(),
        executedFrom: 'category_manager'
      });
    } catch (error) {
      console.error('Command execution failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const stats = getCategoryStats(category.name);
          return (
            <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCategory(category.name)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.description}</span>
                  </div>
                  <Badge variant="outline">{stats.total}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Active</div>
                    <div className="font-medium">{stats.active}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg Priority</div>
                    <div className="font-medium">{stats.avgPriority.toFixed(1)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Command Management Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Commands</TabsTrigger>
          <TabsTrigger value="web_scraping">🕷️ Web Scraping</TabsTrigger>
          <TabsTrigger value="expert_analysis">🔬 Expert Analysis</TabsTrigger>
          <TabsTrigger value="market_intelligence">📊 Market Intel</TabsTrigger>
          <TabsTrigger value="automation">🤖 Automation</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Commands Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommands.map((command) => (
              <Card key={command.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getCategoryIcon(command.category)}</span>
                      <div>
                        <div className="font-semibold text-sm leading-tight">
                          {command.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {command.command_type}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      P{command.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {command.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{Math.round(command.execution_timeout / 1000)}s timeout</span>
                    <span className={`w-2 h-2 rounded-full ${command.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleExecuteCommand(command.id)}
                    disabled={isExecuting || !command.is_active}
                    className="w-full"
                  >
                    {isExecuting ? 'Executing...' : 'Execute'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommands.length === 0 && (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No commands found matching "${searchTerm}"`
                  : 'No commands available in this category'
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommandCategoryManager;
