
import { X, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ImageWithQuality {
  file: File;
  preview: string;
  quality: 'excellent' | 'good' | 'poor';
  blurScore: number;
  originalSize: number;
  compressedSize: number;
}

interface CapturedImagesGridProps {
  images: ImageWithQuality[];
  onRemoveImage: (index: number) => void;
}

const CapturedImagesGrid = ({ images, onRemoveImage }: CapturedImagesGridProps) => {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatFileSize = (bytes: number) => {
    return bytes < 1024 * 1024 
      ? `${Math.round(bytes / 1024)}KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-800">Captured Photos ({images.length})</h4>
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.preview}
              alt={`Captured ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <div className="absolute top-2 right-2 flex space-x-1">
              <div className={`px-1 py-0.5 text-xs rounded ${getQualityColor(image.quality)} bg-white bg-opacity-90`}>
                {image.quality === 'excellent' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
              </div>
              <button
                onClick={() => onRemoveImage(index)}
                className="bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="absolute bottom-1 left-1 flex gap-1">
              <Badge className="text-xs bg-black bg-opacity-70 text-white">
                {image.quality}
              </Badge>
              <Badge className="text-xs bg-green-600 text-white">
                <Zap className="w-2 h-2 mr-1" />
                {formatFileSize(image.compressedSize)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapturedImagesGrid;
