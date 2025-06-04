
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Coin } from '@/types/coin';
import { Heart, Eye, Star, Clock, Verified, TrendingUp } from 'lucide-react';

interface CoinCardProps extends Coin {}

const CoinCard: React.FC<CoinCardProps> = (coin) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-gradient-to-r from-electric-emerald to-electric-teal text-white';
      case 'Uncommon':
        return 'bg-gradient-to-r from-electric-blue to-electric-cyan text-white';
      case 'Rare':
        return 'bg-gradient-to-r from-brand-primary to-electric-purple text-white';
      case 'Ultra Rare':
        return 'bg-gradient-to-r from-brand-accent to-electric-pink text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Mint':
        return 'text-electric-emerald border-electric-emerald/30 bg-electric-emerald/10';
      case 'Near Mint':
        return 'text-electric-blue border-electric-blue/30 bg-electric-blue/10';
      case 'Excellent':
        return 'text-brand-primary border-brand-primary/30 bg-brand-primary/10';
      case 'Good':
        return 'text-electric-orange border-electric-orange/30 bg-electric-orange/10';
      default:
        return 'text-gray-500 border-gray-300 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/coins/${coin.id}`}>
        <Card className="coin-card overflow-hidden group h-full">
          <div className="relative overflow-hidden">
            <motion.img
              src={coin.image}
              alt={coin.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
            />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Top badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {coin.featured && (
                <Badge className="bg-gradient-to-r from-coin-gold to-electric-orange text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {coin.is_auction && (
                <Badge className="bg-gradient-to-r from-brand-accent to-electric-pink text-white border-0 shadow-lg animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  Auction
                </Badge>
              )}
              {coin.authentication_status === 'verified' && (
                <Badge className="bg-gradient-to-r from-electric-emerald to-electric-teal text-white border-0 shadow-lg">
                  <Verified className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Stats overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 px-2 py-1 glass-card-dark rounded-full text-white text-xs">
                <Eye className="w-3 h-3" />
                {coin.views}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 glass-card-dark rounded-full text-white text-xs">
                <Heart className="w-3 h-3" />
                {coin.favorites}
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-brand-primary transition-colors">
                {coin.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{coin.year}</span>
                <span>•</span>
                <span>{coin.country}</span>
                {coin.denomination && (
                  <>
                    <span>•</span>
                    <span>{coin.denomination}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={getRarityColor(coin.rarity)} variant="secondary">
                {coin.rarity}
              </Badge>
              <Badge className={`border ${getConditionColor(coin.condition)}`} variant="outline">
                {coin.condition}
              </Badge>
              <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0" variant="secondary">
                {coin.grade}
              </Badge>
            </div>

            {coin.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {coin.description}
              </p>
            )}
          </CardContent>

          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">
                {coin.is_auction ? 'Current Bid' : 'Price'}
              </span>
              <span className="text-2xl font-bold gradient-text">
                ${coin.price.toLocaleString()}
              </span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-brand-primary to-electric-blue text-white rounded-full text-sm font-medium shadow-lg"
            >
              <TrendingUp className="w-4 h-4" />
              View Details
            </motion.div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CoinCard;
