
import { useState, ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import MobileCameraUploader from './MobileCameraUploader';
import ImageGrid from './coin-uploader/ImageGrid';
import CoinResultCard from './coin-uploader/CoinResultCard';

type CoinData = {
  coin: string;
  year: number;
  grade: string;
  error: string;
  value_usd: number;
  rarity: string;
  metal: string;
  weight: string;
  diameter: string;
  ruler: string;
};

const CoinUploader = () => {
  const { toast } = useToast();
  const isMobile = useMobile();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coinData, setCoinData] = useState<CoinData | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    if (images.length + newFiles.length > 5) {
      toast({
        title: "Error",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive",
      });
      return;
    }
    
    const newImages = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const handleMobileImagesSelected = (newImages: { file: File; preview: string }[]) => {
    if (images.length + newImages.length > 5) {
      toast({
        title: "Error",
        description: `You can upload a maximum of 5 images. Only adding the first ${5 - images.length}.`,
        variant: "destructive",
      });
      
      // Only add up to the maximum allowed
      const allowedImages = newImages.slice(0, 5 - images.length);
      setImages([...images, ...allowedImages]);
      return;
    }
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const identifyCoin = () => {
    if (images.length < 2) {
      toast({
        title: "Not enough images",
        description: "Please upload at least 2 images of your coin (front and back).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to AI service
    setTimeout(() => {
      // Mock response from AI
      setCoinData({
        coin: "10 Drachmai",
        year: 1959,
        grade: "MS66",
        error: "None",
        value_usd: 55.00,
        rarity: "Uncommon",
        metal: "Nickel",
        weight: "10.000g",
        diameter: "30mm",
        ruler: "Paul I"
      });
      
      setIsLoading(false);
      
      toast({
        title: "Coin Identified!",
        description: "Our AI has successfully identified your coin.",
      });
    }, 2500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-serif font-bold text-coin-blue mb-6">Upload Coin Images</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Upload 2-5 images of your coin (front, back, and other angles)</p>
        
        {isMobile ? (
          <MobileCameraUploader onImagesSelected={handleMobileImagesSelected} maxImages={5} />
        ) : null}
        
        <ImageGrid 
          images={images}
          removeImage={removeImage}
          onAddImage={handleImageUpload}
          maxImages={5}
          isMobile={isMobile}
        />
      </div>
      
      <button
        onClick={identifyCoin}
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
      
      <CoinResultCard coinData={coinData} />
    </div>
  );
};

export default CoinUploader;
