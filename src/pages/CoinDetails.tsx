
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Eye, Calendar, MapPin, Award, DollarSign, Gavel, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  description: string;
  composition: string;
  diameter: number;
  weight: number;
  mint: string;
  user_id: string;
  created_at: string;
  profiles?: {
    name: string;
    reputation: number;
  };
}

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  profiles?: {
    name: string;
  };
}

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  const fetchCoinDetails = async () => {
    if (!id) return;

    try {
      const { data: coinData, error: coinError } = await supabase
        .from('coins')
        .select(`
          *,
          profiles:user_id (name, reputation)
        `)
        .eq('id', id)
        .single();

      if (coinError) throw coinError;

      setCoin(coinData);

      // Increment view count
      await supabase
        .from('coins')
        .update({ views: (coinData.views || 0) + 1 })
        .eq('id', id);

      // Fetch bids
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .eq('coin_id', id)
        .order('amount', { ascending: false });

      if (bidsError) throw bidsError;
      setBids(bidsData || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch coin details: " + error.message,
        variant: "destructive",
      });
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Error",
        description: "Please login to place a bid",
        variant: "destructive",
      });
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      });
      return;
    }

    const currentHighestBid = bids.length > 0 ? bids[0].amount : (coin?.price || 0);
    if (parseFloat(bidAmount) <= currentHighestBid) {
      toast({
        title: "Error",
        description: `Bid must be higher than current price of $${currentHighestBid}`,
        variant: "destructive",
      });
      return;
    }

    setSubmittingBid(true);
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          coin_id: id,
          user_id: user.id,
          amount: parseFloat(bidAmount)
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bid placed successfully!",
      });

      setBidAmount('');
      fetchCoinDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to place bid: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated || !user || !coin) {
      toast({
        title: "Error",
        description: "Please login to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('coin_id', coin.id)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('coin_id', coin.id)
          .eq('user_id', user.id);
        
        setCoin(prev => prev ? {...prev, favorites: Math.max(0, prev.favorites - 1)} : null);
      } else {
        await supabase
          .from('user_favorites')
          .insert({ coin_id: coin.id, user_id: user.id });
        
        setCoin(prev => prev ? {...prev, favorites: prev.favorites + 1} : null);
      }

      await supabase
        .from('coins')
        .update({ favorites: coin.favorites })
        .eq('id', coin.id);

    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update favorite: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCoinDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading coin details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Coin Not Found</h2>
            <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentHighestBid = bids.length > 0 ? bids[0].amount : coin.price;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <Card>
                <CardContent className="p-0">
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {coin.views} views
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {coin.favorites} favorites
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFavorite}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{coin.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{coin.rarity}</Badge>
                  <Badge variant="secondary">{coin.grade}</Badge>
                  <Badge variant="outline">{coin.condition}</Badge>
                </div>
                
                <div className="text-3xl font-bold text-coin-purple mb-4">
                  ${currentHighestBid.toLocaleString()}
                  {bids.length > 0 && (
                    <span className="text-lg text-gray-600 ml-2">
                      (${bids.length} bid{bids.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>

              {/* Bidding Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    Place a Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={`Min: $${currentHighestBid + 1}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      disabled={!isAuthenticated}
                    />
                    <Button 
                      onClick={handleBid}
                      disabled={!isAuthenticated || submittingBid}
                    >
                      {submittingBid ? 'Placing...' : 'Place Bid'}
                    </Button>
                  </div>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-600">
                      Please <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>login</Button> to place a bid
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Seller Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{coin.profiles?.name || 'Unknown Seller'}</p>
                      <p className="text-sm text-gray-600">
                        Reputation: {coin.profiles?.reputation || 0} points
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bids */}
              {bids.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bids</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bids.slice(0, 5).map((bid, index) => (
                        <div key={bid.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">${bid.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              by {bid.profiles?.name || 'Anonymous'} • {new Date(bid.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {index === 0 && (
                            <Badge variant="default">Highest</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Detailed Information */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Coin Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{coin.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{coin.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mint</p>
                    <p className="font-medium">{coin.mint || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Composition</p>
                    <p className="font-medium">{coin.composition || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diameter</p>
                    <p className="font-medium">{coin.diameter ? `${coin.diameter}mm` : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{coin.weight ? `${coin.weight}g` : 'Not specified'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Listed</p>
                  <p className="font-medium">{new Date(coin.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {coin.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoinDetails;
