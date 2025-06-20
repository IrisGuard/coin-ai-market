
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Brain, Zap, CheckCircle, Camera, Sparkles } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';
import { useProductionActivation } from '@/hooks/useProductionActivation';
import { toast } from 'sonner';
import type { UploadedImage, CoinData } from '@/types/upload';

const SimpleDealerPanel = () => {
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

  const { analyzeImages, isAnalyzing, uploadProgress } = useAIAnalysis();
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

  const handleAIAnalysis = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    await analyzeImages(images, updateCoinData, setImages);
  };

  const handleSubmit = async () => {
    const result = await submitListing(coinData, images);
    if (result?.success) {
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
      {/* System Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Production System Active</span>
            </div>
            <Badge variant="default" className="bg-green-600">
              {isActivated ? 'LIVE' : 'ACTIVATING'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Coin Images
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
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Upload Coin Images</p>
              <p className="text-gray-500">Support for up to 10 images</p>
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
              onClick={handleAIAnalysis}
              className="w-full"
              size="lg"
            >
              <Brain className="h-5 w-5 mr-2" />
              AI Analysis & Auto-Fill
            </Button>
          )}

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 animate-spin text-blue-600" />
                <span>AI analyzing images...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coin Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Coin Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={coinData.title}
                onChange={(e) => updateCoinData({ title: e.target.value })}
                placeholder="Coin name and details"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <Input
                value={coinData.year}
                onChange={(e) => updateCoinData({ year: e.target.value })}
                placeholder="Year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                value={coinData.country}
                onChange={(e) => updateCoinData({ country: e.target.value })}
                placeholder="Country of origin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Denomination</label>
              <Input
                value={coinData.denomination}
                onChange={(e) => updateCoinData({ denomination: e.target.value })}
                placeholder="Face value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <Input
                value={coinData.grade}
                onChange={(e) => updateCoinData({ grade: e.target.value })}
                placeholder="Condition grade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <Input
                value={coinData.price}
                onChange={(e) => updateCoinData({ price: e.target.value })}
                placeholder="Selling price"
                type="number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={coinData.description}
              onChange={(e) => updateCoinData({ description: e.target.value })}
              placeholder="Detailed description"
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !coinData.title || images.length === 0}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Zap className="h-5 w-5 mr-2 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Create Listing
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDealerPanel;
