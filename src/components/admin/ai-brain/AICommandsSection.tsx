
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAICommands } from './hooks/useAICommands';
import AddCommandForm from './components/AddCommandForm';
import CommandCard from './components/CommandCard';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const {
    commands,
    isLoading,
    error,
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation,
    queryClient
  } = useAICommands();

  const filteredCommands = commands.filter(command =>
    command.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = (command: any) => {
    updateCommandMutation.mutate({
      id: command.id,
      updates: { is_active: !command.is_active }
    });
  };

  const handleCreateCommand = (commandData: any) => {
    createCommandMutation.mutate(commandData);
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
          <AddCommandForm
            onCreateCommand={handleCreateCommand}
            isCreating={createCommandMutation.isPending}
          />
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
                  <AddCommandForm
                    onCreateCommand={handleCreateCommand}
                    isCreating={createCommandMutation.isPending}
                  />
                </div>
              )}
            </div>
          ) : (
            filteredCommands.map((command) => (
              <CommandCard
                key={command.id}
                command={command}
                onToggleActive={handleToggleActive}
                onDelete={deleteCommandMutation.mutate}
                isUpdating={updateCommandMutation.isPending}
                isDeleting={deleteCommandMutation.isPending}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICommandsSection;
