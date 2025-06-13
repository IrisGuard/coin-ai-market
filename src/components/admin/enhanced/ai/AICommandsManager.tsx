
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Plus, Search, Edit, Trash2, Brain } from 'lucide-react';
import { useAICommands } from '@/hooks/useAICommands';
import { useExecuteAICommand } from '@/hooks/useExecuteAICommand';

const AICommandsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { commands, isLoading } = useAICommands();
  const { executeCommand, isExecuting } = useExecuteAICommand();

  const filteredCommands = commands?.filter(cmd => 
    cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coin_identification': return 'bg-blue-100 text-blue-800';
      case 'market_analysis': return 'bg-green-100 text-green-800';
      case 'price_estimation': return 'bg-yellow-100 text-yellow-800';
      case 'authentication': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExecuteCommand = async (commandId: string) => {
    try {
      await executeCommand(commandId, {});
    } catch (error) {
      console.error('Command execution failed:', error);
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
              <Brain className="h-6 w-6 text-blue-600" />
              AI Commands Management
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Command
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search AI commands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{commands?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {commands?.filter(cmd => cmd.is_active).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {new Set(commands?.map(cmd => cmd.category)).size || 0}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {commands?.filter(cmd => cmd.priority >= 8).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commands ({filteredCommands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommands.map((command) => (
                <TableRow key={command.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{command.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {command.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(command.category)}>
                      {command.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{command.command_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={command.priority >= 8 ? 'default' : 'secondary'}>
                      {command.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={command.is_active ? 'default' : 'secondary'}>
                      {command.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecuteCommand(command.id)}
                        disabled={isExecuting || !command.is_active}
                      >
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

export default AICommandsManager;
