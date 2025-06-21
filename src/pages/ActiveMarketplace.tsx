import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import Navbar from "@/components/Navbar";
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb';
import BackButton from '@/components/navigation/BackButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Store, Shield, Star, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import DealerStoreCard from '@/components/marketplace/DealerStoreCard';
import DealerAuthModal from '@/components/auth/DealerAuthModal';
import DealerUpgradeModal from '@/components/auth/DealerUpgradeModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';

const ActiveMarketplace = () => {
  usePageView();
  const queryClient = useQueryClient();
  
  // Open Store button logic
  const [showDealerModal, setShowDealerModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();
  const navigate = useNavigate();

  const handleOpenStore = () => {
    console.log('🏪 Open Store clicked:', {
      isAuthenticated,
      authLoading,
      userRole,
      roleLoading
    });

    if (authLoading) {
      console.log('⏳ Authentication still loading, please wait...');
      return;
    }

    if (isAuthenticated) {
      if (roleLoading) {
        console.log('⏳ Role still loading, please wait...');
        return;
      }
      
      if (userRole === 'dealer' || userRole === 'admin') {
        console.log('✅ Authenticated dealer or admin, redirecting to /upload');
        navigate('/upload');
        return;
      } else {
        console.log('🔄 Authenticated non-dealer, showing upgrade modal');
        setShowUpgradeModal(true);
        return;
      }
    }
    
    console.log('🔐 Not authenticated, showing dealer auth modal');
    setShowDealerModal(true);
  };

  const isLoading = authLoading || (isAuthenticated && roleLoading);
  
  const { data: dealers, isLoading: dealersLoading, refetch: refetchDealers } = useDealerStores();

  // Force refresh on component mount to ensure clean data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['dealer-stores'] });
    queryClient.invalidateQueries({ queryKey: ['store-coin-counts'] });
  }, [queryClient]);

  // Get coin counts for stores
  const { data: storeCounts = {} } = useQuery({
    queryKey: ['store-coin-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coins')
        .select('user_id')
        .eq('authentication_status', 'verified');
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(coin => {
        counts[coin.user_id] = (counts[coin.user_id] || 0) + 1;
      });
      
      return counts;
    }
  });

  return (
    <>
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <NavigationBreadcrumb />
      
      {/* Back Button Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <BackButton to="/" label="Back to Home" />
      </div>
      
      {/* Simple Marketplace Header with Open Store Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center relative">
            {/* Open Store Button - Top Right */}
            <div className="absolute top-0 right-0">
              <Button
                onClick={handleOpenStore}
                size="sm"
                className="bg-electric-green hover:bg-electric-emerald text-white font-semibold px-4 py-2 rounded-full shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 mr-2" />
                    Open Store
                  </>
                )}
              </Button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-pink bg-clip-text text-transparent mb-3">
              Discover the Best Coin Stores
            </h1>
            <p className="text-lg text-gray-600">
              Explore authentic coins from verified dealers worldwide
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dealer Stores Section - USER STORES */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-electric-orange" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              All Stores
            </h2>
            <Badge variant="secondary" className="bg-electric-orange/10 text-electric-orange border-electric-orange/20">
              {dealers?.length || 0} Stores Online
            </Badge>
          </div>
          
          {dealersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass-card animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : dealers?.length === 0 ? (
            <div className="text-center py-16">
              <Store className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Stores Yet</h3>
              <p className="text-gray-500">
                Stores from admins and dealers will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers?.map((dealer) => {
                const profile = dealer.profiles;
                return (
                  <DealerStoreCard
                    key={dealer.id}
                    id={profile?.id || dealer.user_id}
                    avatar_url={profile?.avatar_url || dealer.logo_url}
                    username={profile?.username}
                    full_name={profile?.full_name}
                    bio={profile?.bio}
                    rating={profile?.rating}
                    location={profile?.location}
                    verified_dealer={profile?.role === 'admin'}
                    totalCoins={storeCounts[dealer.user_id] || 0}
                    storeName={dealer.name}
                    storeDescription={dealer.description}
                    storeAddress={dealer.address}
                    created_at={dealer.created_at}
                  />
                );
              }) || []}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modals */}
    <DealerAuthModal 
      isOpen={showDealerModal} 
      onClose={() => setShowDealerModal(false)} 
    />
    
    <DealerUpgradeModal 
      isOpen={showUpgradeModal} 
      onClose={() => setShowUpgradeModal(false)} 
    />
    </>
  );
};

export default ActiveMarketplace;
