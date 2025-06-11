
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Trash2, History, Power } from 'lucide-react';
import { AICommand } from '../types';

interface CommandCardProps {
  command: AICommand;
  onToggleActive: (command: AICommand) => void;
  onDelete: (id: string) => void;
  onEdit: (command: AICommand) => void;
  onExecute: (commandId: string, inputData?: any) => void;
  onViewHistory: (command: AICommand) => void;
  isExecuting: boolean;
  isDeleting: boolean;
}

const CommandCard: React.FC<CommandCardProps> = ({
  command,
  onToggleActive,
  onDelete,
  onEdit,
  onExecute,
  onViewHistory,
  isExecuting,
  isDeleting
}) => {
  return (
    <Card className={`${!command.is_active ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="truncate">{command.name}</span>
          <div className="flex items-center gap-2">
            <Badge variant={command.is_active ? "default" : "secondary"}>
              {command.is_active ? "Active" : "Inactive"}
            </Badge>
            {command.site_url && (
              <Badge variant="outline" className="text-xs">
                Web Parse
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {command.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {command.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline">{command.category}</Badge>
          <Badge variant="outline">{command.command_type}</Badge>
          <Badge variant="outline">Priority: {command.priority}</Badge>
        </div>

        {command.site_url && (
          <div className="text-xs text-muted-foreground truncate">
            <span className="font-medium">Site:</span> {command.site_url}
          </div>
        )}

        <div className="flex gap-1 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExecute(command.id)}
            disabled={isExecuting || !command.is_active}
            className="flex-1"
          >
            <Play className="h-3 w-3 mr-1" />
            {isExecuting ? 'Running...' : 'Execute'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleActive(command)}
          >
            <Power className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(command)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewHistory(command)}
          >
            <History className="h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(command.id)}
            disabled={isDeleting}
            className="text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandCard;
