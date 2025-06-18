
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import EnhancedCoinImageManager from './EnhancedCoinImageManager';

interface CoinImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: any;
  onImagesUpdated: () => void;
}

const CoinImageManagerModal: React.FC<CoinImageManagerModalProps> = ({
  isOpen,
  onClose,
  coin,
  onImagesUpdated
}) => {
  if (!coin) return null;

  const getValidImages = (coinData: any): string[] => {
    const allImages: string[] = [];
    
    if (coinData.images && Array.isArray(coinData.images) && coinData.images.length > 0) {
      const validImages = coinData.images.filter((img: string) => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && coinData.image && !coinData.image.startsWith('blob:')) {
      allImages.push(coinData.image);
    }
    
    return allImages;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Image Management - {coin.name}
            <span className="text-sm text-gray-500">
              ({getValidImages(coin).length} images)
            </span>
          </DialogTitle>
        </DialogHeader>
        <EnhancedCoinImageManager
          coinId={coin.id}
          coinName={coin.name}
          currentImages={getValidImages(coin)}
          onImagesUpdated={() => {
            onImagesUpdated();
            onClose();
          }}
          maxImages={10}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoinImageManagerModal;
