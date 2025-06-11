
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Settings, Play, Pause, Trash2, History, MoreVertical, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
      case 'recognition': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analytics': return 'bg-green-100 text-green-800 border-green-200';
      case 'interface': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'data': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'coin-analysis': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'marketplace': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'external': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'automation': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manual': return 'bg-slate-100 text-slate-800';
      case 'automatic': return 'bg-emerald-100 text-emerald-800';
      case 'scheduled': return 'bg-amber-100 text-amber-800';
      case 'triggered': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (updates: Partial<AICommand>) => {
    onUpdate(command.id, updates);
    setShowEditModal(false);
  };

  const handleExecute = () => {
    console.log('▶️ Command execution triggered:', command.name);
    onExecute(command.id);
  };

  return (
    <>
      <div className={`flex items-start justify-between p-4 border rounded-lg transition-all duration-200 ${
        command.is_active 
          ? 'border-green-200 bg-green-50/30 hover:bg-green-50/50' 
          : 'border-gray-200 bg-gray-50/30 hover:bg-gray-50/50'
      }`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-semibold text-lg">{command.name}</h4>
            <Badge className={getCategoryColor(command.category)}>
              {command.category}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getTypeColor(command.command_type)}`}>
              {command.command_type}
            </Badge>
            <Badge variant={command.is_active ? "default" : "secondary"} className="text-xs">
              {command.is_active ? (
                <><CheckCircle className="w-3 h-3 mr-1" />Active</>
              ) : (
                <><XCircle className="w-3 h-3 mr-1" />Inactive</>
              )}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Priority: {command.priority}
            </Badge>
          </div>
          
          {command.description && (
            <p className="text-sm text-muted-foreground mb-3">{command.description}</p>
          )}
          
          <div className="bg-slate-50 p-3 rounded border text-xs font-mono mb-3 max-h-24 overflow-y-auto">
            <div className="text-slate-600 mb-1">Command Code:</div>
            {command.code?.substring(0, 200)}
            {(command.code?.length || 0) > 200 && (
              <span className="text-slate-500">... ({command.code?.length} chars total)</span>
            )}
          </div>
          
          <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Timeout: {command.execution_timeout}ms
            </span>
            <span>Created: {new Date(command.created_at).toLocaleDateString()}</span>
            {command.updated_at && command.updated_at !== command.created_at && (
              <span>Updated: {new Date(command.updated_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Switch
              checked={command.is_active}
              onCheckedChange={() => onToggleActive(command)}
              disabled={isUpdating}
            />
            <span className="text-xs text-muted-foreground min-w-[50px]">
              {command.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowEditModal(true)}
            disabled={isUpdating}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Button
            size="sm"
            variant={command.is_active ? "default" : "outline"}
            onClick={handleExecute}
            disabled={isExecuting || !command.is_active}
            className={`flex items-center gap-1 ${
              command.is_active ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {isExecuting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : command.is_active ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isExecuting ? 'Running...' : command.is_active ? 'Execute' : 'Disabled'}
            </span>
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
                View Execution History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Command
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(command.id)}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Command'}
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
