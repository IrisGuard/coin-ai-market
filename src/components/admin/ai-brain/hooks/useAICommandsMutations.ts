
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAICommandsMutations = () => {
  const queryClient = useQueryClient();

  const createCommandMutation = useMutation({
    mutationFn: async (commandData: any) => {
      console.log('🔄 Creating AI command:', commandData);
      
      const { data, error } = await supabase
        .from('ai_commands')
        .insert([commandData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating AI command:', error);
        throw error;
      }

      console.log('✅ AI command created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-commands'] });
      toast({
        title: "Success",
        description: "AI command created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Create command failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create AI command",
        variant: "destructive",
      });
    },
  });

  const updateCommandMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      console.log(`🔄 Updating AI command ${id}:`, updates);
      
      const { data, error } = await supabase
        .from('ai_commands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating AI command:', error);
        throw error;
      }

      console.log('✅ AI command updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-commands'] });
      toast({
        title: "Success",
        description: "AI command updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Update command failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update AI command",
        variant: "destructive",
      });
    },
  });

  const deleteCommandMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log(`🗑️ Deleting AI command ${id}`);
      
      const { error } = await supabase
        .from('ai_commands')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting AI command:', error);
        throw error;
      }

      console.log('✅ AI command deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-commands'] });
      toast({
        title: "Success",
        description: "AI command deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Delete command failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI command",
        variant: "destructive",
      });
    },
  });

  return {
    createCommandMutation,
    updateCommandMutation,
    deleteCommandMutation
  };
};
