
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Updated interface to match actual database structure
export interface MarketplaceTenant {
  id: string;
  name: string;
  domain: string;
  settings: any;
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
        .select('*')
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
    mutationFn: async (tenantData: {
      name: string;
      domain: string;
      settings?: any;
    }) => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .insert([tenantData])
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
      // For now, just update the tenant's domain since we don't have custom_domains table
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .update({ domain })
        .eq('id', tenantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Domain Updated",
        description: "Domain has been updated successfully.",
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
