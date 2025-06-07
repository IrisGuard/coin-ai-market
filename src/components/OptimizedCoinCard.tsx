
import React, { memo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coin } from '@/types/coin';
import { useEnhancedFavorites } from '@/hooks/useEnhancedFavorites';
import { createImageObserver, preloadImage } from '@/utils/performanceOptimizations';
import CoinCardImage from '@/components/coin-card/CoinCardImage';
import CoinCardInfo from '@/components/coin-card/CoinCardInfo';
import CoinCardPricing from '@/components/coin-card/CoinCardPricing';
import CoinCardFooter from '@/components/coin-card/CoinCardFooter';

interface OptimizedCoinCardProps {
  coin: Coin;
  index?: number;
  priority?: boolean;
}

const OptimizedCoinCard: React.FC<OptimizedCoinCardProps> = memo(({ coin, index = 0, priority = false }) => {
  const { toggleFavorite, isFavorite } = useEnhancedFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isUserFavorite = isFavorite(coin.id);

  useEffect(() => {
    if (priority) return;
    
    const observer = createImageObserver((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (imgRef.current) {
          preloadImage(coin.image).then(() => {
            setImageLoaded(true);
          }).catch(() => {
            setImageLoaded(true); // Show fallback
          });
        }
      }
    });

    if (observer && cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (observer && cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [coin.image, priority]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(coin.id);
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  if (!isVisible && !priority) {
    return (
      <div ref={cardRef} className="aspect-square bg-gray-100 animate-pulse rounded-lg">
        <div className="h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg"></div>
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-white">
        <CoinCardImage
          coin={coin}
          imageLoaded={imageLoaded}
          isUserFavorite={isUserFavorite}
          onFavoriteClick={handleFavoriteClick}
          formatTimeRemaining={formatTimeRemaining}
          priority={priority}
        />

        <CardContent className="p-4">
          <div className="space-y-3">
            <CoinCardInfo coin={coin} />
            <CoinCardPricing coin={coin} />
            <CoinCardFooter coin={coin} />

            {/* Action Button */}
            <Link to={`/coin/${coin.id}`} className="block">
              <Button className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-white">
                {coin.is_auction ? 'View Auction' : 'View Details'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

OptimizedCoinCard.displayName = 'OptimizedCoinCard';

export default OptimizedCoinCard;
