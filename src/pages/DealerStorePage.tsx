
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageView } from '@/hooks/usePageView';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useDealerCoins } from '@/hooks/useDealerCoins';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedCoinCard from "@/components/OptimizedCoinCard";
import { Loader2, ArrowLeft, Star, MapPin, Eye, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const DealerStorePage = () => {
  const { id } = useParams<{ id: string }>();
  usePageView();
  usePerformanceMonitoring('DealerStorePage');
  
  const { data: stores = [], isLoading: storesLoading } = useDealerStores();
  const { data: coins = [], isLoading: coinsLoading } = useDealerCoins(id || '');

  // Find the specific dealer
  const dealer = stores.find(store => store.id === id);

  // Generate star rating display
  const renderStars = (rating: number = 5.0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-electric-orange text-electric-orange" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 fill-electric-orange/50 text-electric-orange" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    
    return stars;
  };

  if (storesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
            <span className="text-electric-blue">Loading store...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-electric-blue mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-6">The store you're looking for doesn't exist.</p>
          <Link 
            to="/marketplace" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-orange to-electric-red text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = dealer.full_name || dealer.username || 'Unnamed Store';
  const displayRating = Math.min(Math.max(dealer.rating || 5.0, 0), 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/marketplace" 
            className="inline-flex items-center gap-2 text-electric-blue hover:text-electric-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>

        {/* Store Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Store Avatar */}
            <div className="relative">
              <img
                src={dealer.avatar_url || '/placeholder.svg'}
                alt={`${displayName} avatar`}
                className="w-24 h-24 rounded-full object-cover border-4 border-electric-blue/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {dealer.verified_dealer && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-electric-green rounded-full flex items-center justify-center border-4 border-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-electric-blue mb-2">
                    {displayName}
                  </h1>
                  {dealer.verified_dealer && (
                    <span className="inline-flex items-center gap-1 text-sm text-electric-green font-medium mb-2">
                      <Shield className="w-4 h-4" />
                      Verified Dealer
                    </span>
                  )}
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(displayRating)}
                    </div>
                    <span className="text-lg font-medium text-electric-purple">
                      {displayRating.toFixed(1)}
                    </span>
                  </div>

                  {/* Location */}
                  {dealer.location && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{dealer.location}</span>
                    </div>
                  )}
                </div>

                {/* Store Stats */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{coins.length} coins available</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {dealer.bio && (
                <div className="mt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {dealer.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Store Coins Section */}
        <div>
          <h2 className="text-2xl font-bold text-electric-blue mb-6">
            Available Coins
          </h2>

          {coinsLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
                <span className="text-electric-blue">Loading coins...</span>
              </div>
            </div>
          ) : coins.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-electric-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-4xl">🪙</div>
                </div>
                <h3 className="text-xl font-semibold text-electric-blue mb-2">
                  No coins available
                </h3>
                <p className="text-gray-600">
                  This store doesn't have any coins listed at the moment.
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {coins.map((coin, index) => (
                <div key={coin.id} className="w-full">
                  <OptimizedCoinCard coin={coin} index={index} priority={index < 6} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DealerStorePage;
