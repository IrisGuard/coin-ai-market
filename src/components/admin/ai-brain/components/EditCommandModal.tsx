
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AICommand, NewCommandForm } from '../types';
import { toast } from '@/hooks/use-toast';

interface EditCommandModalProps {
  command: AICommand | null;
  open: boolean;
  onClose: () => void;
  onSave: (commandData: Partial<AICommand>) => void;
  isSaving: boolean;
}

const EditCommandModal: React.FC<EditCommandModalProps> = ({
  command,
  open,
  onClose,
  onSave,
  isSaving
}) => {
  const [formData, setFormData] = useState<Partial<AICommand>>({
    name: '',
    description: '',
    code: '',
    category: 'general',
    command_type: 'manual',
    priority: 1,
    execution_timeout: 30000
  });

  useEffect(() => {
    if (command) {
      setFormData({
        name: command.name || '',
        description: command.description || '',
        code: command.code || '',
        category: command.category || 'general',
        command_type: command.command_type || 'manual',
        priority: command.priority || 1,
        execution_timeout: command.execution_timeout || 30000
      });
    }
  }, [command]);

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      category: 'general',
      command_type: 'manual',
      priority: 1,
      execution_timeout: 30000
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {command ? `Edit Command: ${command.name}` : 'Edit Command'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Command Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter command name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
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
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this command does"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Command Code/Instructions</label>
            <Textarea
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              placeholder="Enter the command logic or instructions for the AI"
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Command Type</label>
              <Select 
                value={formData.command_type} 
                onValueChange={(value) => setFormData({...formData, command_type: value})}
              >
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
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timeout (ms)</label>
              <Input
                type="number"
                value={formData.execution_timeout}
                onChange={(e) => setFormData({...formData, execution_timeout: parseInt(e.target.value) || 30000})}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommandModal;
