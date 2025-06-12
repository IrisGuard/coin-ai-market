
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Store, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import DealerAuthModal from '@/components/auth/DealerAuthModal';

const EnhancedMarketplaceHeader = () => {
  const [showDealerModal, setShowDealerModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();
  const navigate = useNavigate();

  const handleOpenStore = () => {
    if (isAuthenticated) {
      if (roleLoading) {
        // Wait for role to load
        return;
      }
      
      if (userRole === 'dealer') {
        // Already a dealer, redirect to upload panel
        navigate('/upload');
        return;
      } else if (userRole === 'buyer') {
        // Show access denied for buyers
        alert('Access denied. This section is for dealers only.');
        return;
      }
    }
    
    // Not authenticated or no role - show auth modal
    setShowDealerModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-electric-blue via-cyber-purple to-electric-emerald py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Global Coin Marketplace
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover rare coins from verified dealers worldwide. Advanced AI authentication ensures every purchase is legitimate.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-electric-blue hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Coins
              </Button>
              
              <Button
                onClick={handleOpenStore}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-electric-blue font-semibold px-8 py-3 rounded-full"
                disabled={roleLoading}
              >
                <Store className="w-5 h-5 mr-2" />
                {roleLoading ? 'Loading...' : 'Open Store'}
              </Button>
            </div>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 mr-2" />
                <span className="text-3xl font-bold">50K+</span>
              </div>
              <p className="text-white/80">Verified Dealers</p>
            </div>
            
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 mr-2" />
                <span className="text-3xl font-bold">$2M+</span>
              </div>
              <p className="text-white/80">Daily Trading Volume</p>
            </div>
            
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-2">
                <Store className="w-8 h-8 mr-2" />
                <span className="text-3xl font-bold">99.9%</span>
              </div>
              <p className="text-white/80">Authentication Accuracy</p>
            </div>
          </motion.div>
        </div>
      </div>

      <DealerAuthModal 
        isOpen={showDealerModal} 
        onClose={() => setShowDealerModal(false)} 
      />
    </>
  );
};

export default EnhancedMarketplaceHeader;
