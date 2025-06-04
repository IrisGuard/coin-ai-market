import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useCoinDataAggregation = () => {
  return useMutation({
    mutationFn: async (coinIdentifier: string) => {
      const { data, error } = await supabase.functions.invoke('coin-data-aggregator', {
        body: { 
          coin_identifier: coinIdentifier,
          include_sources: ['static_db', 'coinapi', 'numista', 'scraping_cache']
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Data Aggregated",
        description: `Successfully gathered data from ${data.sources_used.length} sources.`,
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Aggregation Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    },
  });
};
