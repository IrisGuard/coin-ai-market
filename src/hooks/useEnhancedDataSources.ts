
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedDataSources = () => {
  return useQuery({
    queryKey: ['enhanced-data-sources'],
    queryFn: async () => {
      // Mock data for data sources
      return [
        {
          id: '1',
          name: 'Heritage Auctions',
          source_type: 'auction',
          is_active: true,
          priority_score: 0.95,
          rate_limit_per_hour: 1000,
          reliability_score: 0.98
        },
        {
          id: '2',
          name: 'eBay API',
          source_type: 'marketplace',
          is_active: true,
          priority_score: 0.85,
          rate_limit_per_hour: 5000,
          reliability_score: 0.92
        },
        {
          id: '3',
          name: 'PCGS Price Guide',
          source_type: 'price_guide',
          is_active: true,
          priority_score: 0.90,
          rate_limit_per_hour: 500,
          reliability_score: 0.96
        }
      ];
    },
  });
};

export const useExternalPriceSources = () => {
  return useQuery({
    queryKey: ['external-price-sources'],
    queryFn: async () => {
      return [
        {
          id: '1',
          source_name: 'Heritage Auctions',
          base_url: 'https://coins.ha.com',
          source_type: 'auction',
          is_active: true,
          priority_score: 0.95,
          rate_limit_per_hour: 1000
        },
        {
          id: '2',
          source_name: 'eBay Coins',
          base_url: 'https://ebay.com/coins',
          source_type: 'marketplace',
          is_active: true,
          priority_score: 0.85,
          rate_limit_per_hour: 2000
        }
      ];
    },
  });
};

export const useDataSourceMetrics = () => {
  return useQuery({
    queryKey: ['data-source-metrics'],
    queryFn: async () => {
      return {
        total_sources: 15,
        active_sources: 12,
        avg_response_time: 245,
        success_rate: 94.5
      };
    },
  });
};

export const useAggregatedPrices = () => {
  return useQuery({
    queryKey: ['aggregated-prices'],
    queryFn: async () => {
      // Mock aggregated price data
      return [
        {
          id: '1',
          coin_identifier: '1909-S VDB Lincoln Cent',
          source_name: 'Heritage',
          price: 1250.00,
          aggregated_at: new Date().toISOString()
        },
        {
          id: '2',
          coin_identifier: '1916-D Mercury Dime',
          source_name: 'PCGS',
          price: 2850.00,
          aggregated_at: new Date().toISOString()
        }
      ];
    },
  });
};

export const useProxyRotationLogs = () => {
  return useQuery({
    queryKey: ['proxy-rotation-logs'],
    queryFn: async () => {
      // Mock proxy rotation logs
      return [
        {
          id: '1',
          proxy_used: '192.168.1.100',
          source_name: 'Heritage',
          rotated_at: new Date().toISOString(),
          success: true
        },
        {
          id: '2',
          proxy_used: '192.168.1.101',
          source_name: 'eBay',
          rotated_at: new Date().toISOString(),
          success: true
        }
      ];
    },
  });
};
