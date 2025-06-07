
import React from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useCachedMarketplaceData } from '@/hooks/useCachedMarketplaceData';
import Navbar from "@/components/Navbar";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import TrendingCoins from "@/components/marketplace/TrendingCoins";
import FeaturedCoinsGrid from "@/components/marketplace/FeaturedCoinsGrid";
import Footer from "@/components/Footer";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, Shield, Star, ArrowRight, MapPin } from 'lucide-react';

const ActiveMarketplace = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const { stats } = useCachedMarketplaceData();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <MarketplaceHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Trending Section */}
        <TrendingCoins />
        
        {/* Dealer Stores Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-electric-orange" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Verified Dealer Stores
            </h2>
            {stats && (
              <Badge variant="secondary" className="bg-electric-orange/10 text-electric-orange border-electric-orange/20">
                {dealers?.length || 0} Active Dealers
              </Badge>
            )}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers?.map((dealer) => (
                <Link key={dealer.id} to={`/dealer/${dealer.id}`}>
                  <Card className="glass-card hover:shadow-lg transition-all duration-300 group cursor-pointer border border-electric-blue/10 hover:border-electric-blue/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-16 h-16 border-2 border-electric-blue/20">
                          <AvatarImage src={dealer.avatar_url} />
                          <AvatarFallback className="bg-electric-blue/10 text-electric-blue font-bold">
                            {dealer.full_name?.[0] || dealer.username?.[0] || 'D'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {dealer.full_name || dealer.username}
                            </h3>
                            {dealer.verified_dealer && (
                              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            {dealer.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{dealer.location}</span>
                              </div>
                            )}
                            {dealer.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span>{Number(dealer.rating).toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <ArrowRight className="w-5 h-5 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {dealer.bio && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {dealer.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className="bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                        >
                          <Store className="w-3 h-3 mr-1" />
                          View Store
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured Coins Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-6 text-center">
            Featured Coins
          </h2>
          <FeaturedCoinsGrid />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ActiveMarketplace;
