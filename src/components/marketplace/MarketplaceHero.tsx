
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star } from 'lucide-react';

const MarketplaceHero = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Rare Coins
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            From ancient treasures to modern collectibles
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Trending
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Verified Coins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">5,000+</div>
              <div className="text-blue-200">Happy Collectors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-400 mr-1" />
                <span className="text-3xl font-bold">4.9</span>
              </div>
              <div className="text-blue-200">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
