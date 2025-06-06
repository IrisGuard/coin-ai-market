
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

interface CoinData {
  title: string;
  description: string;
  price: string;
  condition: string;
  year: string;
  country: string;
  denomination: string;
  mint: string;
  composition: string;
  diameter: string;
  weight: string;
  grade: string;
  rarity: string;
  isAuction: boolean;
  startingBid: string;
  auctionDuration: string;
}

export const useCoinUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    price: '',
    condition: '',
    year: '',
    country: '',
    denomination: '',
    mint: '',
    composition: '',
    diameter: '',
    weight: '',
    grade: '',
    rarity: '',
    isAuction: false,
    startingBid: '',
    auctionDuration: '7'
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const maxImages = 5;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const newImages: UploadedImage[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImage = async (imageData: UploadedImage, index: number): Promise<string> => {
    const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${imageData.file.name.split('.').pop()}`;
    
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, uploading: true, error: undefined } : img
    ));

    try {
      const { data, error } = await supabase.storage
        .from('coin-images')
        .upload(fileName, imageData.file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('coin-images')
        .getPublicUrl(fileName);

      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: false, uploaded: true, url: publicUrl } : img
      ));

      return publicUrl;
    } catch (error: any) {
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: false, error: error.message } : img
      ));
      throw error;
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeImages = async (imageUrls: string[]) => {
    setIsAnalyzing(true);
    try {
      const analysisPromises = imageUrls.map(async (url, index) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], `coin-${index}.jpg`, { type: 'image/jpeg' });
          const base64Image = await convertToBase64(file);

          const { data, error } = await supabase.functions.invoke('ai-coin-analysis', {
            body: { 
              image: base64Image,
              imageUrl: url
            }
          });

          if (error) throw error;
          return { ...data, imageIndex: index };
        } catch (error) {
          console.error(`Analysis failed for image ${index}:`, error);
          return { 
            error: error.message, 
            imageIndex: index,
            confidence: 0,
            identification: { name: 'Unknown' },
            valuation: { current_value: 0 }
          };
        }
      });

      const results = await Promise.all(analysisPromises);
      setAnalysisResults(results);
      
      // Auto-fill coin data from best analysis result
      const bestResult = results.reduce((best, current) => 
        (current.confidence || 0) > (best.confidence || 0) ? current : best
      );

      if (bestResult && bestResult.identification) {
        setCoinData(prev => ({
          ...prev,
          title: bestResult.identification.name || prev.title,
          year: bestResult.identification.year?.toString() || prev.year,
          country: bestResult.identification.country || prev.country,
          denomination: bestResult.identification.denomination || prev.denomination,
          condition: bestResult.grading?.condition || prev.condition,
          grade: bestResult.grading?.grade || prev.grade,
          mint: bestResult.identification.mint || prev.mint,
          composition: bestResult.specifications?.composition || prev.composition,
          diameter: bestResult.specifications?.diameter?.toString() || prev.diameter,
          weight: bestResult.specifications?.weight?.toString() || prev.weight,
          rarity: bestResult.rarity || prev.rarity,
          price: bestResult.valuation?.current_value?.toString() || prev.price
        }));
      }

      toast.success('Images analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze images');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      setUploadProgress(0);
      const imageUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        if (!images[i].uploaded) {
          const url = await uploadImage(images[i], i);
          imageUrls.push(url);
        } else if (images[i].url) {
          imageUrls.push(images[i].url!);
        }
        setUploadProgress(((i + 1) / images.length) * 50);
      }

      setUploadProgress(75);
      await analyzeImages(imageUrls);
      setUploadProgress(100);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload and analyze images');
    }
  };

  const handleSubmitListing = async () => {
    if (!coinData.title || (!coinData.price && !coinData.isAuction) || (!coinData.startingBid && coinData.isAuction)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0 || !images.every(img => img.uploaded)) {
      toast.error('Please upload and analyze images first');
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls = images.map(img => img.url).filter(Boolean) as string[];
      const primaryImageUrl = imageUrls[0];

      const coinRecord = {
        name: coinData.title,
        description: coinData.description,
        price: coinData.isAuction ? null : parseFloat(coinData.price || '0'),
        condition: coinData.condition,
        grade: coinData.grade,
        year: coinData.year ? parseInt(coinData.year) : null,
        country: coinData.country,
        denomination: coinData.denomination,
        mint: coinData.mint,
        composition: coinData.composition,
        diameter: coinData.diameter ? parseFloat(coinData.diameter) : null,
        weight: coinData.weight ? parseFloat(coinData.weight) : null,
        rarity: coinData.rarity || 'Common',
        image: primaryImageUrl,
        user_id: user?.id,
        seller_id: user?.id,
        is_auction: coinData.isAuction,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid || '0') : null,
        auction_end: coinData.isAuction 
          ? new Date(Date.now() + parseInt(coinData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString()
          : null,
        ai_confidence: analysisResults.length > 0 ? analysisResults[0].confidence || 0.5 : null,
        ai_provider: 'anthropic-claude',
        featured: false,
        views: 0,
        favorites: 0,
        authentication_status: 'pending'
      };

      const { data, error } = await supabase
        .from('coins')
        .insert(coinRecord)
        .select()
        .single();

      if (error) throw error;

      toast.success(`Coin listed successfully! ${coinData.isAuction ? 'Auction started.' : 'Available for purchase.'}`);
      navigate(`/coin/${data.id}`);

    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    handleFiles,
    removeImage,
    handleUploadAndAnalyze,
    handleSubmitListing
  };
};
