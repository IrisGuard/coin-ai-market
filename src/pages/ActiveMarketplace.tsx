
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

const ActiveMarketplace = () => {
  usePageView();
  
  const { data: dealers, isLoading: dealersLoading } = useDealerStores();
  const [isDealerSignupOpen, setIsDealerSignupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <NavigationBreadcrumb />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <BackButton to="/" label="Back to Home" />
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-electric-orange" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
                User Stores
              </h2>
              <Badge variant="secondary" className="bg-electric-orange/10 text-electric-orange border-electric-orange/20">
                {dealers?.length || 0} Active Stores
              </Badge>
            </div>
            
            {/* Open Your Store Button - Moved to header */}
            <Button 
              onClick={() => setIsDealerSignupOpen(true)}
              size="sm"
              className="bg-gradient-to-r from-electric-green to-electric-emerald hover:from-electric-emerald hover:to-electric-cyan text-white px-4 py-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Open Your Store
            </Button>
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
              )) || []}
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
