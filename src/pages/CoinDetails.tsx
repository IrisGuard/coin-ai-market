
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
import { CalendarDays, Eye, Heart, Star, User, Verified } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: coin, isLoading } = useCoin(id!);
  const { data: bids = [] } = useCoinBids(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Coin Not Found</h1>
            <p className="text-gray-600">The coin you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : coin.price;
  const isAuction = coin.is_auction;
  const timeLeft = coin.auction_end ? formatDistanceToNow(new Date(coin.auction_end), { addSuffix: true }) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {coin.featured && (
                <Badge className="absolute top-4 left-4 bg-coin-gold text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {isAuction && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  Auction
                </Badge>
              )}
            </div>
            
            {coin.model_3d_url && (
              <CoinViewer3D modelUrl={coin.model_3d_url} />
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{coin.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {coin.year}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {coin.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {coin.favorites} favorites
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{coin.rarity}</Badge>
                <Badge variant="outline">{coin.condition}</Badge>
                <Badge variant="outline">{coin.grade}</Badge>
                {coin.authentication_status === 'verified' && (
                  <Badge className="bg-green-500 text-white">
                    <Verified className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Price/Bidding Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isAuction ? 'Current Bid' : 'Price'}</span>
                  {isAuction && timeLeft && (
                    <Badge variant="destructive">{timeLeft}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-coin-gold mb-4">
                  ${isAuction ? highestBid.toFixed(2) : coin.price.toFixed(2)}
                </div>
                
                {isAuction && (
                  <>
                    <div className="text-sm text-gray-600 mb-4">
                      Reserve price: ${coin.reserve_price?.toFixed(2)}
                    </div>
                    <CoinBidForm coinId={coin.id} currentBid={highestBid} />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{coin.profiles?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Reputation: {coin.profiles?.reputation}/100</span>
                      {coin.profiles?.verified_dealer && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          Verified Dealer
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coin Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {coin.country && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{coin.country}</span>
                  </div>
                )}
                {coin.denomination && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Denomination:</span>
                    <span className="font-medium">{coin.denomination}</span>
                  </div>
                )}
                {coin.composition && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Composition:</span>
                    <span className="font-medium">{coin.composition}</span>
                  </div>
                )}
                {coin.diameter && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diameter:</span>
                    <span className="font-medium">{coin.diameter}mm</span>
                  </div>
                )}
                {coin.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{coin.weight}g</span>
                  </div>
                )}
                {coin.mint && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mint:</span>
                    <span className="font-medium">{coin.mint}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Description */}
        {coin.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{coin.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bid History */}
        {isAuction && bids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{bid.profiles?.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-coin-gold">
                        ${bid.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoinDetails;
