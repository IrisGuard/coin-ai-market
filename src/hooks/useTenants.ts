import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MarketplaceTenant } from '@/types/tenant';

interface TenantSettings {
  theme?: Record<string, unknown>;
  features?: string[];
  branding?: Record<string, unknown>;
}

interface TenantData {
  id: string;
  name: string;
  domain: string;
  settings: unknown;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  description?: string;
  logo_url?: string;
  theme_colors?: Record<string, string>;
  contact_email?: string;
  status?: 'active' | 'inactive' | 'suspended';
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
      return data || [];
    }
  });
};

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantData: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .insert(tenantData as never)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error creating tenant:', errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['tenant', data.id] });
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error updating tenant:', errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
