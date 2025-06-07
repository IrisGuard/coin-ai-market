
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCreateCoin } from '@/hooks/useCoinMutations';
import { useImageHandling } from '@/hooks/useImageHandling';
import { toast } from '@/hooks/use-toast';

interface CoinData {
  title: string;
  description: string;
  price: string;
  startingBid: string;
  isAuction: boolean;
  year: string;
  grade: string;
}

export const useCoinUpload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<{ file: File; preview: string; uploaded: boolean }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    price: '',
    startingBid: '',
    isAuction: false,
    year: '',
    grade: ''
  });

  const aiRecognition = useRealAICoinRecognition();
  const createCoin = useCreateCoin();
  const { uploadImage, convertToBase64 } = useImageHandling();

  const handleFiles = useCallback((files: File[]) => {
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUploadAndAnalyze = useCallback(async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    try {
      // Upload first image and analyze
      const mainImage = images[0];
      const imageUrl = await uploadImage(mainImage.file);
      const base64Image = await convertToBase64(mainImage.file);

      // Update uploaded status
      setImages(prev => prev.map((img, i) => 
        i === 0 ? { ...img, uploaded: true } : img
      ));

      // Run AI analysis
      const result = await aiRecognition.mutateAsync({
        image: base64Image
      });

      if (result.success) {
        setAnalysisResults(result);
        
        // Auto-fill coin data from AI results
        setCoinData(prev => ({
          ...prev,
          title: result.identification.name || '',
          year: result.identification.year?.toString() || '',
          grade: result.grading.grade || '',
          price: result.valuation.current_value?.toString() || ''
        }));
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [images, uploadImage, convertToBase64, aiRecognition]);

  const handleSubmitListing = useCallback(async () => {
    if (!coinData.title || images.length === 0) return;

    setIsSubmitting(true);
    try {
      // Upload remaining images if any
      const uploadedImageUrls = [];
      for (const image of images) {
        if (!image.uploaded) {
          const url = await uploadImage(image.file);
          uploadedImageUrls.push(url);
        }
      }

      const newCoin = {
        name: coinData.title,
        description: coinData.description,
        year: parseInt(coinData.year) || new Date().getFullYear(),
        grade: coinData.grade || 'Ungraded',
        price: parseFloat(coinData.isAuction ? coinData.startingBid : coinData.price) || 0,
        image: uploadedImageUrls[0] || images[0].preview,
        rarity: 'common',
        country: '',
        denomination: '',
        is_auction: coinData.isAuction,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid) || 0 : null
      };

      await createCoin.mutateAsync(newCoin);
      
      toast({
        title: "Listing Created",
        description: "Your coin has been successfully listed!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [coinData, images, uploadImage, createCoin, navigate]);

  const handleCoinDataChange = useCallback((data: CoinData) => {
    setCoinData(data);
  }, []);

  return {
    images,
    isAnalyzing,
    analysisResults,
    isSubmitting,
    coinData,
    handleFiles,
    handleUploadAndAnalyze,
    handleSubmitListing,
    removeImage,
    handleCoinDataChange
  };
};
