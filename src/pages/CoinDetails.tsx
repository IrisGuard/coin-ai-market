
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCoin } from '@/hooks/useCoins';
import { useCoinBids } from '@/hooks/useBids';
import Navbar from '@/components/Navbar';
import CoinBidForm from '@/components/coin-details/CoinBidForm';
import CoinViewer3D from '@/components/coin-details/CoinViewer3D';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Eye, Heart, Star, User, Verified, Clock, TrendingUp, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: coin, isLoading } = useCoin(id!);
  const { data: bids = [] } = useCoinBids(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
        <Navbar />
        <div className="relative overflow-hidden">
          <div className="mesh-bg"></div>
          <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="loading-skeleton h-96 rounded-3xl"></div>
                <div className="loading-skeleton h-48 rounded-3xl"></div>
              </div>
              <div className="space-y-6">
                <div className="loading-skeleton h-16 rounded-2xl"></div>
                <div className="loading-skeleton h-32 rounded-2xl"></div>
                <div className="loading-skeleton h-64 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
        <Navbar />
        <div className="relative overflow-hidden">
          <div className="mesh-bg"></div>
          <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
            <div className="text-center py-20">
              <div className="glass-card p-12 rounded-3xl max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-brand-accent to-electric-pink rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl">❌</span>
                </div>
                <h1 className="text-3xl font-bold gradient-text mb-4">Coin Not Found</h1>
                <p className="text-gray-600">The coin you're looking for doesn't exist or has been removed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : coin.price;
  const isAuction = coin.is_auction;
  const timeLeft = coin.auction_end ? formatDistanceToNow(new Date(coin.auction_end), { addSuffix: true }) : null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Ultra Rare': return 'from-brand-accent to-electric-pink';
      case 'Rare': return 'from-brand-primary to-electric-purple';
      case 'Uncommon': return 'from-electric-blue to-electric-cyan';
      case 'Common': return 'from-electric-emerald to-electric-teal';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Image Section */}
            <div className="space-y-6">
              <div className="relative group">
                <div className="glass-card rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl">
                  <motion.img
                    src={coin.image}
                    alt={coin.name}
                    className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    whileHover={{ scale: 1.02 }}
                  />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                    {coin.featured && (
                      <Badge className="bg-gradient-to-r from-coin-gold to-electric-orange text-white border-0 shadow-xl animate-pulse">
                        <Star className="w-4 h-4 mr-2" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={`bg-gradient-to-r ${getRarityColor(coin.rarity)} text-white border-0 shadow-xl`}>
                      <Award className="w-4 h-4 mr-2" />
                      {coin.rarity}
                    </Badge>
                  </div>

                  {isAuction && timeLeft && (
                    <div className="absolute bottom-6 right-6 glass-card-dark px-4 py-2 rounded-full text-white">
                      <Clock className="w-4 h-4 mr-2 inline" />
                      {timeLeft}
                    </div>
                  )}

                  {coin.authentication_status === 'verified' && (
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-gradient-to-r from-electric-emerald to-electric-teal text-white border-0 shadow-xl">
                        <Verified className="w-4 h-4 mr-2" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {coin.model_3d_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <CoinViewer3D 
                    obverseImage={coin.obverse_image} 
                    reverseImage={coin.reverse_image}
                    model3dUrl={coin.model_3d_url} 
                    name={coin.name}
                  />
                </motion.div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-serif font-bold gradient-text mb-4">{coin.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
                    <CalendarDays className="w-5 h-5 text-brand-primary" />
                    <span className="font-medium">{coin.year}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
                    <Eye className="w-5 h-5 text-electric-blue" />
                    <span className="font-medium">{coin.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
                    <Heart className="w-5 h-5 text-brand-accent" />
                    <span className="font-medium">{coin.favorites || 0} favorites</span>
                  </div>
                  {coin.country && (
                    <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
                      <MapPin className="w-5 h-5 text-electric-emerald" />
                      <span className="font-medium">{coin.country}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge className="px-4 py-2 bg-gradient-to-r from-electric-blue to-brand-primary text-white text-sm">
                    {coin.condition}
                  </Badge>
                  <Badge className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm">
                    Grade: {coin.grade}
                  </Badge>
                  {coin.denomination && (
                    <Badge className="px-4 py-2 bg-gradient-to-r from-electric-emerald to-electric-teal text-white text-sm">
                      {coin.denomination}
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Price/Bidding Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass-card border-2 border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-electric-blue/10 to-brand-accent/10">
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="gradient-text font-bold">
                        {isAuction ? 'Current Bid' : 'Price'}
                      </span>
                      {isAuction && timeLeft && (
                        <Badge className="bg-gradient-to-r from-brand-accent to-electric-pink text-white animate-pulse">
                          <Clock className="w-4 h-4 mr-2" />
                          {timeLeft}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="text-4xl font-bold gradient-text mb-6 flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-electric-emerald" />
                      ${isAuction ? highestBid.toLocaleString() : coin.price.toLocaleString()}
                    </div>
                    
                    {isAuction && coin.reserve_price && (
                      <div className="text-sm text-gray-600 mb-6 p-3 glass-card rounded-2xl">
                        <span className="font-medium">Reserve price: </span>
                        <span className="text-brand-primary font-bold">${coin.reserve_price.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {isAuction && (
                      <CoinBidForm 
                        coinId={coin.id} 
                        coinName={coin.name}
                        currentPrice={highestBid}
                        isAuction={isAuction}
                        timeLeft={timeLeft || undefined}
                        auctionEndDate={coin.auction_end}
                        bids={bids.map(bid => ({
                          amount: bid.amount,
                          bidder: bid.user_id,
                          time: bid.created_at
                        }))}
                        onBidPlaced={() => {}}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Seller Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="glass-card border-2 border-white/30 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl gradient-text">
                      <User className="w-6 h-6" />
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="font-bold text-lg text-gray-800">{coin.profiles?.name || 'Anonymous Seller'}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 px-3 py-1 glass-card rounded-full">
                            <Star className="w-4 h-4 text-coin-gold" />
                            <span className="font-medium">Reputation: {coin.profiles?.reputation || 0}/100</span>
                          </div>
                          {coin.profiles?.verified_dealer && (
                            <Badge className="bg-gradient-to-r from-electric-blue to-brand-primary text-white">
                              <Verified className="w-3 h-3 mr-1" />
                              Verified Dealer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <Card className="glass-card border-2 border-white/30 shadow-2xl rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-electric-blue/10 to-brand-accent/10">
                <CardTitle className="text-2xl gradient-text font-bold">Coin Specifications</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Country', value: coin.country },
                    { label: 'Denomination', value: coin.denomination },
                    { label: 'Composition', value: coin.composition },
                    { label: 'Diameter', value: coin.diameter ? `${coin.diameter}mm` : null },
                    { label: 'Weight', value: coin.weight ? `${coin.weight}g` : null },
                    { label: 'Mint', value: coin.mint },
                    { label: 'Mintage', value: coin.mintage ? coin.mintage.toLocaleString() : null },
                    { label: 'PCGS Number', value: coin.pcgs_number },
                    { label: 'NGC Number', value: coin.ngc_number }
                  ].filter(spec => spec.value).map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + (index * 0.1) }}
                      className="p-4 glass-card rounded-2xl hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-sm text-gray-600 font-medium mb-1">{spec.label}</div>
                      <div className="text-lg font-bold text-gray-800">{spec.value}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          {coin.description && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-8"
            >
              <Card className="glass-card border-2 border-white/30 shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text font-bold">Description</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 leading-relaxed text-lg">{coin.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bid History */}
          {isAuction && bids.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8"
            >
              <Card className="glass-card border-2 border-white/30 shadow-xl rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-electric-blue/10 to-brand-accent/10">
                  <CardTitle className="text-2xl gradient-text font-bold">Bid History</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {bids.map((bid, index) => (
                      <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.3 + (index * 0.1) }}
                        className="flex items-center justify-between p-4 glass-card rounded-2xl hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-electric-blue flex items-center justify-center text-white font-bold">
                            {(bid.profiles?.name || 'A')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{bid.profiles?.name || 'Anonymous'}</p>
                            <p className="text-sm text-gray-600">
                              {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold gradient-text">
                            ${bid.amount.toLocaleString()}
                          </div>
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-electric-emerald to-electric-teal text-white text-xs mt-1">
                              Highest Bid
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
