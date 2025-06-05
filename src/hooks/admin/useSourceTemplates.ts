
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSourceTemplates = () => {
  return useQuery({
    queryKey: ['source-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateSourceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: {
      name: string;
      description?: string;
      supported_features?: string[];
      default_config?: Record<string, any>;
      template_config?: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from('source_templates')
        .insert(templateData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-templates'] });
      toast({
        title: "Template Created",
        description: "Source template has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSourceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase
        .from('source_templates')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-templates'] });
      toast({
        title: "Template Updated",
        description: "Source template has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};
