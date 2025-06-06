
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Heart, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CoinCard from '@/components/CoinCard';
import { usePageView } from '@/hooks/usePageView';

const Favorites = () => {
  usePageView();
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Connect to real favorites data from Supabase
  const favoriteCoins: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Favorite Coins</h1>
            <p className="text-gray-600 mt-2">Your collection of favorite coins</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {favoriteCoins.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite coins yet</h3>
              <p className="text-gray-600 mb-4">Heart coins you love to add them to your favorites.</p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCoins.map((coin) => (
              <div key={coin.id} className="relative">
                <CoinCard coin={coin} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 left-2"
                  onClick={() => {/* Remove from favorites */}}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
