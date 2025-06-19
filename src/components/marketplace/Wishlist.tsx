
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { marketplaceService } from '@/services/marketplaceService';
import { useListings } from '@/hooks/useListings';
import { Heart, Eye, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Wishlist = () => {
  const { user } = useAuth();
  const { removeFromWishlist, isRemovingFromWishlist } = useListings();

  const { data: wishlistItems, isLoading, refetch } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => marketplaceService.getWishlist(user?.id || ''),
    enabled: !!user
  });

  const handleRemoveFromWishlist = async (coinId: string) => {
    try {
      await removeFromWishlist(coinId);
      await refetch();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please log in to view your wishlist</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Wishlist
            <Badge variant="secondary">{wishlistItems?.length || 0} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => {
                const coin = item.coins;
                if (!coin) return null;

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(coin.id)}
                        disabled={isRemovingFromWishlist}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{coin.name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Year:</span>
                          <span>{coin.year}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Grade:</span>
                          <Badge variant="outline">{coin.grade}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-semibold text-primary">
                            ${coin.price?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {coin.views || 0} views
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {coin.rarity}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/coin/${coin.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        {coin.is_auction ? (
                          <Button size="sm" className="flex-1">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Bid Now
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Browse coins and add them to your wishlist to keep track of items you're interested in
              </p>
              <Link to="/marketplace">
                <Button className="mt-4">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {wishlistItems && wishlistItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wishlist Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {wishlistItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${wishlistItems.reduce((sum, item) => sum + (item.coins?.price || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${Math.round(wishlistItems.reduce((sum, item) => sum + (item.coins?.price || 0), 0) / wishlistItems.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {wishlistItems.filter(item => item.coins?.is_auction).length}
                </div>
                <div className="text-sm text-muted-foreground">Auctions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Wishlist;
