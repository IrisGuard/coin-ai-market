
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Play, Pause, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const { data: commands, isLoading } = useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredCommands = commands?.filter(command =>
    command.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.command_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recognition': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'interface': return 'bg-purple-100 text-purple-800';
      case 'data': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No commands found matching your search' : 'No AI commands configured yet'}
            </div>
          ) : (
            filteredCommands.map((command) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICommandsSection;
