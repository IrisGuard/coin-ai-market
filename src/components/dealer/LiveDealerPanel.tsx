
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Brain, Zap, CheckCircle, Camera, Sparkles, Activity } from 'lucide-react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';
import { useProductionActivation } from '@/hooks/useProductionActivation';
import { toast } from 'sonner';
import type { UploadedImage, CoinData } from '@/types/upload';

const LiveDealerPanel = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    year: '',
    country: '',
    denomination: '',
    grade: '',
    composition: '',
    rarity: '',
    mint: '',
    diameter: '',
    weight: '',
    price: '',
    condition: '',
    category: 'WORLD COINS'
  });

  const { analyzeImage, isAnalyzing, result } = useRealAICoinRecognition();
  const { submitListing, isSubmitting } = useCoinSubmission();
  const { isActivated } = useProductionActivation();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages: UploadedImage[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      uploaded: false,
      uploading: false
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const updateCoinData = (data: Partial<CoinData>) => {
    setCoinData(prev => ({ ...prev, ...data }));
  };

  const handleLiveAIAnalysis = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image for live AI analysis');
      return;
    }

    toast.info('🚀 Starting LIVE Production AI Analysis...');
    
    for (const image of images) {
      const analysisResult = await analyzeImage(image.file);
      if (analysisResult) {
        updateCoinData({
          title: analysisResult.name,
          year: analysisResult.year.toString(),
          country: analysisResult.country,
          denomination: analysisResult.denomination,
          grade: analysisResult.grade,
          composition: analysisResult.composition,
          rarity: analysisResult.rarity,
          mint: analysisResult.mint,
          diameter: analysisResult.diameter?.toString(),
          weight: analysisResult.weight?.toString(),
          price: analysisResult.estimatedValue.toString(),
          description: analysisResult.description,
          condition: analysisResult.condition,
          category: analysisResult.category as any
        });
        break; // Use first successful analysis
      }
    }
  };

  const handleLiveSubmit = async () => {
    const result = await submitListing(coinData, images);
    if (result?.success) {
      toast.success('🚀 Coin published to LIVE marketplace successfully!');
      // Reset form
      setImages([]);
      setCoinData({
        title: '',
        description: '',
        year: '',
        country: '',
        denomination: '',
        grade: '',
        composition: '',
        rarity: '',
        mint: '',
        diameter: '',
        weight: '',
        price: '',
        condition: '',
        category: 'WORLD COINS'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Live Production Status */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600 animate-pulse" />
              <span className="font-medium">🚀 LIVE PRODUCTION DEALER PANEL</span>
            </div>
            <Badge variant="default" className="bg-green-600">
              🔴 LIVE OPERATIONAL
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            AI Brain connected • Real-time analysis • Live marketplace integration • Production data processing
          </p>
        </CardContent>
      </Card>

      {/* Live Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Coin Images - LIVE Production AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="live-image-upload"
            />
            <label htmlFor="live-image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Upload Coin Images for LIVE Analysis</p>
              <p className="text-gray-500">Production AI will auto-analyze and fill details instantly</p>
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt="Coin"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  {image.uploaded && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-600 bg-white rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && !isAnalyzing && (
            <Button 
              onClick={handleLiveAIAnalysis}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <Brain className="h-5 w-5 mr-2" />
              🚀 LIVE PRODUCTION AI Analysis & Auto-Fill
            </Button>
          )}

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 animate-spin text-blue-600" />
                <span>🧠 LIVE Production AI analyzing images...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 w-full animate-pulse"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Coin Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Coin Information - LIVE Production Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={coinData.title}
                onChange={(e) => updateCoinData({ title: e.target.value })}
                placeholder="Live AI will auto-fill from production analysis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <Input
                value={coinData.year}
                onChange={(e) => updateCoinData({ year: e.target.value })}
                placeholder="Auto-detected by production AI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                value={coinData.country}
                onChange={(e) => updateCoinData({ country: e.target.value })}
                placeholder="Live AI will identify origin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Denomination</label>
              <Input
                value={coinData.denomination}
                onChange={(e) => updateCoinData({ denomination: e.target.value })}
                placeholder="Auto-filled by production AI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <Input
                value={coinData.grade}
                onChange={(e) => updateCoinData({ grade: e.target.value })}
                placeholder="Live AI condition assessment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <Input
                value={coinData.price}
                onChange={(e) => updateCoinData({ price: e.target.value })}
                placeholder="Live production market value"
                type="number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={coinData.description}
              onChange={(e) => updateCoinData({ description: e.target.value })}
              placeholder="Production AI will generate detailed description"
              rows={4}
            />
          </div>

          <Button 
            onClick={handleLiveSubmit}
            disabled={isSubmitting || !coinData.title || images.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Zap className="h-5 w-5 mr-2 animate-spin" />
                Publishing to LIVE Production Marketplace...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                🚀 Publish to LIVE Production Marketplace
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveDealerPanel;
