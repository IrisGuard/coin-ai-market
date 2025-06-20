
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ImageGallery from '@/components/ui/ImageGallery';

interface Coin {
  id: string;
  name: string;
  year: number;
  country: string;
  grade: string;
  price: number;
  image: string;
  images?: string[];
  obverse_image?: string;
  reverse_image?: string;
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

      return (data || []).map(coin => ({
        id: coin.id,
        name: coin.name,
        year: coin.year,
        country: coin.country || '',
        grade: coin.grade,
        price: coin.price,
        image: coin.image,
        images: coin.images,
        obverse_image: coin.obverse_image,
        reverse_image: coin.reverse_image
      }));
    }
  });

  // Helper function to get all available images for a coin
  const getAllImages = (coin: Coin): string[] => {
    const allImages: string[] = [];
    
    // Add from images array if available
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      allImages.push(...coin.images.filter(img => img && !img.startsWith('blob:')));
    } else {
      // Fallback to individual image fields
      if (coin.image && !coin.image.startsWith('blob:')) allImages.push(coin.image);
      if (coin.obverse_image && !coin.obverse_image.startsWith('blob:')) allImages.push(coin.obverse_image);
      if (coin.reverse_image && !coin.reverse_image.startsWith('blob:')) allImages.push(coin.reverse_image);
    }
    
    return allImages;
  };

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
        {featuredCoins?.map((coin) => {
          const allImages = getAllImages(coin);
          
          return (
            <Card key={coin.id}>
              <CardHeader>
                <CardTitle>{coin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <ImageGallery 
                    images={allImages}
                    coinName={coin.name}
                    className="w-full h-48"
                  />
                </div>
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
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCoinsGrid;
