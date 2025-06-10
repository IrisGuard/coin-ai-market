
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Search, Play } from 'lucide-react';

interface AICommandsSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AICommandsSection: React.FC<AICommandsSectionProps> = ({ searchTerm, setSearchTerm }) => {
  const queryClient = useQueryClient();

  // Get AI Commands
  const { data: aiCommands, isLoading: commandsLoading } = useQuery({
    queryKey: ['ai-commands', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Execute AI Command
  const executeCommand = useMutation({
    mutationFn: async (commandId: string) => {
      const { data, error } = await supabase.rpc('execute_automation_rule', {
        rule_id: commandId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Command Executed",
        description: "AI command has been executed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['ai-brain-dashboard-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
          {commandsLoading ? (
            <div className="text-center py-8">Loading AI commands...</div>
          ) : aiCommands?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No AI commands found
            </div>
          ) : (
            aiCommands?.map((command) => (
              <div key={command.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{command.name}</div>
                  <div className="text-sm text-muted-foreground">{command.description}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={command.is_active ? "default" : "secondary"}>
                      {command.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{command.command_type}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => executeCommand.mutate(command.id)}
                    disabled={!command.is_active || executeCommand.isPending}
                  >
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
