
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Heart, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Coin {
  id: string;
  name: string;
  year: number;
  price: number;
  rarity: string;
  grade: string;
  image: string;
  views: number;
  favorites: number;
  country: string;
  condition: string;
  user_id: string;
  profiles?: {
    name: string;
  };
}

const Marketplace = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterRarity, setFilterRarity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const fetchCoins = async () => {
    try {
      let query = supabase
        .from('coins')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq('authentication_status', 'verified');

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`);
      }

      if (filterRarity !== 'all') {
        query = query.eq('rarity', filterRarity);
      }

      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      query = query.order(sortBy, { ascending: sortBy === 'price' });

      const { data, error } = await query;

      if (error) throw error;
      setCoins(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch coins: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (coinId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to add favorites",
          variant: "destructive",
        });
        return;
      }

      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('coin_id', coinId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('coin_id', coinId)
          .eq('user_id', user.id);
        
        await supabase
          .from('coins')
          .update({ favorites: Math.max(0, coins.find(c => c.id === coinId)?.favorites - 1 || 0) })
          .eq('id', coinId);
      } else {
        await supabase
          .from('user_favorites')
          .insert({ coin_id: coinId, user_id: user.id });
        
        await supabase
          .from('coins')
          .update({ favorites: (coins.find(c => c.id === coinId)?.favorites || 0) + 1 })
          .eq('id', coinId);
      }

      fetchCoins();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update favorite: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [searchTerm, sortBy, filterRarity, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading marketplace...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Coin Marketplace</h1>
            <p className="text-gray-600">Discover rare and valuable coins from collectors worldwide</p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Latest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="favorites">Most Favorited</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger>
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Uncommon">Uncommon</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Very Rare">Very Rare</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-200">$50 - $200</SelectItem>
                <SelectItem value="200-1000">$200 - $1,000</SelectItem>
                <SelectItem value="1000">$1,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Coins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coins.map((coin) => (
              <Card key={coin.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleFavorite(coin.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{coin.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-coin-purple">
                        ${coin.price.toLocaleString()}
                      </span>
                      <Badge variant="outline">{coin.rarity}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Year: {coin.year}</div>
                      <div>Grade: {coin.grade}</div>
                      <div>Country: {coin.country}</div>
                      <div>Seller: {coin.profiles?.name || 'Unknown'}</div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {coin.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {coin.favorites}
                      </span>
                    </div>
                    <Link to={`/coins/${coin.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {coins.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No coins found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
