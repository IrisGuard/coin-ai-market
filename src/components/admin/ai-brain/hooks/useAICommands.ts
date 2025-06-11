
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AICommand, NewCommandForm } from '../types';

export const useAICommands = () => {
  const queryClient = useQueryClient();

  const { data: commands = [], isLoading, error, refetch } = useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      console.log('Fetching AI commands...');
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('AI Commands fetched successfully:', data?.length || 0, 'commands');
      console.log('Commands data:', data);
      return (data as AICommand[]) || [];
    },
    retry: 3,
    retryDelay: 1000,
  });

  const createCommandMutation = useMutation({
    mutationFn: async (commandData: NewCommandForm) => {
      const { data, error } = await supabase
        .from('ai_commands')
        .insert([{
          ...commandData,
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Created",
        description: "AI command has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateCommandMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AICommand> }) => {
      const { data, error } = await supabase
        .from('ai_commands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Updated",
        description: "AI command has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteCommandMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_commands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Deleted",
        description: "AI command has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData = {} }: { commandId: string; inputData?: any }) => {
      const { data, error } = await supabase.rpc('execute_ai_command', {
        p_command_id: commandId,
        p_input_data: inputData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Executed",
        description: "AI command has been executed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Execution Failed",
        description: `Failed to execute command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    commands,
    isLoading,
    error,
    refetch,
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation,
    executeCommandMutation,
    queryClient
  };
};
