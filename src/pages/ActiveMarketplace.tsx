
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import Navbar from "@/components/Navbar";
import NavigationBreadcrumb from '@/components/navigation/NavigationBreadcrumb';
import BackButton from '@/components/navigation/BackButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, Shield, Star, ArrowRight, MapPin, Plus } from 'lucide-react';
import DealerSignupForm from '@/components/auth/DealerSignupForm';
import DealerStoreCard from '@/components/marketplace/DealerStoreCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ActiveMarketplace = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const [isDealerSignupOpen, setIsDealerSignupOpen] = useState(false);

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <NavigationBreadcrumb />
      
      {/* Back Button and Open Store Button Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-between items-center">
          <BackButton to="/" label="Back to Home" />
          <Button 
            onClick={() => setIsDealerSignupOpen(true)}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium border-2 border-green-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Open Store
          </Button>
        </div>
      </div>
      
      {/* Simple Marketplace Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
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
              User Stores
            </h2>
            <Badge variant="secondary" className="bg-electric-orange/10 text-electric-orange border-electric-orange/20">
              {dealers?.length || 0} Active Stores
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
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No User Stores Yet</h3>
              <p className="text-gray-500">
                User stores will appear here when dealers join and get verified.
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
                    verified_dealer={profile?.verified_dealer}
                    totalCoins={storeCounts[dealer.user_id] || 0}
                    storeName={dealer.name}
                    storeDescription={dealer.description}
                    created_at={dealer.created_at}
                  />
                );
              }) || []}
            </div>
          )}
        </div>
      </div>

      {/* Dealer Signup Modal */}
      <DealerSignupForm 
        isOpen={isDealerSignupOpen}
        onClose={() => setIsDealerSignupOpen(false)}
      />
    </div>
  );
};

export default ActiveMarketplace;
