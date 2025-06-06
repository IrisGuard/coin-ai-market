
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useCoins } from '@/hooks/useCoins';
import CoinGrid from '@/components/CoinGrid';
import { motion } from 'framer-motion';
import { Building2, Globe, Crown, Shield, Star } from 'lucide-react';

const TenantMarketplace = () => {
  const { currentTenant, isLoading: tenantLoading } = useTenant();
  const { data: coins = [], isLoading: coinsLoading } = useCoins();

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-brand-primary mx-auto mb-6"></div>
          <h2 className="text-subsection text-brand-dark mb-4">Loading Marketplace</h2>
          <p className="text-body text-brand-medium">Preparing your coin collection...</p>
        </div>
      </div>
    );
  }

  const tenantColors = currentTenant ? {
    primary: currentTenant.primary_color,
    secondary: currentTenant.secondary_color
  } : {
    primary: '#6366F1',
    secondary: '#8B5CF6'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      <style>{`
        :root {
          --tenant-primary: ${tenantColors.primary};
          --tenant-secondary: ${tenantColors.secondary};
        }
        .tenant-primary { color: var(--tenant-primary); }
        .tenant-bg-primary { background-color: var(--tenant-primary); }
        .tenant-border-primary { border-color: var(--tenant-primary); }
        .tenant-gradient { 
          background: linear-gradient(135deg, var(--tenant-primary), var(--tenant-secondary)); 
        }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/5"></div>
        
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
                  <img 
                    src={currentTenant.logo_url} 
                    alt={`${currentTenant.name} logo`} 
                    className="w-8 h-8 mr-3 rounded-full object-cover" 
                  />
                ) : (
                  <Building2 className="w-5 h-5 mr-3 tenant-primary" />
                )}
                <span className="text-body-small font-semibold tenant-primary">{currentTenant.name}</span>
                <Crown className="w-4 h-4 ml-3 text-coin-gold" />
              </div>
              
              <h1 className="text-hero mb-6 tenant-primary">
                {currentTenant.name} Collection
              </h1>
              
              {currentTenant.description && (
                <p className="text-body-large text-brand-medium max-w-3xl mx-auto leading-relaxed mb-8">
                  {currentTenant.description}
                </p>
              )}

              <div className="flex justify-center items-center gap-8 text-body-small text-brand-medium">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-primary" />
                  <span>Trusted Dealer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-success" />
                  <span>Verified Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-coin-gold" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Default Header for global marketplace */}
          {!currentTenant && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-8">
                <Building2 className="w-5 h-5 mr-3 text-brand-primary" />
                <span className="text-body-small font-semibold text-brand-primary">CoinVision AI Marketplace</span>
                <Star className="w-4 h-4 ml-3 text-coin-gold" />
              </div>

              <h1 className="text-hero mb-6 brand-gradient-text">
                Premium Coin Collection
              </h1>
              
              <p className="text-body-large text-brand-medium max-w-3xl mx-auto leading-relaxed mb-8">
                Discover authenticated coins from verified collectors worldwide. Every coin is professionally 
                graded and authenticated for your confidence.
              </p>

              <div className="flex justify-center items-center gap-8 text-body-small text-brand-medium">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-success" />
                  <span>Authenticated Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-primary" />
                  <span>Global Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-coin-gold" />
                  <span>Premium Collection</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Coins Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {coins.length > 0 ? (
              <CoinGrid coins={coins} loading={coinsLoading} />
            ) : (
              <div className="text-center py-16">
                <div className="glass-card p-12 rounded-3xl max-w-2xl mx-auto">
                  <Building2 className="w-16 h-16 text-brand-primary mx-auto mb-6" />
                  <h3 className="text-subsection text-brand-dark mb-4">
                    {currentTenant ? `${currentTenant.name} Collection` : 'Featured Collection'}
                  </h3>
                  <p className="text-body text-brand-medium mb-6">
                    {currentTenant 
                      ? `${currentTenant.name} is curating their exclusive collection. Check back soon for premium coins!`
                      : 'New premium coins are being added to our collection. Check back soon for exceptional finds!'
                    }
                  </p>
                  <div className="flex items-center justify-center gap-2 text-body-small text-brand-medium">
                    <Star className="w-4 h-4 text-coin-gold" />
                    <span>Premium coins coming soon</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TenantMarketplace;
