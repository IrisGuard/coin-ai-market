
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Settings, Play, Pause, Trash2, History, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AICommand } from '../types';
import EditCommandModal from './EditCommandModal';
import ExecutionHistoryModal from './ExecutionHistoryModal';

interface CommandCardProps {
  command: AICommand;
  onToggleActive: (command: AICommand) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<AICommand>) => void;
  onExecute: (commandId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isExecuting: boolean;
}

const CommandCard: React.FC<CommandCardProps> = ({
  command,
  onToggleActive,
  onDelete,
  onUpdate,
  onExecute,
  isUpdating,
  isDeleting,
  isExecuting
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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

  const handleEdit = (updates: Partial<AICommand>) => {
    onUpdate(command.id, updates);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
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
            {command.code?.substring(0, 200)}
            {(command.code?.length || 0) > 200 && '...'}
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
              onCheckedChange={() => onToggleActive(command)}
              disabled={isUpdating}
            />
            <span className="text-xs text-muted-foreground">
              {command.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowEditModal(true)}
            disabled={isUpdating}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant={command.is_active ? "default" : "outline"}
            onClick={() => onExecute(command.id)}
            disabled={isExecuting || !command.is_active}
          >
            {isExecuting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : command.is_active ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowHistoryModal(true)}>
                <History className="h-4 w-4 mr-2" />
                View History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Command
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(command.id)}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EditCommandModal
        command={command}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
        isSaving={isUpdating}
      />

      <ExecutionHistoryModal
        commandId={command.id}
        commandName={command.name}
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </>
  );
};

export default CommandCard;
