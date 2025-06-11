
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RefreshCw, Globe } from 'lucide-react';
import { AICommand } from '../types';
import { toast } from '@/hooks/use-toast';

interface EditCommandModalProps {
  command: AICommand | null;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<AICommand>) => void;
  isSaving: boolean;
}

const EditCommandModal: React.FC<EditCommandModalProps> = ({
  command,
  open,
  onClose,
  onSave,
  isSaving
}) => {
  const [editedCommand, setEditedCommand] = useState<Partial<AICommand>>({});

  useEffect(() => {
    if (command) {
      setEditedCommand({
        name: command.name,
        description: command.description,
        code: command.code,
        category: command.category,
        command_type: command.command_type,
        priority: command.priority,
        execution_timeout: command.execution_timeout,
        site_url: command.site_url || ''
      });
    }
  }, [command]);

  const handleSave = () => {
    if (!editedCommand.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Command name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!editedCommand.code?.trim()) {
      toast({
        title: "Validation Error",
        description: "Command code/instructions are required.",
        variant: "destructive",
      });
      return;
    }

    console.log('💾 Saving command updates:', editedCommand);
    onSave(editedCommand);
  };

  if (!command) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit AI Command: {command.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Command Name *</label>
              <Input
                value={editedCommand.name || ''}
                onChange={(e) => setEditedCommand({...editedCommand, name: e.target.value})}
                placeholder="e.g., Analyze Coin Image"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <Select 
                value={editedCommand.category || 'general'} 
                onValueChange={(value) => setEditedCommand({...editedCommand, category: value})}
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
            <label className="text-sm font-medium block mb-1">Description</label>
            <Input
              value={editedCommand.description || ''}
              onChange={(e) => setEditedCommand({...editedCommand, description: e.target.value})}
              placeholder="Brief description of what this command does"
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Site URL (Optional - for website parsing)
            </label>
            <Input
              value={editedCommand.site_url || ''}
              onChange={(e) => setEditedCommand({...editedCommand, site_url: e.target.value})}
              placeholder="https://example.com/coin-page"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If provided, the AI will parse this website for coin information during execution
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Command Code/Instructions *</label>
            <Textarea
              value={editedCommand.code || ''}
              onChange={(e) => setEditedCommand({...editedCommand, code: e.target.value})}
              placeholder={editedCommand.site_url ? 
                "Instructions for analyzing the website content..." :
                "Enter the command logic, instructions, or code..."
              }
              rows={10}
              className="w-full font-mono text-sm"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Command Type</label>
              <Select 
                value={editedCommand.command_type || 'manual'} 
                onValueChange={(value) => setEditedCommand({...editedCommand, command_type: value})}
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
              <label className="text-sm font-medium block mb-1">Priority (1-10)</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={editedCommand.priority || 1}
                onChange={(e) => setEditedCommand({...editedCommand, priority: parseInt(e.target.value) || 1})}
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
                value={editedCommand.execution_timeout || 30000}
                onChange={(e) => setEditedCommand({...editedCommand, execution_timeout: parseInt(e.target.value) || 30000})}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !editedCommand.name?.trim() || !editedCommand.code?.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommandModal;
