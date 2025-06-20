
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Coin {
  id: string;
  name: string;
  year: number;
  country: string;
  grade: string;
  price: number;
  image_url: string;
}

const FeaturedCoinsGrid = () => {
  const { data: featuredCoins, isLoading, error } = useQuery({
    queryKey: ['featuredCoins'],
    queryFn: async (): Promise<Coin[]> => {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .limit(4);

      if (error) {
        console.error('Error fetching featured coins:', error);
        return [];
      }

      // Map the database data to match the expected interface
      return (data || []).map(coin => ({
        id: coin.id,
        name: coin.name,
        year: coin.year,
        country: coin.country || '',
        grade: coin.grade,
        price: coin.price,
        image_url: coin.image // Map 'image' to 'image_url'
      }));
    }
  });

  if (isLoading) {
    return <div>Loading featured coins...</div>;
  }

  if (error) {
    return <div>Error loading featured coins.</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Featured Coins</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCoins?.map((coin) => (
          <Card key={coin.id}>
            <CardHeader>
              <CardTitle>{coin.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={coin.image_url} alt={coin.name} className="w-full h-48 object-cover mb-4 rounded-md" />
              <p className="text-gray-600">Year: {coin.year}</p>
              <p className="text-gray-600">Country: {coin.country}</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <Badge>{coin.grade}</Badge>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCoinsGrid;
