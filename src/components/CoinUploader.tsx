
import { useCoinImages } from '@/hooks/use-coin-images';
import { useCoinIdentification } from '@/hooks/use-coin-identification';
import CoinUploadSection from './coin-uploader/CoinUploadSection';
import CoinResultCard from './coin-uploader/CoinResultCard';

export type CoinData = {
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
  image_url?: string;
};

const CoinUploader = () => {
  const {
    images,
    uploadedImageUrls,
    handleImageUpload,
    handleMobileImagesSelected,
    removeImage,
    uploadImagesToStorage,
    resetImages
  } = useCoinImages(5);

  const {
    coinData,
    isLoading,
    isListing,
    identifyCoin,
    handleListCoin,
    resetCoinData
  } = useCoinIdentification();

  const handleIdentifyCoin = async () => {
    const imageUrls = await uploadImagesToStorage();
    const imageFiles = images.map(img => img.file);
    await identifyCoin(imageFiles, imageUrls);
  };

  const handleListForSale = async () => {
    const success = await handleListCoin(false, uploadedImageUrls);
    if (success) {
      resetImages();
      resetCoinData();
    }
  };

  const handleListForAuction = async () => {
    const success = await handleListCoin(true, uploadedImageUrls);
    if (success) {
      resetImages();
      resetCoinData();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-serif font-bold text-coin-blue mb-6">Upload Coin Images</h2>
      
      <CoinUploadSection
        images={images}
        onImageUpload={handleImageUpload}
        onMobileImagesSelected={handleMobileImagesSelected}
        onRemoveImage={removeImage}
        onIdentifyCoin={handleIdentifyCoin}
        isLoading={isLoading}
      />
      
      <CoinResultCard 
        coinData={coinData} 
        onListForSale={handleListForSale} 
        onListForAuction={handleListForAuction} 
        isListing={isListing}
      />
    </div>
  );
};

export default CoinUploader;
