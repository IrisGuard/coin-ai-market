
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { safeQuery } from '@/utils/supabaseSecurityHelpers';

// RLS-compatible hooks that gracefully handle security policy violations

export const usePublicMarketplaceStats = () => {
  return useQuery({
    queryKey: ['public-marketplace-stats'],
    queryFn: async () => {
      const result = await safeQuery(async () => {
        const { data, error } = await supabase
          .from('marketplace_stats')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        return { data: data?.[0] || null, error };
      });

      return result.data || {
        registered_users: 0,
        listed_coins: 0,
        active_auctions: 0,
        total_volume: 0,
        weekly_transactions: 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

export const usePublicApiKeyCategories = () => {
  return useQuery({
    queryKey: ['public-api-key-categories'],
    queryFn: async () => {
      const result = await safeQuery(async () => {
        const { data, error } = await supabase
          .from('api_key_categories')
          .select('*')
          .order('name', { ascending: true });
        
        return { data: data || [], error };
      });

      return result.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
};

export const usePublicSourceCategories = () => {
  return useQuery({
    queryKey: ['public-source-categories'],
    queryFn: async () => {
      const result = await safeQuery(async () => {
        const { data, error } = await supabase
          .from('source_categories')
          .select('*')
          .order('name', { ascending: true });
        
        return { data: data || [], error };
      });

      return result.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2
  });
};

export const usePublicStaticCoinsDB = () => {
  return useQuery({
    queryKey: ['public-static-coins-db'],
    queryFn: async () => {
      const result = await safeQuery(async () => {
        const { data, error } = await supabase
          .from('static_coins_db')
          .select('*')
          .order('name', { ascending: true })
          .limit(100);
        
        return { data: data || [], error };
      });

      return result.data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2
  });
};
