import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Play, Pause, Settings, Trash2, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

interface AICommand {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
  command_type: string;
  is_active: boolean;
  created_at: string;
  priority: number;
  execution_timeout: number;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCommand, setEditingCommand] = useState<AICommand | null>(null);
  const [newCommand, setNewCommand] = useState({
    name: '',
    description: '',
    code: '',
    category: 'general',
    command_type: 'manual',
    priority: 1,
    execution_timeout: 30000
  });

  const queryClient = useQueryClient();

  const { data: commands = [], isLoading, error } = useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      console.log('Fetching AI commands...');
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('AI Commands fetched successfully:', data?.length || 0, 'commands');
      console.log('Commands data:', data);
      return data as AICommand[] || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  const createCommandMutation = useMutation({
    mutationFn: async (commandData: typeof newCommand) => {
      const { data, error } = await supabase
        .from('ai_commands')
        .insert([{
          ...commandData,
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Created",
        description: "AI command has been successfully created.",
      });
      setNewCommand({
        name: '',
        description: '',
        code: '',
        category: 'general',
        command_type: 'manual',
        priority: 1,
        execution_timeout: 30000
      });
      setShowAddForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateCommandMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AICommand> }) => {
      const { data, error } = await supabase
        .from('ai_commands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Updated",
        description: "AI command has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteCommandMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_commands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Deleted",
        description: "AI command has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const filteredCommands = commands.filter(command =>
    command.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recognition': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'interface': return 'bg-purple-100 text-purple-800';
      case 'data': return 'bg-yellow-100 text-yellow-800';
      case 'coin-analysis': return 'bg-orange-100 text-orange-800';
      case 'marketplace': return 'bg-cyan-100 text-cyan-800';
      case 'external': return 'bg-pink-100 text-pink-800';
      case 'automation': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleActive = (command: AICommand) => {
    updateCommandMutation.mutate({
      id: command.id,
      updates: { is_active: !command.is_active }
    });
  };

  const handleCreateCommand = () => {
    if (!newCommand.name || !newCommand.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required fields.",
        variant: "destructive",
      });
      return;
    }
    createCommandMutation.mutate(newCommand);
  };

  if (error) {
    console.error('AI Commands error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading commands: {error.message}
            <div className="mt-4">
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['ai-commands'] })}
                variant="outline"
              >
                Retry Loading
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeCommandsCount = commands.filter(c => c.is_active).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Commands
              <Badge variant="secondary">{commands.length} Total</Badge>
              <Badge variant="default">{activeCommandsCount} Active</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage AI commands that control the brain's behavior
            </p>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Command
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New AI Command</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Command Name</label>
                    <Input
                      value={newCommand.name}
                      onChange={(e) => setNewCommand({...newCommand, name: e.target.value})}
                      placeholder="Enter command name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newCommand.category} onValueChange={(value) => setNewCommand({...newCommand, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="coin-analysis">Coin Analysis</SelectItem>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
                        <SelectItem value="recognition">Recognition</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="interface">Interface</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                        <SelectItem value="automation">Automation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newCommand.description}
                    onChange={(e) => setNewCommand({...newCommand, description: e.target.value})}
                    placeholder="Describe what this command does"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Command Code/Instructions</label>
                  <Textarea
                    value={newCommand.code}
                    onChange={(e) => setNewCommand({...newCommand, code: e.target.value})}
                    placeholder="Enter the command logic or instructions for the AI"
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Command Type</label>
                    <Select value={newCommand.command_type} onValueChange={(value) => setNewCommand({...newCommand, command_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="triggered">Triggered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority (1-10)</label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={newCommand.priority}
                      onChange={(e) => setNewCommand({...newCommand, priority: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timeout (ms)</label>
                    <Input
                      type="number"
                      value={newCommand.execution_timeout}
                      onChange={(e) => setNewCommand({...newCommand, execution_timeout: parseInt(e.target.value) || 30000})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCommand} disabled={createCommandMutation.isPending}>
                    {createCommandMutation.isPending ? 'Creating...' : 'Create Command'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commands by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No commands found matching your search' : 'No AI commands configured yet'}
              {!searchTerm && (
                <div className="mt-2">
                  <Button variant="outline" onClick={() => setShowAddForm(true)}>
                    Create your first command
                  </Button>
                </div>
              )}
            </div>
          ) : (
            filteredCommands.map((command) => (
              <div key={command.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{command.name}</h4>
                    <Badge className={getCategoryColor(command.category)}>
                      {command.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {command.command_type}
                    </Badge>
                    <Badge variant={command.is_active ? "default" : "secondary"} className="text-xs">
                      {command.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{command.description}</p>
                  
                  <div className="bg-muted/50 p-3 rounded text-xs font-mono mb-3 max-h-24 overflow-y-auto">
                    {command.code.substring(0, 200)}
                    {command.code.length > 200 && '...'}
                  </div>
                  
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Priority: {command.priority}</span>
                    <span>Timeout: {command.execution_timeout}ms</span>
                    <span>Created: {new Date(command.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={command.is_active}
                      onCheckedChange={() => handleToggleActive(command)}
                      disabled={updateCommandMutation.isPending}
                    />
                    <span className="text-xs text-muted-foreground">
                      {command.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={command.is_active ? "outline" : "default"}
                  >
                    {command.is_active ? (
                      <>
                        <Pause className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteCommandMutation.mutate(command.id)}
                    disabled={deleteCommandMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICommandsSection;
