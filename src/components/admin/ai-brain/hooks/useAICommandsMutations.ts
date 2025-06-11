
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AICommand, NewCommandForm } from '../types';

export const useAICommandsMutations = () => {
  const queryClient = useQueryClient();

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

  return {
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation
  };
};
