
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import UploadHeader from '@/components/upload/UploadHeader';
import ImageUploadSection from '@/components/upload/ImageUploadSection';
import AnalysisResultsSection from '@/components/upload/AnalysisResultsSection';

const Upload = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isListing, setIsListing] = useState(false);
  const [listingPrice, setListingPrice] = useState('');
  const [listingDescription, setListingDescription] = useState('');
  const [isAuction, setIsAuction] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileName = `${user?.id}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('coin-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('coin-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const analyzeImageWithAI = async (imageBase64: string, imageUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-coin-analysis', {
        body: { 
          image: imageBase64,
          imageUrl: imageUrl
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI Analysis error:', error);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      analyzeImage(file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      toast.info('Uploading image and analyzing with AI...');
      
      // Convert to base64 for AI analysis
      const base64Image = await convertToBase64(file);
      
      // Upload image to Supabase storage
      const imageUrl = await uploadImageToStorage(file);
      
      // Analyze with AI
      const result = await analyzeImageWithAI(base64Image, imageUrl);
      
      setAnalysisResult({
        ...result,
        imageUrl
      });

      // Set suggested price from AI valuation
      if (result.valuation?.current_value) {
        setListingPrice(result.valuation.current_value.toString());
      }

      // Set suggested description
      if (result.identification?.name && result.grading?.condition) {
        setListingDescription(`${result.identification.name} in ${result.grading.condition} condition. ${result.grading?.details || ''}`);
      }
      
      toast.success(`Coin identified: ${result.identification?.name || 'Unknown'}`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze coin. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveCoinToDatabase = async (coinData: any) => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .insert({
          name: coinData.identification?.name || 'Unknown Coin',
          year: coinData.identification?.year || new Date().getFullYear(),
          country: coinData.identification?.country || 'Unknown',
          denomination: coinData.identification?.denomination || '',
          mint: coinData.identification?.mint || '',
          condition: coinData.grading?.condition || 'Good',
          grade: coinData.grading?.grade || coinData.grading?.condition || 'Ungraded',
          price: parseFloat(listingPrice) || coinData.valuation?.current_value || 1,
          description: listingDescription || `${coinData.identification?.name || 'Coin'} - ${coinData.grading?.condition || 'Good condition'}`,
          rarity: coinData.rarity || 'Common',
          composition: coinData.specifications?.composition || '',
          diameter: coinData.specifications?.diameter || null,
          weight: coinData.specifications?.weight || null,
          image: coinData.imageUrl,
          is_auction: isAuction,
          user_id: user?.id,
          seller_id: user?.id,
          starting_bid: isAuction ? parseFloat(listingPrice) : null,
          ai_confidence: coinData.confidence || 0.5,
          pcgs_number: coinData.pcgs_number || null,
          ngc_number: coinData.ngc_number || null,
          featured: false,
          views: 0,
          favorites: 0,
          authentication_status: 'pending',
          ai_provider: 'anthropic-claude'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database save error:', error);
      throw error;
    }
  };

  const listOnMarketplace = async (listingType: 'sale' | 'auction') => {
    if (!analysisResult) return;
    if (!listingPrice || parseFloat(listingPrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsListing(true);
    
    try {
      setIsAuction(listingType === 'auction');
      
      const coinData = await saveCoinToDatabase(analysisResult);
      
      toast.success(`Successfully listed ${analysisResult.identification?.name || 'coin'}!`);
      navigate(`/coin/${coinData.id}`);
    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to list coin. Please try again.');
    } finally {
      setIsListing(false);
    }
  };

  const handleClearImage = () => {
    setUploadedImage('');
    setAnalysisResult(null);
    setImageFile(null);
    setListingPrice('');
    setListingDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <UploadHeader />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ImageUploadSection
              uploadedImage={uploadedImage}
              isAnalyzing={isAnalyzing}
              onImageUpload={handleImageUpload}
              onClearImage={handleClearImage}
            />

            <AnalysisResultsSection
              analysisResult={analysisResult}
              listingPrice={listingPrice}
              listingDescription={listingDescription}
              isListing={isListing}
              onPriceChange={setListingPrice}
              onDescriptionChange={setListingDescription}
              onListForSale={() => listOnMarketplace('sale')}
              onStartAuction={() => listOnMarketplace('auction')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
