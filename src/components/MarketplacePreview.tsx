
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import CoinCard from './CoinCard';
import { useFeaturedCoins } from '@/hooks/use-featured-coins';

const MarketplacePreview = () => {
  const { data: featuredCoins = [], isLoading, isError } = useFeaturedCoins();

  if (isLoading) {
    return (
      <div className="coin-section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-coin-purple" />
            <span className="ml-2 text-gray-600">Loading featured coins...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || featuredCoins.length === 0) {
    return (
      <div className="coin-section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="section-heading mb-4">Featured Coins</h2>
            <p className="text-gray-600 mb-6">
              No featured coins available at the moment. Check back later!
            </p>
            <Link to="/marketplace" className="coin-button inline-flex items-center px-6 py-3">
              Browse Marketplace <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="coin-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-heading">Featured Coins</h2>
          <Link to="/marketplace" className="flex items-center text-coin-blue hover:text-coin-gold">
            View all marketplace <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCoins.map((coin) => (
            <CoinCard key={coin.id} {...coin} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/upload" className="coin-button inline-flex items-center px-6 py-3">
            Upload and Sell Your Coins <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePreview;
