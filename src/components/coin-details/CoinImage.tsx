
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ImageGallery from '@/components/ui/ImageGallery';

interface CoinImageProps {
  coin: {
    name: string;
    image?: string;
    images?: string[];
    obverse_image?: string;
    reverse_image?: string;
  };
}

const CoinImage = ({ coin }: CoinImageProps) => {
  // Prepare all available images
  const getAllImages = (): string[] => {
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

  const allImages = getAllImages();

  return (
    <Card className="glass-card border-2 border-purple-200 overflow-hidden">
      <CardContent className="p-0">
        <ImageGallery 
          images={allImages}
          coinName={coin.name}
          className="w-full h-96"
        />
      </CardContent>
    </Card>
  );
};

export default CoinImage;
