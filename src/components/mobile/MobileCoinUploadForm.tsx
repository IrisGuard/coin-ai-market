
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Upload, Zap, Brain, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';
import { useEnhancedCoinRecognition } from '@/hooks/useEnhancedCoinRecognition';
import EnhancedImageUploadZone from '@/components/upload/EnhancedImageUploadZone';
import EnhancedMobileAIUpload from '@/components/mobile/EnhancedMobileAIUpload';
import type { CoinData, UploadedImage } from '@/types/upload';

const MobileCoinUploadForm = () => {
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    year: '',
    grade: '',
    price: '',
    rarity: 'Common',
    country: '',
    denomination: '',
    condition: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: '',
    category: 'modern',
    isAuction: false,
    startingBid: '',
    auctionDuration: '7'
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  
  const { isSubmitting, submitListing } = useCoinSubmission();
  const { 
    performEnhancedAnalysis, 
    performBulkAnalysis,
    isAnalyzing, 
    autoFillData,
    clearResults 
  } = useEnhancedCoinRecognition();

  const handleSubmit = async () => {
    if (!coinData.title) {
      toast({
        title: "Title Required",
        description: "Please enter a coin title",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images Required", 
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    await submitListing(coinData, images);
  };

  const handleInputChange = (field: keyof CoinData, value: string | boolean) => {
    setCoinData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIAnalysis = async () => {
    if (images.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image for AI analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAIAnalyzing(true);
    try {
      console.log('🧠 Starting Enhanced AI Analysis with Auto-Fill...');
      
      let analysisResult;
      
      if (images.length === 1) {
        // Single image analysis
        if (images[0].file) {
          analysisResult = await performEnhancedAnalysis(images[0].file);
        }
      } else {
        // Multi-image bulk analysis
        const imageFiles = images.map(img => img.file).filter(Boolean) as File[];
        const bulkResults = await performBulkAnalysis(imageFiles);
        analysisResult = bulkResults[0]; // Primary result
      }

      if (analysisResult && autoFillData) {
        console.log('🎯 Auto-filling all fields from enhanced AI analysis...');
        
        // Auto-fill ALL fields from AI analysis
        setCoinData(prev => ({
          ...prev,
          title: autoFillData.title || analysisResult.claude_analysis?.name || prev.title,
          description: autoFillData.description || analysisResult.claude_analysis?.description || prev.description,
          year: autoFillData.year || analysisResult.claude_analysis?.year?.toString() || prev.year,
          country: autoFillData.country || analysisResult.claude_analysis?.country || prev.country,
          denomination: autoFillData.denomination || analysisResult.claude_analysis?.denomination || prev.denomination,
          grade: autoFillData.grade || analysisResult.claude_analysis?.grade || prev.grade,
          composition: autoFillData.composition || analysisResult.claude_analysis?.composition || prev.composition,
          rarity: autoFillData.rarity || analysisResult.claude_analysis?.rarity || prev.rarity,
          mint: autoFillData.mint || analysisResult.claude_analysis?.mint || prev.mint,
          diameter: autoFillData.diameter || analysisResult.claude_analysis?.diameter?.toString() || prev.diameter,
          weight: autoFillData.weight || analysisResult.claude_analysis?.weight?.toString() || prev.weight,
          price: autoFillData.price || analysisResult.claude_analysis?.estimated_value?.toString() || prev.price,
          condition: autoFillData.condition || analysisResult.claude_analysis?.grade || prev.condition,
          category: autoFillData.category || determineAICategory(analysisResult) || prev.category
        }));

        setAiAnalysisComplete(true);
        
        toast({
          title: "🎉 AI Analysis Complete!",
          description: `All fields auto-filled with ${Math.round((analysisResult.claude_analysis?.confidence || 0.75) * 100)}% confidence`,
        });
      }
      
    } catch (error: any) {
      console.error('❌ AI Analysis failed:', error);
      toast({
        title: "AI Analysis Failed",
        description: error.message || "Please try again or fill manually",
        variant: "destructive",
      });
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const determineAICategory = (analysisResult: any): string => {
    const claudeData = analysisResult?.claude_analysis;
    if (!claudeData) return 'modern';

    // Enhanced error coin detection
    const name = (claudeData.name || '').toLowerCase();
    const description = (claudeData.description || '').toLowerCase();
    const errors = claudeData.errors || [];
    
    if (errors.length > 0 || 
        name.includes('error') || 
        name.includes('double') || 
        name.includes('die') ||
        description.includes('error')) {
      console.log('🚨 ERROR COIN DETECTED by Enhanced AI!');
      return 'error_coin';
    }

    // Country-based categorization
    const country = (claudeData.country || '').toLowerCase();
    if (country.includes('usa') || country.includes('united states')) return 'american';
    if (country.includes('china') || country.includes('chinese')) return 'asian';
    if (country.includes('britain') || country.includes('england')) return 'british';
    if (country.includes('europe') || country.includes('germany') || country.includes('france')) return 'european';
    
    // Composition-based categorization
    const composition = (claudeData.composition || '').toLowerCase();
    if (composition.includes('gold')) return 'gold';
    if (composition.includes('silver')) return 'silver';
    
    return 'modern';
  };

  const resetForm = () => {
    setCoinData({
      title: '',
      description: '',
      year: '',
      grade: '',
      price: '',
      rarity: 'Common',
      country: '',
      denomination: '',
      condition: '',
      composition: '',
      diameter: '',
      weight: '',
      mint: '',
      category: 'modern',
      isAuction: false,
      startingBid: '',
      auctionDuration: '7'
    });
    setImages([]);
    setAiAnalysisComplete(false);
    clearResults();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            Enhanced Mobile Coin Upload with AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phase 5: Enhanced Mobile AI Upload */}
          <EnhancedMobileAIUpload
            onImagesUploaded={(urls, results) => {
              const uploadedImages = urls.map((url, index) => ({
                url,
                file: null,
                type: index === 0 ? 'front' : index === 1 ? 'back' : 'detail'
              }));
              setImages(uploadedImages);
            }}
            maxImages={10}
            coinData={coinData}
          />

          {/* AI Analysis Section */}
          {images.length > 0 && !aiAnalysisComplete && (
            <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Enhanced AI Analysis Available</h3>
                  <p className="text-gray-600 mb-4">
                    Let AI analyze your {images.length} image{images.length > 1 ? 's' : ''} and auto-fill all fields
                  </p>
                  <Button
                    onClick={handleAIAnalysis}
                    disabled={isAIAnalyzing || isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isAIAnalyzing || isAnalyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze & Auto-Fill with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Status */}
          {aiAnalysisComplete && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">AI Analysis Complete - All fields auto-filled!</span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="ml-auto"
              >
                Reset & Start Over
              </Button>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Coin Title *</Label>
              <Input
                id="title"
                value={coinData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., 1943 Double Die Penny Error"
                className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={coinData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the coin..."
                rows={3}
                className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={coinData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="1943"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>

              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={coinData.grade}
                  onValueChange={(value) => handleInputChange('grade', value)}
                >
                  <SelectTrigger className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Fine">Fine</SelectItem>
                    <SelectItem value="Very Fine">Very Fine</SelectItem>
                    <SelectItem value="Extremely Fine">Extremely Fine</SelectItem>
                    <SelectItem value="About Uncirculated">About Uncirculated</SelectItem>
                    <SelectItem value="Uncirculated">Uncirculated</SelectItem>
                    <SelectItem value="Mint State">Mint State</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={coinData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="United States"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>

              <div>
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  value={coinData.denomination}
                  onChange={(e) => handleInputChange('denomination', e.target.value)}
                  placeholder="1 Cent"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={coinData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error_coin">
                    🚨 Error Coin (Auto-Featured)
                  </SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="european">European</SelectItem>
                  <SelectItem value="ancient">Ancient</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="british">British</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional AI-filled fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="composition">Composition</Label>
                <Input
                  id="composition"
                  value={coinData.composition}
                  onChange={(e) => handleInputChange('composition', e.target.value)}
                  placeholder="Copper"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>

              <div>
                <Label htmlFor="mint">Mint</Label>
                <Input
                  id="mint"
                  value={coinData.mint}
                  onChange={(e) => handleInputChange('mint', e.target.value)}
                  placeholder="Philadelphia"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diameter">Diameter (mm)</Label>
                <Input
                  id="diameter"
                  value={coinData.diameter}
                  onChange={(e) => handleInputChange('diameter', e.target.value)}
                  placeholder="19.05"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  value={coinData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="3.11"
                  className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
                />
              </div>
            </div>

            {/* Auction Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="auction"
                checked={coinData.isAuction}
                onCheckedChange={(checked) => handleInputChange('isAuction', checked)}
              />
              <Label htmlFor="auction">List as Auction</Label>
            </div>

            {/* Price or Starting Bid */}
            <div>
              <Label htmlFor="price">
                {coinData.isAuction ? 'Starting Bid' : 'Price'} ($)
              </Label>
              <Input
                id="price"
                type="number"
                value={coinData.isAuction ? coinData.startingBid : coinData.price}
                onChange={(e) => handleInputChange(
                  coinData.isAuction ? 'startingBid' : 'price', 
                  e.target.value
                )}
                placeholder="0.00"
                className={aiAnalysisComplete ? 'bg-green-50 border-green-300' : ''}
              />
            </div>

            {coinData.isAuction && (
              <div>
                <Label htmlFor="duration">Auction Duration (Days)</Label>
                <Select
                  value={coinData.auctionDuration}
                  onValueChange={(value) => handleInputChange('auctionDuration', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || images.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Creating Enhanced Listing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Create Enhanced Listing ({images.length} images)
                {aiAnalysisComplete && (
                  <Badge className="ml-2 bg-green-500">AI Enhanced</Badge>
                )}
              </>
            )}
          </Button>

          {images.length > 0 && (
            <p className="text-sm text-center text-gray-600">
              Ready to submit with {images.length} permanent image{images.length > 1 ? 's' : ''} 
              {aiAnalysisComplete && ' + Complete AI Analysis'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileCoinUploadForm;
