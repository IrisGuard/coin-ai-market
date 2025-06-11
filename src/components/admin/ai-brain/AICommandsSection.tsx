
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAICommands } from './hooks/useAICommands';
import AddCommandForm from './components/AddCommandForm';
import CommandCard from './components/CommandCard';
import { AICommand } from './types';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const {
    commands,
    isLoading,
    error,
    refetch,
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation,
    executeCommandMutation
  } = useAICommands();

  // Debug logging with enhanced information
  useEffect(() => {
    console.log('🔍 AICommandsSection - Real-time status update:');
    console.log('📊 Commands count:', commands?.length || 0);
    console.log('⏳ Loading state:', isLoading);
    console.log('❌ Error state:', error);
    console.log('📋 Commands data:', commands);
  }, [commands, isLoading, error]);

  const filteredCommands = commands.filter(command =>
    command.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = (command: AICommand) => {
    console.log('🔄 Toggling command active state:', command.name, !command.is_active);
    updateCommandMutation.mutate({
      id: command.id,
      updates: { is_active: !command.is_active }
    });
  };

  const handleUpdateCommand = (id: string, updates: Partial<AICommand>) => {
    console.log('✏️ Updating command:', id, updates);
    updateCommandMutation.mutate({ id, updates });
  };

  const handleCreateCommand = (commandData: any) => {
    console.log('➕ Creating new command:', commandData);
    createCommandMutation.mutate(commandData);
  };

  const handleExecuteCommand = (commandId: string) => {
    console.log('▶️ Executing command:', commandId);
    executeCommandMutation.mutate({ commandId });
  };

  const handleDeleteCommand = (id: string) => {
    if (confirm('Are you sure you want to delete this AI command? This action cannot be undone.')) {
      console.log('🗑️ Deleting command:', id);
      deleteCommandMutation.mutate(id);
    }
  };

  // Error handling with detailed debugging
  if (error) {
    console.error('❌ AI Commands error details:', error);
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            AI Commands - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-red-700">
              <p className="font-medium">Failed to load AI commands</p>
              <p className="text-sm mt-1">{error.message}</p>
              {error.message?.includes('Admin') && (
                <p className="text-sm mt-2 p-3 bg-red-100 rounded border">
                  ⚠️ Admin access required. Please ensure you have admin privileges.
                </p>
              )}
            </div>
            <Button 
              onClick={() => {
                console.log('🔄 Manual retry triggered');
                refetch();
              }}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI Commands
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-coin-purple" />
              <span className="text-muted-foreground">Loading AI commands...</span>
            </div>
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
              <CheckCircle className="w-5 h-5 text-green-600" />
              AI Commands
              <Badge variant="default" className="bg-green-600">
                {commands.length} Total
              </Badge>
              <Badge variant="secondary">
                {activeCommandsCount} Active
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage AI commands that control the brain's behavior - Real-time updates enabled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                console.log('🔄 Manual refresh triggered');
                refetch();
              }}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddCommandForm
              onCreateCommand={handleCreateCommand}
              isCreating={createCommandMutation.isPending}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commands by name, description, or category..."
            value={searchTerm}
            onChange={(e) => {
              console.log('🔍 Search term changed:', e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="max-w-md"
          />
          {searchTerm && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8">
              {searchTerm ? (
                <div className="text-muted-foreground">
                  <p>No commands found matching your search: "{searchTerm}"</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                </div>
              ) : commands.length === 0 ? (
                <div className="text-muted-foreground">
                  <p className="mb-4">No AI commands configured yet</p>
                  <p className="text-sm mb-4">Get started by adding your first command</p>
                  <AddCommandForm
                    onCreateCommand={handleCreateCommand}
                    isCreating={createCommandMutation.isPending}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">All commands are currently filtered out</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Showing {filteredCommands.length} of {commands.length} commands
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              {filteredCommands.map((command) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  onToggleActive={handleToggleActive}
                  onUpdate={handleUpdateCommand}
                  onDelete={handleDeleteCommand}
                  onExecute={handleExecuteCommand}
                  isUpdating={updateCommandMutation.isPending}
                  isDeleting={deleteCommandMutation.isPending}
                  isExecuting={executeCommandMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICommandsSection;
