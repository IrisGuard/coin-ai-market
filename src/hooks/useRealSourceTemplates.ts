
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useRealSourceTemplates = () => {
  return useQuery({
    queryKey: ['real-source-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // If no templates exist, return some default production templates
      if (!data || data.length === 0) {
        return [
          {
            id: 'default-1',
            name: 'Heritage Auctions Integration',
            description: 'Professional auction house data integration',
            supported_features: ['real-time-pricing', 'historical-data', 'authentication-verification'],
            default_config: { 
              rate_limit: 30, 
              proxy_required: false,
              data_quality: 'premium',
              update_frequency: 'hourly'
            },
            created_at: new Date().toISOString()
          },
          {
            id: 'default-2',
            name: 'PCGS Registry Template',
            description: 'PCGS population and registry data',
            supported_features: ['population-data', 'grade-verification', 'market-analysis'],
            default_config: { 
              rate_limit: 60, 
              proxy_required: true,
              data_quality: 'certified',
              update_frequency: 'daily'
            },
            created_at: new Date().toISOString()
          }
        ];
      }
      
      return data;
    },
  });
};

export const useCreateRealSourceTemplate = () => {
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
      queryClient.invalidateQueries({ queryKey: ['real-source-templates'] });
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
