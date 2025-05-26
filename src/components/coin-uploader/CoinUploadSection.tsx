
import { Upload, Loader2 } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import MobileCameraUploader from '@/components/MobileCameraUploader';
import ImageGrid from './ImageGrid';

interface CoinUploadSectionProps {
  images: { file: File; preview: string }[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMobileImagesSelected: (images: { file: File; preview: string }[]) => void;
  onRemoveImage: (index: number) => void;
  onIdentifyCoin: () => void;
  isLoading: boolean;
}

const CoinUploadSection = ({
  images,
  onImageUpload,
  onMobileImagesSelected,
  onRemoveImage,
  onIdentifyCoin,
  isLoading
}: CoinUploadSectionProps) => {
  const isMobile = useMobile();

  return (
    <>
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Upload 2-5 images of your coin (front, back, and other angles)</p>
        
        {isMobile && (
          <MobileCameraUploader onImagesSelected={onMobileImagesSelected} maxImages={5} />
        )}
        
        <ImageGrid 
          images={images}
          removeImage={onRemoveImage}
          onAddImage={onImageUpload}
          maxImages={5}
          isMobile={isMobile}
        />
      </div>
      
      <button
        onClick={onIdentifyCoin}
        disabled={images.length < 2 || isLoading}
        className="coin-button w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="mr-2 animate-spin" />
            Analyzing Images...
          </>
        ) : (
          <>
            <Upload size={20} className="mr-2" />
            Identify Coin
          </>
        )}
      </button>
    </>
  );
};

export default CoinUploadSection;
