
import { useState, ChangeEvent } from 'react';
import { Upload, X, Plus, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CoinUploader = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coinData, setCoinData] = useState<null | {
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
  }>(null);

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
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          ))}
          
          {images.length < 5 && (
            <label className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center">
                <Camera size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add image</span>
              </div>
              <input 
                type="file" 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
                multiple
              />
            </label>
          )}
        </div>
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
      
      {coinData && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold text-coin-blue mb-4">Identification Results</h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Coin Type</p>
                <p className="font-medium">{coinData.coin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{coinData.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-medium">{coinData.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Errors</p>
                <p className="font-medium">{coinData.error}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Metal</p>
                <p className="font-medium">{coinData.metal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rarity</p>
                <p className="font-medium">{coinData.rarity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{coinData.weight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diameter</p>
                <p className="font-medium">{coinData.diameter}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ruler</p>
                <p className="font-medium">{coinData.ruler}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Value</p>
                <p className="font-medium text-coin-gold">${coinData.value_usd.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="coin-button w-full">
                List for Sale / Auction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinUploader;
