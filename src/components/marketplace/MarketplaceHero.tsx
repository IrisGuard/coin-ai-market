
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">
            Find the perfect coin for you
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for coins, years, countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base border-2 border-gray-300 focus:border-orange-400 rounded-full"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 h-8 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {quickCategories.map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/marketplace?category=${category.toLowerCase().replace(' ', '-')}`)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
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
