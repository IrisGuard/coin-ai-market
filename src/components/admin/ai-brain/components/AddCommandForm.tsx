
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Brain } from 'lucide-react';
import { NewCommandForm } from '../types';
import { toast } from '@/hooks/use-toast';

interface AddCommandFormProps {
  onCreateCommand: (command: NewCommandForm) => void;
  isCreating: boolean;
}

const AddCommandForm: React.FC<AddCommandFormProps> = ({ onCreateCommand, isCreating }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommand, setNewCommand] = useState<NewCommandForm>({
    name: '',
    description: '',
    code: '',
    category: 'general',
    command_type: 'manual',
    priority: 1,
    execution_timeout: 30000
  });

  const handleCreateCommand = () => {
    if (!newCommand.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Command name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!newCommand.code?.trim()) {
      toast({
        title: "Validation Error",
        description: "Command code/instructions are required.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('➕ Creating new command with data:', newCommand);
    onCreateCommand(newCommand);
    
    // Reset form
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
  };

  const resetForm = () => {
    setNewCommand({
      name: '',
      description: '',
      code: '',
      category: 'general',
      command_type: 'manual',
      priority: 1,
      execution_timeout: 30000
    });
  };

  return (
    <Dialog open={showAddForm} onOpenChange={(open) => {
      setShowAddForm(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Command
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-green-600" />
            Create New AI Command
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Command Name *</label>
              <Input
                value={newCommand.name}
                onChange={(e) => setNewCommand({...newCommand, name: e.target.value})}
                placeholder="e.g., Analyze Coin Image"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
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
            <label className="text-sm font-medium block mb-1">Description</label>
            <Input
              value={newCommand.description}
              onChange={(e) => setNewCommand({...newCommand, description: e.target.value})}
              placeholder="Brief description of what this command does"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Command Code/Instructions *</label>
            <Textarea
              value={newCommand.code}
              onChange={(e) => setNewCommand({...newCommand, code: e.target.value})}
              placeholder="Enter the command logic, instructions, or code that the AI should execute..."
              rows={8}
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This can be JavaScript code, AI prompts, API calls, or any instructions for the AI brain.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Command Type</label>
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
              <label className="text-sm font-medium block mb-1">Priority (1-10)</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={newCommand.priority}
                onChange={(e) => setNewCommand({...newCommand, priority: parseInt(e.target.value) || 1})}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Timeout (ms)</label>
              <Input
                type="number"
                min={1000}
                max={300000}
                step={1000}
                value={newCommand.execution_timeout}
                onChange={(e) => setNewCommand({...newCommand, execution_timeout: parseInt(e.target.value) || 30000})}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCommand} 
              disabled={isCreating || !newCommand.name?.trim() || !newCommand.code?.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Command
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommandForm;
