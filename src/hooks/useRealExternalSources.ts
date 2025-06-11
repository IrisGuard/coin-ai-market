
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealExternalSources = () => {
  return useQuery({
    queryKey: ['real-external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // If no sources exist, return production-ready default sources
      if (!data || data.length === 0) {
        return [
          {
            id: 'heritage-auctions',
            source_name: 'Heritage Auctions',
            base_url: 'https://coins.ha.com',
            source_type: 'auction_house',
            is_active: true,
            reliability_score: 0.95,
            rate_limit_per_hour: 60,
            requires_proxy: false,
            priority_score: 90,
            supported_currencies: ['USD'],
            market_focus: ['rare_coins', 'certified_coins', 'auction_results']
          },
          {
            id: 'pcgs-coinfacts',
            source_name: 'PCGS CoinFacts',
            base_url: 'https://www.pcgs.com',
            source_type: 'grading_service',
            is_active: true,
            reliability_score: 0.98,
            rate_limit_per_hour: 30,
            requires_proxy: false,
            priority_score: 95,
            supported_currencies: ['USD'],
            market_focus: ['population_data', 'grade_verification', 'market_values']
          },
          {
            id: 'ngc-price-guide',
            source_name: 'NGC Price Guide',
            base_url: 'https://www.ngccoin.com',
            source_type: 'grading_service',
            is_active: true,
            reliability_score: 0.96,
            rate_limit_per_hour: 30,
            requires_proxy: false,
            priority_score: 90,
            supported_currencies: ['USD'],
            market_focus: ['price_guide', 'population_data', 'authentication']
          }
        ];
      }
      
      return data;
    },
  });
};
