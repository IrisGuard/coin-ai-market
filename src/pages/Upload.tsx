
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, CheckCircle, Upload as UploadIcon, Sparkles, TrendingUp, Award, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const Upload = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isListing, setIsListing] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      analyzeImage(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      // Enhanced AI analysis with more realistic data
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const mockResult = {
        success: true,
        confidence: 0.96,
        identification: {
          name: "1921 Morgan Silver Dollar",
          year: 1921,
          country: "United States",
          denomination: "Dollar",
          mint: "Philadelphia",
          mintmark: "None",
          series: "Morgan Dollar",
          type: "Silver Dollar"
        },
        grading: {
          condition: "MS-63",
          grade: "Mint State 63",
          details: "Choice Uncirculated with moderate bagmarks",
          pcgs_grade: "MS63",
          surface_quality: "Good"
        },
        valuation: {
          current_value: 42,
          low_estimate: 38,
          high_estimate: 48,
          market_trend: "stable",
          last_sale: 44,
          population: 156000
        },
        specifications: {
          composition: "90% Silver, 10% Copper",
          diameter: "38.1mm",
          weight: "26.73g",
          edge: "Reeded",
          designer: "George T. Morgan"
        },
        rarity: "Common",
        pcgs_number: "7296",
        ngc_number: "2921-P",
        errors: [],
        varieties: []
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete!",
        description: `${mockResult.identification.name} identified with ${(mockResult.confidence * 100).toFixed(1)}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the coin image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const listOnMarketplace = async (listingType: 'sale' | 'auction') => {
    setIsListing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Listed Successfully!",
        description: `Your ${analysisResult.identification.name} has been added to the marketplace`,
      });
      
      navigate('/marketplace');
    } catch (error) {
      toast({
        title: "Listing Failed",
        description: "Unable to list your coin. Please try again.",
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
                        </div>
                        {isAnalyzing && (
                          <div className="flex items-center justify-center gap-3 text-purple-600">
                            <Zap className="w-6 h-6 animate-pulse" />
                            <span className="text-lg font-medium">AI analyzing your coin...</span>
                          </div>
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

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="glass-card border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!analysisResult ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-12 h-12 text-purple-400" />
                      </div>
                      <p className="text-gray-500">Upload a coin image to see AI analysis results</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Confidence Score */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {(analysisResult.confidence * 100).toFixed(1)}% Confidence
                          </div>
                          <div className="text-sm text-gray-600">High accuracy identification</div>
                        </div>
                      </div>

                      {/* Identification */}
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
                            <span className="text-gray-600">Series:</span>
                            <span className="ml-2 font-medium">{analysisResult.identification.series}</span>
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

                      {/* Specifications */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Specifications</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Composition:</span>
                            <span className="ml-1 font-medium">{analysisResult.specifications.composition}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Weight:</span>
                            <span className="ml-1 font-medium">{analysisResult.specifications.weight}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Diameter:</span>
                            <span className="ml-1 font-medium">{analysisResult.specifications.diameter}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Edge:</span>
                            <span className="ml-1 font-medium">{analysisResult.specifications.edge}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4">
                        <Button 
                          onClick={() => listOnMarketplace('sale')} 
                          className="coinvision-button w-full"
                          disabled={isListing}
                        >
                          {isListing ? (
                            <>
                              <Clock className="w-5 h-5 mr-2 animate-spin" />
                              Listing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" />
                              List for Sale - ${analysisResult.valuation.current_value}
                            </>
                          )}
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
