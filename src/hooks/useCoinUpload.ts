
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
  condition: string;
  country: string;
  denomination: string;
  rarity: string;
  composition: string;
  diameter: string;
  weight: string;
  mint: string;
}

export const useCoinUpload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<{ file: File; preview: string; uploaded: boolean }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    price: '',
    startingBid: '',
    isAuction: false,
    year: '',
    grade: '',
    condition: '',
    country: '',
    denomination: '',
    rarity: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: ''
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUploadAndAnalyze = useCallback(async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    setUploadProgress(0);
    
    try {
      // Upload first image and analyze
      const mainImage = images[0];
      setUploadProgress(25);
      
      const imageUrl = await uploadImage(mainImage.file);
      setUploadProgress(50);
      
      const base64Image = await convertToBase64(mainImage.file);
      setUploadProgress(75);

      // Update uploaded status
      setImages(prev => prev.map((img, i) => 
        i === 0 ? { ...img, uploaded: true } : img
      ));

      // Run AI analysis
      const result = await aiRecognition.mutateAsync({
        image: base64Image
      });

      setUploadProgress(100);

      if (result.success) {
        setAnalysisResults(result);
        
        // Auto-fill coin data from AI results
        setCoinData(prev => ({
          ...prev,
          title: result.identification.name || '',
          year: result.identification.year?.toString() || '',
          grade: result.grading.grade || '',
          price: result.valuation.current_value?.toString() || '',
          country: result.identification.country || '',
          denomination: result.identification.denomination || '',
          condition: result.grading.condition || '',
          composition: result.specifications?.composition || '',
          mint: result.identification.mint || '',
          rarity: result.rarity || 'common'
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
        rarity: coinData.rarity || 'common',
        country: coinData.country || '',
        denomination: coinData.denomination || '',
        is_auction: coinData.isAuction,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid) || 0 : null,
        condition: coinData.condition,
        composition: coinData.composition,
        mint: coinData.mint
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
    uploadProgress,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    handleUploadAndAnalyze,
    handleSubmitListing,
    removeImage,
    handleCoinDataChange
  };
};
