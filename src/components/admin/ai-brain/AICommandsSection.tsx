
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, RefreshCw, Brain, Zap } from 'lucide-react';
import { useAICommands } from './hooks/useAICommands';
import CommandCard from './components/CommandCard';
import AddCommandForm from './components/AddCommandForm';
import EditCommandModal from './components/EditCommandModal';
import ExecutionHistoryModal from './components/ExecutionHistoryModal';
import { AICommand } from './types';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCommand, setEditingCommand] = useState<AICommand | null>(null);
  const [historyCommand, setHistoryCommand] = useState<{ id: string; name: string } | null>(null);
  
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

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCommand = async (commandData: any) => {
    try {
      await createCommandMutation.mutateAsync(commandData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create command:', error);
    }
  };

  const handleEditCommand = async (updates: Partial<AICommand>) => {
    if (!editingCommand) return;
    
    try {
      await updateCommandMutation.mutateAsync({ 
        id: editingCommand.id, 
        updates 
      });
      setEditingCommand(null);
    } catch (error) {
      console.error('Failed to update command:', error);
    }
  };

  const handleDeleteCommand = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this command?')) {
      try {
        await deleteCommandMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete command:', error);
      }
    }
  };

  const handleExecuteCommand = async (commandId: string, inputData?: any) => {
    try {
      console.log('🎯 AICommandsSection: Executing command:', commandId);
      await executeCommandMutation.mutateAsync({ commandId, inputData });
      console.log('✅ AICommandsSection: Command execution completed');
    } catch (error) {
      console.error('❌ AICommandsSection: Failed to execute command:', error);
    }
  };

  const handleViewHistory = (command: AICommand) => {
    setHistoryCommand({ id: command.id, name: command.name });
  };

  const handleToggleActive = async (command: AICommand) => {
    try {
      await updateCommandMutation.mutateAsync({
        id: command.id,
        updates: { is_active: !command.is_active }
      });
    } catch (error) {
      console.error('Failed to toggle command active state:', error);
    }
  };

  // Fixed: Pass the command to the edit handler
  const handleEditClick = (command: AICommand) => {
    setEditingCommand(command);
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="mb-4">Failed to load AI commands: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Commands Management
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredCommands.length} commands)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Command
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search commands by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {showAddForm && (
            <div className="mb-6">
              <AddCommandForm
                onSubmit={handleCreateCommand}
                isSubmitting={createCommandMutation.isPending}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading AI commands...</span>
            </div>
          ) : filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                {searchTerm 
                  ? `No commands found matching "${searchTerm}"`
                  : 'No AI commands found. Create your first command to get started!'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommands.map((command) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDeleteCommand}
                  onEdit={handleEditClick}
                  onExecute={handleExecuteCommand}
                  onViewHistory={handleViewHistory}
                  isExecuting={executeCommandMutation.isPending}
                  isDeleting={deleteCommandMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditCommandModal
        command={editingCommand}
        open={!!editingCommand}
        onClose={() => setEditingCommand(null)}
        onSave={handleEditCommand}
        isSaving={updateCommandMutation.isPending}
      />

      <ExecutionHistoryModal
        commandId={historyCommand?.id || null}
        commandName={historyCommand?.name}
        open={!!historyCommand}
        onClose={() => setHistoryCommand(null)}
      />
    </div>
  );
};

export default AICommandsSection;
