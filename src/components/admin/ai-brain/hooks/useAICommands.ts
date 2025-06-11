
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AICommand, NewCommandForm } from '../types';
import { useEffect } from 'react';

export const useAICommands = () => {
  const queryClient = useQueryClient();

  const { data: commands = [], isLoading, error, refetch } = useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      console.log('🔍 Fetching AI commands with admin verification...');
      
      // First verify admin access
      const { data: adminCheck, error: adminError } = await supabase.rpc('verify_admin_access_secure');
      
      if (adminError) {
        console.error('❌ Admin verification failed:', adminError);
        throw new Error('Admin access required');
      }
      
      if (!adminCheck) {
        console.error('❌ User is not admin');
        throw new Error('Admin privileges required');
      }
      
      console.log('✅ Admin access verified, fetching commands...');
      
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('✅ AI Commands fetched successfully:', data?.length || 0, 'commands');
      console.log('📊 Commands data:', data);
      return (data as AICommand[]) || [];
    },
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.message?.includes('Admin') || 
          error?.message?.includes('required') ||
          error?.message?.includes('privileges')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });

  // Set up real-time subscription for AI commands
  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for AI commands...');
    
    const channel = supabase
      .channel('ai-commands-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_commands'
        },
        (payload) => {
          console.log('🔄 Real-time AI command change:', payload);
          queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🛑 Cleaning up AI commands subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createCommandMutation = useMutation({
    mutationFn: async (commandData: NewCommandForm) => {
      console.log('➕ Creating new AI command:', commandData);
      
      const { data, error } = await supabase
        .from('ai_commands')
        .insert([{
          ...commandData,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to create command:', error);
        throw error;
      }
      
      console.log('✅ Command created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Created",
        description: `AI command "${data.name}" has been successfully created.`,
      });
    },
    onError: (error: any) => {
      console.error('❌ Create command error:', error);
      toast({
        title: "Error",
        description: `Failed to create command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateCommandMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AICommand> }) => {
      console.log('✏️ Updating AI command:', id, updates);
      
      const { data, error } = await supabase
        .from('ai_commands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to update command:', error);
        throw error;
      }
      
      console.log('✅ Command updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Updated",
        description: `AI command "${data.name}" has been successfully updated.`,
      });
    },
    onError: (error: any) => {
      console.error('❌ Update command error:', error);
      toast({
        title: "Error",
        description: `Failed to update command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteCommandMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting AI command:', id);
      
      const { error } = await supabase
        .from('ai_commands')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Failed to delete command:', error);
        throw error;
      }
      
      console.log('✅ Command deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Deleted",
        description: "AI command has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Delete command error:', error);
      toast({
        title: "Error",
        description: `Failed to delete command: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const executeCommandMutation = useMutation({
    mutationFn: async ({ commandId, inputData = {} }: { commandId: string; inputData?: any }) => {
      console.log('▶️ Executing AI command:', commandId, inputData);
      
      const { data, error } = await supabase.rpc('execute_ai_command', {
        p_command_id: commandId,
        p_input_data: inputData
      });
      
      if (error) {
        console.error('❌ Failed to execute command:', error);
        throw error;
      }
      
      console.log('✅ Command executed successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Executed",
        description: "AI command has been executed successfully.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Execute command error:', error);
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
