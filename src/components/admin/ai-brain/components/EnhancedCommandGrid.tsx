
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Zap, Settings } from 'lucide-react';

interface EnhancedCommandGridProps {
  commands: any[];
  categories: any[];
  onExecute: (commandId: string, inputData?: any) => Promise<any>;
  isExecuting: boolean;
  isLoading: boolean;
}

const EnhancedCommandGrid: React.FC<EnhancedCommandGridProps> = ({
  commands,
  categories,
  onExecute,
  isExecuting,
  isLoading
}) => {
  const getCategoryInfo = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || {
      icon: '🔧',
      color: '#6B7280'
    };
  };

  const getCommandTypeIcon = (commandType: string) => {
    switch (commandType) {
      case 'image_analysis': return '🖼️';
      case 'data_aggregation': return '📊';
      case 'speech_to_text': return '🎤';
      case 'ocr': return '📝';
      case 'prediction': return '🔮';
      default: return '⚡';
    }
  };

  const getCommandTypeColor = (commandType: string) => {
    switch (commandType) {
      case 'image_analysis': return 'bg-purple-100 text-purple-800';
      case 'data_aggregation': return 'bg-blue-100 text-blue-800';
      case 'speech_to_text': return 'bg-red-100 text-red-800';
      case 'ocr': return 'bg-green-100 text-green-800';
      case 'prediction': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExecute = async (command: any) => {
    try {
      // For demo purposes, we'll use basic input data
      // In a real implementation, this would open a modal for input
      const inputData = {
        timestamp: new Date().toISOString(),
        executedFrom: 'enhanced_dashboard'
      };
      
      await onExecute(command.id, inputData);
    } catch (error) {
      console.error('Command execution failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (commands.length === 0) {
    return (
      <div className="text-center py-8">
        <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-muted-foreground">No commands found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {commands.map((command) => {
        const categoryInfo = getCategoryInfo(command.category);
        
        return (
          <Card key={command.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <div>
                    <div className="font-semibold text-sm leading-tight">
                      {command.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCommandTypeColor(command.command_type)}`}
                      >
                        {getCommandTypeIcon(command.command_type)} {command.command_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Priority {command.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {command.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.round(command.execution_timeout / 1000)}s timeout
                </div>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoryInfo.color }}
                  title={command.category}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleExecute(command)}
                  disabled={isExecuting}
                  className="flex-1"
                >
                  <Play className="h-3 w-3 mr-1" />
                  {isExecuting ? 'Executing...' : 'Execute'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  title="Configure Command"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedCommandGrid;
