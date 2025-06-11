
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Play, Pause, Settings } from 'lucide-react';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  // Mock AI commands data
  const mockCommands = [
    {
      id: '1',
      name: 'Coin Recognition Analysis',
      description: 'Advanced AI analysis of coin images for identification and grading',
      command_type: 'image_analysis',
      is_active: true,
      execution_count: 1247,
      success_rate: 96.8,
      category: 'recognition'
    },
    {
      id: '2',
      name: 'Price Prediction Model',
      description: 'Machine learning model for predicting coin market values',
      command_type: 'prediction',
      is_active: true,
      execution_count: 856,
      success_rate: 89.2,
      category: 'analytics'
    },
    {
      id: '3',
      name: 'Error Coin Detection',
      description: 'Specialized AI for detecting minting errors and varieties',
      command_type: 'error_detection',
      is_active: true,
      execution_count: 432,
      success_rate: 92.4,
      category: 'recognition'
    },
    {
      id: '4',
      name: 'Market Trend Analysis',
      description: 'AI-powered analysis of market trends and patterns',
      command_type: 'trend_analysis',
      is_active: true,
      execution_count: 689,
      success_rate: 87.6,
      category: 'analytics'
    },
    {
      id: '5',
      name: 'Voice Recognition Commands',
      description: 'Natural language processing for voice-activated coin searches',
      command_type: 'voice_processing',
      is_active: true,
      execution_count: 234,
      success_rate: 94.1,
      category: 'interface'
    },
    {
      id: '6',
      name: 'Bulk Data Processing',
      description: 'Automated processing of large coin datasets',
      command_type: 'batch_processing',
      is_active: false,
      execution_count: 156,
      success_rate: 98.2,
      category: 'data'
    }
  ];

  const filteredCommands = mockCommands.filter(command =>
    command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.command_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recognition': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'interface': return 'bg-purple-100 text-purple-800';
      case 'data': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Commands</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCommands.map((command) => (
            <div key={command.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{command.name}</div>
                <div className="text-sm text-muted-foreground">{command.description}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant={command.is_active ? "default" : "secondary"}>
                    {command.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{command.command_type}</Badge>
                  <Badge className={getCategoryColor(command.category)}>
                    {command.category}
                  </Badge>
                  <Badge variant="outline">
                    Executions: {command.execution_count}
                  </Badge>
                  <Badge variant="outline">
                    Success: {command.success_rate}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant={command.is_active ? "outline" : "default"}
                >
                  {command.is_active ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Activate
                    </>
                  )}
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4" />
                  Execute
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICommandsSection;
