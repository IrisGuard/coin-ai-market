
import { X, Camera } from 'lucide-react';

interface ImageGridProps {
  images: { file: File; preview: string }[];
  removeImage: (index: number) => void;
  onAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxImages: number;
  isMobile: boolean;
}

const ImageGrid = ({ images, removeImage, onAddImage, maxImages, isMobile }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={image.preview} 
            alt={`Coin image ${index + 1}`} 
            className="w-full h-full object-contain"
          />
          <button
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
            type="button"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      ))}
      
      {images.length < maxImages && !isMobile && (
        <label className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center">
            <Camera size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Add image</span>
          </div>
          <input 
            type="file" 
            onChange={onAddImage} 
            className="hidden" 
            accept="image/*"
            multiple
          />
        </label>
      )}
    </div>
  );
};

export default ImageGrid;
