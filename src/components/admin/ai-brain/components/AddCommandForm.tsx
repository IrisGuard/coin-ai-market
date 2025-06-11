
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
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
    if (!newCommand.name || !newCommand.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onCreateCommand(newCommand);
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

  return (
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
            <Button onClick={handleCreateCommand} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Command'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommandForm;
