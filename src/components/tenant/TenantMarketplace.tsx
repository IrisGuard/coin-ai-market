
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useCoins } from '@/hooks/useCoins';
import CoinGrid from '@/components/CoinGrid';
import { motion } from 'framer-motion';
import { Building2, Globe, Crown } from 'lucide-react';

const TenantMarketplace = () => {
  const { currentTenant, isLoading: tenantLoading } = useTenant();
  const { data: coins = [], isLoading: coinsLoading } = useCoins();

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  const tenantColors = currentTenant ? {
    primary: currentTenant.primary_color,
    secondary: currentTenant.secondary_color
  } : {
    primary: '#1F2937',
    secondary: '#3B82F6'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
      <style>{`
        :root {
          --tenant-primary: ${tenantColors.primary};
          --tenant-secondary: ${tenantColors.secondary};
        }
        .tenant-primary { color: var(--tenant-primary); }
        .tenant-bg-primary { background-color: var(--tenant-primary); }
        .tenant-border-primary { border-color: var(--tenant-primary); }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          {/* Tenant Header */}
          {currentTenant && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border tenant-border-primary mb-6">
                {currentTenant.logo_url ? (
                  <img src={currentTenant.logo_url} alt={currentTenant.name} className="w-8 h-8 mr-3 rounded-full" />
                ) : (
                  <Building2 className="w-5 h-5 mr-3 tenant-primary" />
                )}
                <span className="text-sm font-semibold tenant-primary">{currentTenant.name}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tenant-primary">
                {currentTenant.name}
              </h1>
              
              {currentTenant.description && (
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed mb-8">
                  {currentTenant.description}
                </p>
              )}

              <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{currentTenant.domain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>Verified Marketplace</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Default Header for non-tenant */}
          {!currentTenant && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="section-title mb-6">
                Coin Marketplace
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
                Discover authenticated coins from collectors worldwide
              </p>
            </motion.div>
          )}

          {/* Coins Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CoinGrid coins={coins} loading={coinsLoading} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TenantMarketplace;
