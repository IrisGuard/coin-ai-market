
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MarketplaceHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/marketplace');
    }
  };

  const quickCategories = [
    'Ancient Coins', 'Modern Coins', 'Error Coins', 'Graded Coins', 'Auctions'
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Search Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Find the perfect coin for you
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover authentic coins from collectors worldwide
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                type="text"
                placeholder="Search for coins, years, countries, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-16 pr-32 h-16 text-lg border-2 border-gray-300 focus:border-orange-400 rounded-full shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-3 top-3 h-10 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickCategories.map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/marketplace?category=${category.toLowerCase().replace(' ', '-')}`)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-orange-100 hover:text-orange-700 rounded-full transition-colors border border-gray-200 hover:border-orange-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
