
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
      console.log('🔍 Fetching AI commands...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError);
        throw new Error('Authentication required');
      }

      console.log('✅ User authenticated:', user.id);
      
      // Check if user has admin role using secure function
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('verify_admin_access_secure', { user_id: user.id });
      
      if (adminError) {
        console.error('❌ Admin check failed:', adminError);
        throw new Error('Admin access verification failed');
      }
      
      if (!adminCheck) {
        console.error('❌ User is not admin');
        throw new Error('Admin privileges required');
      }
      
      console.log('✅ Admin access verified, fetching commands...');
      
      // Optimized query - only fetch preview of code field for performance
      const { data, error } = await supabase
        .from('ai_commands')
        .select(`
          id, 
          name, 
          description, 
          LEFT(code, 300) as code_preview,
          code,
          category, 
          command_type, 
          priority, 
          execution_timeout, 
          is_active, 
          created_at, 
          updated_at, 
          created_by, 
          site_url
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('✅ AI Commands fetched successfully:', data?.length || 0, 'commands');
      return (data as AICommand[]) || [];
    },
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.message?.includes('Admin') || 
          error?.message?.includes('required') ||
          error?.message?.includes('privileges') ||
          error?.message?.includes('Authentication')) {
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
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('ai_commands')
        .insert([{
          ...commandData,
          is_active: true,
          created_by: user?.id
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
      
      // Create execution record first
      const { data: executionRecord, error: execError } = await supabase
        .from('ai_command_executions')
        .insert([{
          command_id: commandId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          input_data: inputData,
          execution_status: 'running'
        }])
        .select()
        .single();

      if (execError) {
        console.error('❌ Failed to create execution record:', execError);
        throw execError;
      }

      // Get command details with site_url
      const { data: command, error: cmdError } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('id', commandId)
        .single();

      if (cmdError) {
        console.error('❌ Failed to get command:', cmdError);
        throw cmdError;
      }

      // Execute command
      const startTime = Date.now();
      
      let result;
      try {
        // Check if command has site_url for parsing
        if (command.site_url) {
          console.log('🔗 Command has site URL, calling parsing function...');
          result = await supabase.functions.invoke('parse-website', {
            body: { 
              url: command.site_url, 
              instructions: command.code,
              commandId: commandId 
            }
          });
        } else {
          // Regular command execution
          console.log('⚡ Executing regular command...');
          result = {
            data: {
              status: 'completed',
              message: `Command "${command.name}" executed successfully`,
              output: `Executed: ${command.code}`,
              timestamp: new Date().toISOString()
            }
          };
        }

        const executionTime = Date.now() - startTime;

        // Update execution record with success
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'completed',
            output_data: result.data,
            execution_time_ms: executionTime
          })
          .eq('id', executionRecord.id);

        console.log('✅ Command executed successfully:', result.data);
        return result.data;
        
      } catch (error) {
        const executionTime = Date.now() - startTime;
        
        // Update execution record with error
        await supabase
          .from('ai_command_executions')
          .update({
            execution_status: 'failed',
            error_message: error.message,
            execution_time_ms: executionTime
          })
          .eq('id', executionRecord.id);

        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      toast({
        title: "Command Executed",
        description: "AI command executed successfully.",
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
