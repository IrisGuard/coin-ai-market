
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Star, Store, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageGallery from '@/components/ui/ImageGallery';

interface Coin {
  id: string;
  name: string;
  year: number;
  country: string;
  grade: string;
  price: number;
  image: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
  user_id: string;
  rarity?: string;
  featured?: boolean;
  views?: number;
}

interface Store {
  id: string;
  name: string;
  user_id: string;
}

const FeaturedCoinsGrid = () => {
  const { data: featuredCoins, isLoading, error } = useQuery({
    queryKey: ['featuredCoins'],
    queryFn: async (): Promise<Coin[]> => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('featured', true)
        .limit(8);

      if (error) {
        return [];
      }

      return (data || []).map(coin => ({
        id: coin.id,
        name: coin.name,
        year: coin.year,
        country: coin.country || '',
        grade: coin.grade,
        price: coin.price,
        image: coin.image,
        images: coin.images,
        obverse_image: coin.obverse_image,
        reverse_image: coin.reverse_image,
        user_id: coin.user_id,
        rarity: coin.rarity,
        featured: coin.featured,
        views: coin.views || 0
      }));
    }
  });

  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: async (): Promise<Store[]> => {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, user_id');

      if (error) {
        return [];
      }

      return data || [];
    }
  });

  // Helper function to get all available images for a coin
  const getAllImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      allImages.push(...coin.images.filter(img => img && !img.startsWith('blob:')));
    } else {
      if (coin.image && !coin.image.startsWith('blob:')) allImages.push(coin.image);
      if (coin.obverse_image && !coin.obverse_image.startsWith('blob:')) allImages.push(coin.obverse_image);
      if (coin.reverse_image && !coin.reverse_image.startsWith('blob:')) allImages.push(coin.reverse_image);
    }
    
    return allImages;
  };

  // Helper function to get store for a coin
  const getStoreForCoin = (coin: Coin) => {
    return stores?.find(store => store.user_id === coin.user_id);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Key Date': return 'bg-red-100 text-red-800 border-red-200';
      case 'Ultra Rare': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Rare': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Scarce': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Common': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-t-xl"></div>
            <div className="p-6 space-y-3 bg-white rounded-b-xl">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !featuredCoins?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🪙</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">No Featured Coins Available</h3>
        <p className="text-gray-600">Check back soon for featured coins from our verified dealers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modern Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredCoins.map((coin, index) => {
          const allImages = getAllImages(coin);
          const store = getStoreForCoin(coin);
          
          return (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border-0 rounded-xl">
                {/* Enhanced Image Gallery */}
                <div className="relative">
                  <ImageGallery 
                    images={allImages}
                    coinName={coin.name}
                    className="aspect-square"
                  />
                  
                  {/* Premium Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {coin.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 shadow-lg">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    {coin.rarity && (
                      <Badge variant="outline" className={`text-xs ${getRarityColor(coin.rarity)} backdrop-blur-sm`}>
                        {coin.rarity}
                      </Badge>
                    )}
                  </div>

                  {/* Views Counter */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {coin.views}
                    </Badge>
                  </div>

                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Enhanced Card Content */}
                <CardContent className="p-6 space-y-4">
                  {/* Coin Title & Year */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {coin.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">{coin.year}</span>
                      <span>•</span>
                      <span>{coin.grade}</span>
                      <span>•</span>
                      <span>{coin.country}</span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Price</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${coin.price.toLocaleString()}
                      </div>
                    </div>
                    <Button variant="outline" size="icon" className="hover:bg-red-50 hover:border-red-200">
                      <Heart className="h-4 w-4 hover:fill-red-500 hover:text-red-500 transition-colors" />
                    </Button>
                  </div>

                  {/* Store Information & Navigation */}
                  {store && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Store className="h-4 w-4" />
                          <span>Sold by {store.name}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link 
                      to={`/coin/${coin.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    
                    {store && (
                      <Link to={`/store/${store.id}`}>
                        <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700">
                          <Store className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-8"
      >
        <Link to="/marketplace">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Explore All Coins
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default FeaturedCoinsGrid;
