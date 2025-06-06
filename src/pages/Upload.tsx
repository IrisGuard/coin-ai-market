
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, CheckCircle, Upload as UploadIcon, Sparkles, TrendingUp, Award, DollarSign, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

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
      navigate(`/coin-details/${coinData.id}`);
    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to list coin. Please try again.');
    } finally {
      setIsListing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-purple-200 mb-6">
              <Sparkles className="w-5 h-5 mr-3 text-purple-600 animate-pulse" />
              <span className="text-sm font-semibold text-purple-600">AI-Powered Recognition</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold gradient-text mb-6">
              Identify Your Coin
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload a photo and get instant professional identification, grading, and market valuation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-card border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-purple-600" />
                    Upload Coin Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {!uploadedImage ? (
                      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-12 text-center bg-gradient-to-br from-purple-50 to-blue-50">
                        <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Take or Upload Photo
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Capture both sides of your coin for best results
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="coin-upload"
                        />
                        <label htmlFor="coin-upload">
                          <Button className="coinvision-button cursor-pointer">
                            <UploadIcon className="w-5 h-5 mr-2" />
                            Choose Image
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`relative rounded-2xl overflow-hidden ${isAnalyzing ? 'ai-scanning' : ''}`}>
                          <img
                            src={uploadedImage}
                            alt="Uploaded coin"
                            className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
                          />
                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                                <span className="font-semibold text-purple-600">Analyzing with AI...</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedImage('');
                            setAnalysisResult(null);
                            setImageFile(null);
                            setListingPrice('');
                            setListingDescription('');
                          }}
                          className="w-full"
                        >
                          Upload Different Image
                        </Button>
                      </div>
                    )}

                    {/* AI Tips */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Photography Tips
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use good lighting, avoid shadows</li>
                        <li>• Keep camera steady and focused</li>
                        <li>• Capture the entire coin clearly</li>
                        <li>• Take photos of both sides if possible</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {analysisResult ? (
                <div className="space-y-6">
                  <Card className="glass-card border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-3 text-green-700">
                          <CheckCircle className="w-6 h-6" />
                          Analysis Complete
                        </span>
                        <Badge className="bg-green-600 text-white">
                          {((analysisResult.confidence || 0.5) * 100).toFixed(1)}% Confidence
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Identification */}
                      <div>
                        <h3 className="text-2xl font-bold gradient-text mb-4">
                          {analysisResult.identification?.name || 'Unknown Coin'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Year:</span>
                            <span className="ml-2 font-semibold">{analysisResult.identification?.year || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Country:</span>
                            <span className="ml-2 font-semibold">{analysisResult.identification?.country || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Denomination:</span>
                            <span className="ml-2 font-semibold">{analysisResult.identification?.denomination || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Mint:</span>
                            <span className="ml-2 font-semibold">{analysisResult.identification?.mint || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Grading */}
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-yellow-600" />
                          Professional Grade
                        </h4>
                        <div className="text-lg font-bold text-yellow-700">
                          {analysisResult.grading?.condition || analysisResult.grading?.grade || 'Good'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {analysisResult.grading?.details || 'Professional grading assessment'}
                        </div>
                      </div>

                      {/* Valuation */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          Market Valuation
                        </h4>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          ${analysisResult.valuation?.current_value || '0'}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Range: ${analysisResult.valuation?.low_estimate || '0'} - ${analysisResult.valuation?.high_estimate || '0'}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {analysisResult.valuation?.market_trend || 'Stable'}
                        </Badge>
                      </div>

                      {/* Listing Section */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">List on Marketplace</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your Price ($) *
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter your listing price"
                              value={listingPrice}
                              onChange={(e) => setListingPrice(e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <Textarea
                              placeholder="Add any additional details about your coin..."
                              value={listingDescription}
                              onChange={(e) => setListingDescription(e.target.value)}
                              className="w-full"
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Button
                              onClick={() => listOnMarketplace('sale')}
                              disabled={isListing || !listingPrice}
                              className="coinvision-button w-full"
                            >
                              {isListing ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                              )}
                              List for Sale
                            </Button>
                            
                            <Button
                              onClick={() => listOnMarketplace('auction')}
                              disabled={isListing || !listingPrice}
                              variant="outline"
                              className="coinvision-button-outline w-full"
                            >
                              {isListing ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : (
                                <Clock className="w-4 h-4 mr-2" />
                              )}
                              Start Auction
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="glass-card border-2 border-gray-200">
                  <CardContent className="text-center py-16">
                    <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Ready for Analysis
                    </h3>
                    <p className="text-gray-600">
                      Upload a coin image to get started with AI-powered identification
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
