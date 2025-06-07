
import { useState, useEffect } from 'react';
import { Coin } from '@/types/coin';

interface RealTimeUpdate {
  id: string;
  price?: number;
  views?: number;
  is_auction?: boolean;
  auction_end?: string;
  featured?: boolean;
  timestamp: string;
}

export const useRealTimeMarketplace = (coins: Coin[]) => {
  const [updates, setUpdates] = useState<Record<string, RealTimeUpdate>>({});

  useEffect(() => {
    if (!coins || coins.length === 0) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomCoin = coins[Math.floor(Math.random() * coins.length)];
      
      // Random update type
      const updateTypes = ['price', 'views', 'auction_status'];
      const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      
      let update: Partial<RealTimeUpdate> = {
        id: randomCoin.id,
        timestamp: new Date().toISOString()
      };

      switch (updateType) {
        case 'price':
          if (randomCoin.price) {
            const priceChange = (Math.random() - 0.5) * 0.1; // ±5% change
            update.price = Math.max(1, randomCoin.price * (1 + priceChange));
          }
          break;
        case 'views':
          update.views = (randomCoin.views || 0) + Math.floor(Math.random() * 5);
          break;
        case 'auction_status':
          if (randomCoin.is_auction && randomCoin.auction_end) {
            // Check if auction is ending soon
            const auctionEnd = new Date(randomCoin.auction_end);
            const now = new Date();
            const timeLeft = auctionEnd.getTime() - now.getTime();
            
            if (timeLeft > 0 && timeLeft < 3600000) { // Less than 1 hour
              update.auction_end = randomCoin.auction_end;
              update.is_auction = true;
            }
          }
          break;
      }

      setUpdates(prev => ({
        ...prev,
        [randomCoin.id]: { ...prev[randomCoin.id], ...update } as RealTimeUpdate
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [coins]);

  return updates;
};
