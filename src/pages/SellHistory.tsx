import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, TrendingUp, Package, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SellHistory = () => {
  usePageView();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Get user's selling history with proper foreign key hint
  const { data: salesHistory, isLoading } = useQuery({
    queryKey: ['sales-history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          coins!transactions_coin_id_fkey(
            id,
            name,
            image,
            year,
            grade,
            country
          ),
          buyer:profiles!transactions_buyer_id_fkey(
            id,
            name,
            email,
            reputation
          )
        `)
        .eq('seller_id', user?.id!)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate real statistics
  const totalSales = salesHistory?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
  const itemsSold = salesHistory?.filter(sale => sale.status === 'completed').length || 0;
  const totalListings = salesHistory?.length || 0;
  const successRate = totalListings > 0 ? ((itemsSold / totalListings) * 100).toFixed(0) : '0';

  const filteredSales = salesHistory?.filter(sale =>
    sale.coins?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.coins?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px] pt-16">
          <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Selling History</h1>
            <p className="text-gray-600 mt-2">Track your sales performance and completed listings</p>
          </div>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            Create New Listing
          </Button>
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {itemsSold} completed sales
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{itemsSold}</div>
              <p className="text-xs text-muted-foreground">
                Out of {totalListings} listings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Listings sold successfully
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sales history..."
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

        {filteredSales.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {salesHistory?.length === 0 ? 'No sales history yet' : 'No sales match your search'}
              </h3>
              <p className="text-gray-600 mb-4">
                {salesHistory?.length === 0 
                  ? 'Start selling your coins to build your sales history.' 
                  : 'Try adjusting your search terms.'}
              </p>
              {salesHistory?.length === 0 && (
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Create Your First Listing
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Your completed and ongoing sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      {sale.coins?.image && (
                        <img 
                          src={sale.coins.image} 
                          alt={sale.coins.name || 'Coin'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h4 className="font-medium">{sale.coins?.name || 'Unknown Coin'}</h4>
                        <p className="text-sm text-gray-600">
                          {sale.coins?.year} • {sale.coins?.country} • {sale.coins?.grade}
                        </p>
                        <p className="text-xs text-gray-500">
                          Sold to {sale.buyer?.name || 'Unknown Buyer'} • {new Date(sale.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${Number(sale.amount).toLocaleString()}</div>
                      <Badge 
                        variant={
                          sale.status === 'completed' ? 'default' :
                          sale.status === 'pending' ? 'secondary' :
                          sale.status === 'cancelled' ? 'destructive' : 'outline'
                        }
                      >
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellHistory;
