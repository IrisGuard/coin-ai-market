
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadImage } from '@/utils/imageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ImageFile {
  file: File;
  preview: string;
  uploaded: boolean;
  url?: string;
  uploadProgress?: number;
}

interface CoinData {
  title: string;
  description: string;
  price: number;
  startingBid: number;
  isAuction: boolean;
  condition: string;
  year: string;
  country: string;
  denomination: string;
  grade: string;
  rarity: string;
}

export const useCoinUpload = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    price: 0,
    startingBid: 0,
    isAuction: false,
    condition: '',
    year: '',
    country: '',
    denomination: '',
    grade: '',
    rarity: ''
  });

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
    setImages(prev => {
      const newImages = [...prev];
      if (newImages[index]?.preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const handleUploadAndAnalyze = useCallback(async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsAnalyzing(true);
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (!image.uploaded) {
          setUploadProgress((i / images.length) * 100);
          
          const url = await uploadImage(image.file, 'coin-images');
          
          setImages(prev => prev.map((img, idx) => 
            idx === i ? { ...img, uploaded: true, url } : img
          ));
          
          uploadedImages.push(url);
        }
      }
      
      setUploadProgress(100);
      
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysisResults({
          confidence: 0.92,
          coinName: 'Morgan Silver Dollar',
          year: '1921',
          grade: 'MS-63',
          estimatedValue: '$45-65'
        });
        setIsAnalyzing(false);
        toast.success('Analysis completed successfully!');
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
      setIsAnalyzing(false);
    }
  }, [images]);

  const handleSubmitListing = useCallback(async () => {
    if (!user) {
      toast.error('Please log in to create a listing');
      return;
    }

    if (!coinData.title || images.length === 0) {
      toast.error('Please fill in all required fields and upload images');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedImageUrls = images
        .filter(img => img.uploaded && img.url)
        .map(img => img.url);

      const coinDataToInsert = {
        name: coinData.title,
        description: coinData.description,
        price: coinData.isAuction ? coinData.startingBid : coinData.price,
        starting_bid: coinData.isAuction ? coinData.startingBid : null,
        is_auction: coinData.isAuction,
        condition: coinData.condition,
        year: parseInt(coinData.year) || 2024,
        country: coinData.country,
        denomination: coinData.denomination,
        grade: coinData.grade,
        rarity: coinData.rarity,
        image: uploadedImageUrls[0] || '',
        user_id: user.id,
        seller_id: user.id
      };

      const { data, error } = await supabase
        .from('coins')
        .insert([coinDataToInsert])
        .select()
        .single();

      if (error) throw error;

      toast.success('Coin listing created successfully!');
      
      // Reset form
      setCoinData({
        title: '',
        description: '',
        price: 0,
        startingBid: 0,
        isAuction: false,
        condition: '',
        year: '',
        country: '',
        denomination: '',
        grade: '',
        rarity: ''
      });
      setImages([]);
      setAnalysisResults(null);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, coinData, images]);

  return {
    images,
    uploadProgress,
    isAnalyzing,
    analysisResults,
    isSubmitting,
    dragActive,
    coinData,
    setCoinData,
    handleDrag,
    handleDrop,
    removeImage,
    handleUploadAndAnalyze,
    handleSubmitListing,
    handleFiles
  };
};
