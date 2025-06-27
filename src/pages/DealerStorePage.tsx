import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Phone, Mail, Globe, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageGallery from '@/components/ui/ImageGallery';
import { Link } from 'react-router-dom';

interface Store {
  id: string;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  user_id: string;
  created_at: string;
  verified: boolean;
}

interface Coin {
  id: string;
  name: string;
  price: number;
  year: number;
  grade: string;
  country: string;
  image?: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
  rarity?: string;
  views?: number;
  featured?: boolean;
}

const DealerStorePage = () => {
  const { dealerId } = useParams<{ dealerId: string }>();

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', dealerId],
    queryFn: async (): Promise<Store | null> => {
      if (!dealerId) return null;

      // Final logic: Fetch a store if it has this ID AND (it is active OR its owner is an admin).
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', dealerId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error(`Error fetching store ${dealerId}:`, error);
        }
        return null;
      }
      
      return data as Store;
    },
    enabled: !!dealerId,
  });

  const { data: coins, isLoading: coinsLoading } = useQuery<any[]>({
    queryKey: ['store-coins', store?.id, store?.user_id],
    queryFn: async (): Promise<any[]> => {
      if (!store?.id) return [];
      
      try {
        console.log('🔍 Fetching coins for store:', store.id, 'user:', store.user_id);
        
        // Try store_id first, fallback to user_id for backward compatibility
        let { data, error } = await supabase
          .from('coins')
          .select('*')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false });

        // If no coins found with store_id, try user_id (backward compatibility)
        if (!error && (!data || data.length === 0)) {
          console.log('🔄 No coins found with store_id, trying user_id fallback');
          const fallbackResult = await supabase
            .from('coins')
            .select('*')
            .eq('user_id', store.user_id)
            .order('created_at', { ascending: false });
          
          if (!fallbackResult.error && fallbackResult.data) {
            data = fallbackResult.data;
          }
        }

        if (error) {
          console.error('Error fetching store coins:', error);
          return [];
        }

        console.log('✅ Found coins for store:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Query failed:', error);
        return [];
      }
    },
    enabled: !!store?.id
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

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏪</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
              <p className="text-gray-600 mb-6">The store you're looking for doesn't exist or has been removed.</p>
              <Link to="/marketplace">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Store Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    {store.name}
                  </h1>
                  {store.description && (
                    <p className="text-lg text-gray-600 mb-4">{store.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {store.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{store.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Established {new Date(store.created_at).getFullYear()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  {store.phone && (
                    <Button variant="outline" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call Store
                    </Button>
                  )}
                  {store.email && (
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Store
                    </Button>
                  )}
                  {store.website && (
                    <Button variant="outline" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Store Coins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Coins</h2>
              <p className="text-gray-600">
                {coinsLoading ? 'Loading coins...' : `${coins?.length || 0} coins available`}
              </p>
            </div>

            {coinsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            ) : coins && coins.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coins.map((coin, index) => {
                  const allImages = getAllImages(coin);
                  
                  return (
                    <motion.div
                      key={coin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border-0 rounded-xl">
                        {/* Enhanced Image Gallery */}
                        <div className="relative">
                          <ImageGallery 
                            images={allImages}
                            coinName={coin.name}
                            className="aspect-square"
                          />
                          
                          {/* Overlay Badges */}
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
                              {coin.views || 0}
                            </Badge>
                          </div>
                        </div>

                        {/* Card Content */}
                        <CardContent className="p-6 space-y-4">
                          {/* Coin Title & Details */}
                          <div className="space-y-2">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
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

                          {/* Price & Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Price</div>
                              <div className="text-2xl font-bold text-blue-600">
                                ${coin.price.toLocaleString()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" className="hover:bg-red-50 hover:border-red-200">
                                <Heart className="h-4 w-4 hover:fill-red-500 hover:text-red-500 transition-colors" />
                              </Button>
                              <Link to={`/coin/${coin.id}`}>
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                                  View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🪙</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No Coins Available</h3>
                <p className="text-gray-600">This store doesn't have any coins listed yet.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DealerStorePage;
