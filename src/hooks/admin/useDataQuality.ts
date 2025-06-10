
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDataQualityReports = () => {
  return useQuery({
    queryKey: ['data-quality-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_quality_reports')
        .select(`
          *,
          external_price_sources(source_name, source_type)
        `)
        .order('report_date', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePriceSourceTemplatesEnhanced = () => {
  return useQuery({
    queryKey: ['price-source-templates-enhanced'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_source_templates_enhanced')
        .select('*')
        .eq('is_active', true)
        .order('success_rate', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateDataQualityReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reportData: {
      source_id: string;
      quality_score: number;
      completeness_score?: number;
      accuracy_score?: number;
      timeliness_score?: number;
      consistency_score?: number;
      quality_issues?: any;
      recommendations?: any;
    }) => {
      const { data, error } = await supabase
        .from('data_quality_reports')
        .insert(reportData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-quality-reports'] });
      toast({
        title: "Quality Report Created",
        description: "Data quality report has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create quality report: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCreatePriceSourceTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (templateData: {
      template_name: string;
      source_type: string;
      extraction_rules: any;
      validation_rules?: any;
      transformation_rules?: any;
      error_handling?: any;
    }) => {
      const { data, error } = await supabase
        .from('price_source_templates_enhanced')
        .insert(templateData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-source-templates-enhanced'] });
      toast({
        title: "Template Created",
        description: "Price source template has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create template: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
