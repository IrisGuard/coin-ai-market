
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CoinData } from '@/components/CoinUploader';
import { analyzeCoinImages, listCoinForSale } from '@/services/coinAnalysisService';

export const useCoinIdentification = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [coinData, setCoinData] = useState<CoinData | null>(null);

  const identifyCoin = async (imageFiles: File[], imageUrls: string[]) => {
    if (imageFiles.length < 2) {
      toast({
        title: "Not enough images",
        description: "Please upload at least 2 images of your coin (front and back).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await analyzeCoinImages(imageFiles);
      
      if (result) {
        if (imageUrls.length > 0) {
          result.image_url = imageUrls[0];
        }
        
        setCoinData(result);
        
        toast({
          title: "Coin Identified!",
          description: "Our AI has successfully identified your coin.",
        });
      }
    } catch (error) {
      console.error("Error identifying coin:", error);
      toast({
        title: "Identification Failed",
        description: "There was an error identifying your coin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleListCoin = async (isAuction: boolean, uploadedImageUrls: string[]) => {
    if (!coinData) return;
    
    setIsListing(true);
    
    try {
      const result = await listCoinForSale(
        coinData,
        isAuction,
        coinData.value_usd,
        uploadedImageUrls
      );
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        
        return true;
      } else {
        toast({
          title: "Listing Failed",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error listing coin:", error);
      toast({
        title: "Listing Failed",
        description: "There was an error listing your coin. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsListing(false);
    }
  };

  const resetCoinData = () => {
    setCoinData(null);
  };

  return {
    coinData,
    isLoading,
    isListing,
    identifyCoin,
    handleListCoin,
    resetCoinData
  };
};
