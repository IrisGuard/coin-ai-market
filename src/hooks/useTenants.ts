
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MarketplaceTenant {
  id: string;
  tenant_slug: string;
  name: string;
  description?: string;
  owner_id: string;
  subdomain: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomDomain {
  id: string;
  tenant_id: string;
  domain: string;
  is_verified: boolean;
  ssl_status: string;
  verification_code?: string;
  created_at: string;
  verified_at?: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  subscription_type: string;
  annual_fee: number;
  currency: string;
  status: string;
  expires_at?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MarketplaceTenant[];
    },
  });
};

export const useTenant = (tenantId: string) => {
  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .select(`
          *,
          custom_domains(*),
          tenant_subscriptions(*),
          tenant_themes(*)
        `)
        .eq('id', tenantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantData: Partial<MarketplaceTenant>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('marketplace_tenants')
        .insert([{ 
          ...tenantData, 
          owner_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Marketplace Created",
        description: "Your marketplace has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddCustomDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tenantId, domain }: { tenantId: string; domain: string }) => {
      const verification_code = Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('custom_domains')
        .insert([{ 
          tenant_id: tenantId,
          domain,
          verification_code
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Domain Added",
        description: "Custom domain has been added. Please verify it to activate.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
