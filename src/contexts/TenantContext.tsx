import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceTenant } from '@/types/tenant';

interface TenantContextType {
  currentTenant: MarketplaceTenant | null;
  setCurrentTenant: (tenant: MarketplaceTenant | null) => void;
  tenantId: string | null;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<MarketplaceTenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectTenant = async () => {
      const hostname = window.location.hostname;
      
      // Skip tenant detection for localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Get default tenant for localhost
        try {
          const { data: tenantData, error } = await supabase
            .from('marketplace_tenants')
            .select('*')
            .eq('domain', 'localhost')
            .single();

          if (!error && tenantData) {
            setCurrentTenant(tenantData);
          }
        } catch (error) {
          console.error('Error getting default tenant:', error);
        }
        setIsLoading(false);
        return;
      }

      try {
        // Use the RPC function to get tenant by domain
        const { data: tenantId, error: rpcError } = await supabase
          .rpc('get_tenant_from_domain', {
            domain_name: hostname
          });

        if (!rpcError && tenantId) {
          // Set tenant context
          await supabase.rpc('set_tenant_context', { tenant_uuid: tenantId });
          
          // Fetch full tenant data
          const { data: tenantData, error: tenantError } = await supabase
            .from('marketplace_tenants')
            .select('*')
            .eq('id', tenantId)
            .single();

          if (!tenantError && tenantData) {
            setCurrentTenant(tenantData);
          }
        }
      } catch (error) {
        console.error('Error detecting tenant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectTenant();
  }, []);

  const value = {
    currentTenant,
    setCurrentTenant,
    tenantId: currentTenant?.id || null,
    isLoading,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
