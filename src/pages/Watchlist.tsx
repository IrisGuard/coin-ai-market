
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { TrendingDown, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { useWatchlistData } from '@/hooks/useWatchlistData';
import { useWatchlistActions } from '@/hooks/useWatchlistActions';
import WatchlistHeader from '@/components/watchlist/WatchlistHeader';
import WatchlistStats from '@/components/watchlist/WatchlistStats';
import WatchlistFilters from '@/components/watchlist/WatchlistFilters';
import WatchlistEmptyState from '@/components/watchlist/WatchlistEmptyState';
import WatchlistItem from '@/components/watchlist/WatchlistItem';

const Watchlist = () => {
  usePageView();
  const { user, isAuthenticated } = useAuth();
  const { watchlistItems, setWatchlistItems, watchlistStats, isLoading } = useWatchlistData(user?.id);
  const { removeFromWatchlist, updatePriceAlert } = useWatchlistActions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'auctions' | 'buy_now' | 'price_drops'>('all');
  const [sortBy, setSortBy] = useState<'date_added' | 'price_low' | 'price_high' | 'ending_soon'>('date_added');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceAlerts, setPriceAlerts] = useState<Record<string, { enabled: boolean; target: string }>>({});

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Filter and sort watchlist
  const filteredWatchlist = useMemo(() => {
    return watchlistItems
      .filter(item => {
        const matchesSearch = item.coin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.coin?.country?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesFilter = true;
        switch (filterType) {
          case 'auctions':
            matchesFilter = item.coin?.is_auction || false;
            break;
          case 'buy_now':
            matchesFilter = !item.coin?.is_auction;
            break;
          case 'price_drops':
            // For now, we'll use a simple heuristic since we don't have price history
            matchesFilter = Math.random() > 0.5; // Placeholder
            break;
        }

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_low':
            return (a.coin?.price || 0) - (b.coin?.price || 0);
          case 'price_high':
            return (b.coin?.price || 0) - (a.coin?.price || 0);
          case 'ending_soon':
            if (!a.coin?.is_auction && !b.coin?.is_auction) return 0;
            if (!a.coin?.is_auction) return 1;
            if (!b.coin?.is_auction) return -1;
            return new Date(a.coin.auction_end || '').getTime() - new Date(b.coin.auction_end || '').getTime();
          default: // date_added
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [watchlistItems, searchTerm, filterType, sortBy]);

  const handleRemoveFromWatchlist = async (watchlistItemId: string) => {
    const success = await removeFromWatchlist(watchlistItemId);
    if (success) {
      setWatchlistItems(prev => prev.filter(item => item.id !== watchlistItemId));
    }
  };

  const handleUpdatePriceAlert = async (watchlistItemId: string, enabled: boolean, targetPrice?: number) => {
    const success = await updatePriceAlert(watchlistItemId, enabled, targetPrice);
    if (success) {
      setWatchlistItems(prev => prev.map(item => 
        item.id === watchlistItemId 
          ? { ...item, price_alert_enabled: enabled, target_price: targetPrice || null }
          : item
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WatchlistHeader />

        <WatchlistStats {...watchlistStats} />

        {/* Price Drops Alert */}
        {watchlistStats.priceDrops > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Alert>
              <TrendingDown className="h-4 w-4" />
              <AlertDescription>
                🎯 {watchlistStats.priceDrops} coin{watchlistStats.priceDrops !== 1 ? 's have' : ' has'} dropped in price! 
                Great opportunity to buy.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <WatchlistFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </motion.div>

        {/* Watchlist Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredWatchlist.length === 0 ? (
            <WatchlistEmptyState />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredWatchlist.map((item, index) => (
                <WatchlistItem
                  key={item.id}
                  item={item}
                  index={index}
                  viewMode={viewMode}
                  priceAlerts={priceAlerts}
                  setPriceAlerts={setPriceAlerts}
                  onRemove={handleRemoveFromWatchlist}
                  onUpdateAlert={handleUpdatePriceAlert}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Watchlist;
