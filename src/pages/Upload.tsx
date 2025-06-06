
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, CheckCircle, Upload as UploadIcon, Sparkles, TrendingUp, Award, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils } from '@/utils/securityUtils';
import { SessionSecurity } from '@/lib/securityEnhancements';
import Navbar from '@/components/Navbar';

const Upload = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isListing, setIsListing] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Validate session security
  React.useEffect(() => {
    if (!SessionSecurity.validateSession()) {
      toast({
        title: "Security Warning",
        description: "Session validation failed. Please log in again.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Security validation
    const fileValidation = SecurityUtils.validateFileUpload(file);
    if (!fileValidation.isValid) {
      setUploadError(fileValidation.error!);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      analyzeImage(result, file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string, file: File) => {
    setIsAnalyzing(true);
    setUploadError('');
    
    try {
      let imageUrl = '';
      
      if (file) {
        // Upload image to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('coin-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('coin-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Call the AI analysis edge function
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch('/supabase/functions/v1/ai-coin-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token}`
        },
        body: JSON.stringify({ 
          image: imageData,
          imageUrl: imageUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult({
        ...result,
        imageUrl: imageUrl
      });
      
      toast({
        title: "Analysis Complete!",
        description: `${result.identification.name} identified with ${(result.confidence * 100).toFixed(1)}% confidence`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      setUploadError(error.message || "Unable to analyze the coin image. Please try again.");
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze the coin image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const listOnMarketplace = async (listingType: 'sale' | 'auction') => {
    if (!analysisResult || !user) return;
    
    setIsListing(true);
    
    try {
      const coinData = {
        name: analysisResult.identification.name,
        year: analysisResult.identification.year,
        country: analysisResult.identification.country || 'Unknown',
        denomination: analysisResult.identification.denomination,
        mint: analysisResult.identification.mint,
        grade: analysisResult.grading.condition,
        rarity: analysisResult.rarity || 'Common',
        condition: analysisResult.grading.grade,
        price: parseFloat(analysisResult.valuation.current_value) || 1.00,
        image: analysisResult.imageUrl || uploadedImage,
        description: `${analysisResult.identification.name} - ${analysisResult.grading.details}`,
        composition: analysisResult.specifications.composition,
        diameter: parseFloat(analysisResult.specifications.diameter) || null,
        weight: parseFloat(analysisResult.specifications.weight) || null,
        is_auction: listingType === 'auction',
        auction_end: listingType === 'auction' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        user_id: user.id,
        authentication_status: 'pending',
        pcgs_number: analysisResult.pcgs_number || null,
        ngc_number: analysisResult.ngc_number || null,
        ai_confidence: analysisResult.confidence || 0.5,
        ai_provider: 'anthropic-claude'
      };

      const { data, error } = await supabase
        .from('coins')
        .insert(coinData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Listed Successfully!",
        description: `Your ${analysisResult.identification.name} has been added to the marketplace`,
      });
      
      navigate(`/coin-details/${data.id}`);
    } catch (error) {
      console.error('Listing error:', error);
      toast({
        title: "Listing Failed",
        description: error.message || "Unable to list your coin. Please try again.",
        variant: "destructive",
      });
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
          {/* Header */}
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
                    {uploadError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}

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
                              <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="font-semibold">Analyzing with AI...</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {!isAnalyzing && !analysisResult && (
                          <Button 
                            onClick={() => analyzeImage(uploadedImage, null)}
                            className="w-full coinvision-button"
                          >
                            <Zap className="w-5 h-5 mr-2" />
                            Analyze Coin
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Tips */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Tips for Best Results:</h4>
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

            {/* Analysis Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {analysisResult ? (
                <Card className="glass-card border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="w-6 h-6" />
                      Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Confidence Score */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {(analysisResult.confidence * 100).toFixed(1)}% Confidence
                        </div>
                        <div className="text-sm text-gray-600">AI identification accuracy</div>
                      </div>
                    </div>

                    {/* Identification Details */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-2xl gradient-text">
                        {analysisResult.identification.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Year:</span>
                          <span className="ml-2 font-medium">{analysisResult.identification.year}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Country:</span>
                          <span className="ml-2 font-medium">{analysisResult.identification.country}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mint:</span>
                          <span className="ml-2 font-medium">{analysisResult.identification.mint}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Denomination:</span>
                          <span className="ml-2 font-medium">{analysisResult.identification.denomination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Grading */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-gray-800">Professional Grade</h4>
                      </div>
                      <div className="text-lg font-bold text-yellow-700">{analysisResult.grading.condition}</div>
                      <div className="text-sm text-gray-600">{analysisResult.grading.details}</div>
                    </div>

                    {/* Valuation */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-800">Market Valuation</h4>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">${analysisResult.valuation.current_value}</div>
                      <div className="text-sm text-gray-600 mb-2">
                        Range: ${analysisResult.valuation.low_estimate} - ${analysisResult.valuation.high_estimate}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {analysisResult.valuation.market_trend}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button 
                        onClick={() => listOnMarketplace('sale')} 
                        className="coinvision-button w-full"
                        disabled={isListing}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        List for Sale - ${analysisResult.valuation.current_value}
                      </Button>
                      <Button 
                        onClick={() => listOnMarketplace('auction')} 
                        variant="outline" 
                        className="coinvision-button-outline w-full"
                        disabled={isListing}
                      >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Start Auction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card border-2 border-gray-200">
                  <CardContent className="p-12 text-center">
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
