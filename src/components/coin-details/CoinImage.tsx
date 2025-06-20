
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
  // Enhanced function to prepare all available images
  const getAllImages = (): string[] => {
    const allImages: string[] = [];
    
    // Priority 1: Check images array first
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImagesFromArray = coin.images.filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        !img.startsWith('blob:')
      );
      allImages.push(...validImagesFromArray);
    }
    
    // Priority 2: Add individual image fields if not already included
    const individualImages = [coin.image, coin.obverse_image, coin.reverse_image]
      .filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        !img.startsWith('blob:') &&
        !allImages.includes(img)
      );
    
    allImages.push(...individualImages);
    
    return allImages;
  };

  const allImages = getAllImages();

  return (
    <Card className="overflow-hidden bg-white shadow-lg border-0 rounded-2xl">
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
