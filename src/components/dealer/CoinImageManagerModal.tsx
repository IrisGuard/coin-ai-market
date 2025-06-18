
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
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

  const handleImagesUpdated = () => {
    // Just refresh the data - don't close the modal
    onImagesUpdated();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Camera className="w-5 h-5 text-blue-600" />
            Image Management - {coin.name}
            <span className="text-sm text-gray-500">
              ({getValidImages(coin).length} images)
            </span>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            Done
          </Button>
        </DialogHeader>
        <div className="bg-white">
          <EnhancedCoinImageManager
            coinId={coin.id}
            coinName={coin.name}
            currentImages={getValidImages(coin)}
            onImagesUpdated={handleImagesUpdated}
            maxImages={10}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoinImageManagerModal;
