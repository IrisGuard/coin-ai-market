
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TenantSettings {
  [key: string]: any;
  theme?: Record<string, any>;
  branding?: Record<string, any>;
  features?: string[];
  customization?: Record<string, any>;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  settings: TenantSettings;
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
      return data as Tenant[];
    },
  });
};

export const useTenantByDomain = (domain: string) => {
  return useQuery({
    queryKey: ['tenant', domain],
    queryFn: async () => {
      if (!domain) return null;
      
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .select('*')
        .eq('domain', domain)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as Tenant | null;
    },
    enabled: !!domain,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tenantData: {
      name: string;
      domain: string;
      settings?: TenantSettings;
    }) => {
      const { data, error } = await supabase
        .from('marketplace_tenants')
        .insert({
          name: tenantData.name,
          domain: tenantData.domain,
          settings: tenantData.settings || {} as any
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Tenant Created",
        description: "New marketplace tenant has been created successfully.",
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

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Omit<Tenant, 'id' | 'created_at' | 'updated_at'>>
    }) => {
      const updateData: any = {
        name: updates.name,
        domain: updates.domain,
        is_active: updates.is_active,
      };
      
      if (updates.settings) {
        updateData.settings = updates.settings as any;
      }

      const { data, error } = await supabase
        .from('marketplace_tenants')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', data.domain] });
      toast({
        title: "Tenant Updated",
        description: "Marketplace tenant has been updated successfully.",
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

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketplace_tenants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Tenant Deleted",
        description: "Marketplace tenant has been deleted successfully.",
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

export const useAddCustomDomain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tenantId, domain }: { tenantId: string; domain: string }) => {
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
        title: "Custom Domain Added",
        description: "Custom domain has been added successfully.",
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
