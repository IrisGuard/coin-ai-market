
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, CheckCircle, AlertCircle, Upload as UploadIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
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
      // Simulate AI analysis - In production, this would call the AI recognition API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI results with realistic coin data
      const mockResult = {
        success: true,
        confidence: 0.94,
        identification: {
          name: "Morgan Silver Dollar",
          year: 1921,
          country: "United States",
          denomination: "Dollar",
          mint: "Philadelphia",
          mintage: 44690000
        },
        grading: {
          condition: "AU-50",
          grade: "About Uncirculated 50",
          details: "Light wear on high points, original luster in protected areas"
        },
        valuation: {
          current_value: 32,
          low_estimate: 28,
          high_estimate: 38,
          market_trend: "stable"
        },
        specifications: {
          composition: "90% Silver, 10% Copper",
          diameter: 38.1,
          weight: 26.73,
          edge: "Reeded"
        },
        rarity: "Common",
        pcgs_number: "7296",
        ngc_number: "Not Available"
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete!",
        description: `Coin identified with ${(mockResult.confidence * 100).toFixed(1)}% confidence`,
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

  const listOnMarketplace = () => {
    toast({
      title: "Listed Successfully!",
      description: "Your coin has been added to the marketplace",
    });
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        <div className="max-w-6xl mx-auto container-padding section-spacing relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-6">
              <Sparkles className="w-5 h-5 mr-3 text-brand-primary animate-pulse" />
              <span className="text-sm font-semibold text-brand-primary">AI-Powered Recognition</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold gradient-text mb-6">
              Identify Your Coin
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload a photo and get instant AI-powered identification, grading, and market valuation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-card border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-brand-primary" />
                    Upload Coin Photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {!uploadedImage ? (
                      <div className="border-2 border-dashed border-brand-primary/30 rounded-2xl p-12 text-center bg-gradient-to-br from-brand-primary/5 to-electric-blue/5">
                        <Camera className="w-16 h-16 text-brand-primary mx-auto mb-4" />
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
                          <Button className="brand-button cursor-pointer">
                            <UploadIcon className="w-5 h-5 mr-2" />
                            Choose Image
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage}
                          alt="Uploaded coin"
                          className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
                        />
                        {isAnalyzing && (
                          <div className="flex items-center justify-center gap-3 text-brand-primary">
                            <Zap className="w-6 h-6 animate-pulse" />
                            <span className="text-lg font-medium">Analyzing with AI...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tips */}
                    <div className="bg-gradient-to-r from-electric-blue/10 to-brand-primary/10 rounded-xl p-4">
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
              <Card className="glass-card border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-electric-emerald" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!analysisResult ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Upload a coin image to see AI analysis results</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Confidence Score */}
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-electric-emerald/10 to-electric-teal/10 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-electric-emerald" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {(analysisResult.confidence * 100).toFixed(1)}% Confidence
                          </div>
                          <div className="text-sm text-gray-600">High accuracy identification</div>
                        </div>
                      </div>

                      {/* Identification */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-xl gradient-text">
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
                            <span className="text-gray-600">Mintage:</span>
                            <span className="ml-2 font-medium">{analysisResult.identification.mintage?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Grading */}
                      <div className="p-4 bg-gradient-to-r from-coin-gold/10 to-electric-orange/10 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">Estimated Grade</h4>
                        <div className="text-lg font-bold text-coin-gold">{analysisResult.grading.condition}</div>
                        <div className="text-sm text-gray-600">{analysisResult.grading.details}</div>
                      </div>

                      {/* Valuation */}
                      <div className="p-4 bg-gradient-to-r from-electric-emerald/10 to-electric-teal/10 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-2">Market Valuation</h4>
                        <div className="text-2xl font-bold text-electric-emerald">${analysisResult.valuation.current_value}</div>
                        <div className="text-sm text-gray-600">
                          Range: ${analysisResult.valuation.low_estimate} - ${analysisResult.valuation.high_estimate}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button onClick={listOnMarketplace} className="brand-button flex-1">
                          <Sparkles className="w-5 h-5 mr-2" />
                          List on Marketplace
                        </Button>
                        <Button variant="outline" className="brand-button-outline">
                          Save to Collection
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
