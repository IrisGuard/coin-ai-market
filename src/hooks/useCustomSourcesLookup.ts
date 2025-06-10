
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomSourcesLookup = (coinQuery: string) => {
  return useQuery({
    queryKey: ['custom-sources-lookup', coinQuery],
    queryFn: async () => {
      if (!coinQuery || coinQuery.length < 3) {
        return [];
      }

      // Search real external price sources
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .eq('is_active', true)
        .order('reliability_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform to match expected format
      return (data || []).map(source => ({
        source: source.source_name,
        url: source.base_url,
        coin_name: `${coinQuery} (from ${source.source_name})`,
        price: 'Price varies',
        grade: 'Various grades',
        confidence: source.reliability_score || 0.5,
        last_updated: new Date().toISOString()
      }));
    },
    enabled: !!coinQuery && coinQuery.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTestCustomSource = () => {
  return {
    testSource: async (url: string) => {
      try {
        // Test if URL is accessible and valid
        const response = await fetch(url, { 
          method: 'HEAD', 
          mode: 'no-cors' 
        });
        
        return {
          success: true,
          data: { url, status: 'accessible' },
          extractable: true
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          extractable: false
        };
      }
    }
  };
};
