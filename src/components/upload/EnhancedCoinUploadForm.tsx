
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Zap, Loader2, DollarSign, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AdvancedImageUpload from './AdvancedImageUpload';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';

interface ProcessedImage {
  file: File;
  preview: string;
  validation: any;
  isProcessing: boolean;
  aiResult?: any;
}

interface CoinFormData {
  title: string;
  description: string;
  category: string;
  year: string;
  country: string;
  denomination: string;
  grade: string;
  composition: string;
  diameter: string;
  weight: string;
  mint: string;
  rarity: string;
  price: string;
  isAuction: boolean;
  startingBid: string;
  auctionDuration: string;
}

const coinCategories = [
  { value: 'ancient', label: 'Ancient Coins' },
  { value: 'modern', label: 'Modern Coins' },
  { value: 'error_coin', label: 'Error Coins' },
  { value: 'american', label: 'American Coins' },
  { value: 'european', label: 'European Coins' },
  { value: 'asian', label: 'Asian Coins' },
  { value: 'gold', label: 'Gold Coins' },
  { value: 'silver', label: 'Silver Coins' },
  { value: 'british', label: 'British Coins' },
  { value: 'greek', label: 'Greek Coins' },
  { value: 'commemorative', label: 'Commemorative' },
  { value: 'unclassified', label: 'Other' }
];

const EnhancedCoinUploadForm: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [formData, setFormData] = useState<CoinFormData>({
    title: '',
    description: '',
    category: '',
    year: '',
    country: '',
    denomination: '',
    grade: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: '',
    rarity: '',
    price: '',
    isAuction: false,
    startingBid: '',
    auctionDuration: '7'
  });
  const [aiResults, setAiResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { analyzeImage } = useRealAICoinRecognition();
  const { isSubmitting, submitListing } = useCoinSubmission();

  const handleImagesProcessed = (processedImages: ProcessedImage[]) => {
    setImages(processedImages);
  };

  const handleAIAnalysis = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image first');
      return;
    }

    const validImages = images.filter(img => img.validation.isValid);
    if (validImages.length === 0) {
      toast.error('Please upload at least one valid image');
      return;
    }

    setIsAnalyzing(true);
    try {
      const primaryImage = validImages[0];
      const result = await analyzeImage(primaryImage.file);
      
      if (result) {
        setAiResults(result);
        
        // Auto-fill form with AI results
        setFormData(prev => ({
          ...prev,
          title: result.name || prev.title,
          year: result.year?.toString() || prev.year,
          country: result.country || prev.country,
          denomination: result.denomination || prev.denomination,
          grade: result.grade || prev.grade,
          composition: result.composition || prev.composition,
          rarity: result.rarity || prev.rarity,
          price: result.estimatedValue?.toString() || prev.price,
          category: mapAICategoryToForm(result.category) || prev.category,
          diameter: result.diameter?.toString() || prev.diameter,
          weight: result.weight?.toString() || prev.weight,
          mint: result.mint || prev.mint
        }));

        toast.success(`AI Analysis Complete! Confidence: ${Math.round(result.confidence * 100)}%`);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error('AI analysis failed. Please fill in details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mapAICategoryToForm = (aiCategory: string): string => {
    const mapping: { [key: string]: string } = {
      'ancient': 'ancient',
      'modern': 'modern',
      'error': 'error_coin',
      'american': 'american',
      'european': 'european',
      'asian': 'asian',
      'gold': 'gold',
      'silver': 'silver',
      'british': 'british',
      'greek': 'greek',
      'commemorative': 'commemorative'
    };
    
    return mapping[aiCategory?.toLowerCase()] || 'unclassified';
  };

  const handleSubmit = async () => {
    const validImages = images.filter(img => img.validation.isValid);
    
    if (validImages.length === 0) {
      toast.error('Please upload at least one valid image');
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error('Please fill in the required fields');
      return;
    }

    if (!formData.isAuction && !formData.price) {
      toast.error('Please set a price for direct sale');
      return;
    }

    if (formData.isAuction && !formData.startingBid) {
      toast.error('Please set a starting bid for auction');
      return;
    }

    try {
      // Convert ProcessedImage to UploadedImage format for submission
      const uploadedImages = validImages.map(img => ({
        file: img.file,
        preview: img.preview,
        uploaded: true,
        uploading: false,
        url: img.preview
      }));

      const coinData = {
        title: formData.title,
        description: formData.description,
        price: formData.isAuction ? '' : formData.price,
        startingBid: formData.isAuction ? formData.startingBid : '',
        isAuction: formData.isAuction,
        condition: formData.grade,
        year: formData.year,
        country: formData.country,
        denomination: formData.denomination,
        grade: formData.grade,
        rarity: formData.rarity,
        mint: formData.mint,
        composition: formData.composition,
        diameter: formData.diameter,
        weight: formData.weight,
        auctionDuration: formData.auctionDuration
      };

      await submitListing(coinData, uploadedImages);
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error('Failed to submit listing');
    }
  };

  const validImages = images.filter(img => img.validation.isValid);
  const canAnalyze = validImages.length > 0 && !isAnalyzing;
  const canSubmit = validImages.length > 0 && formData.title && formData.category && !isSubmitting;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Image Upload Section */}
      <AdvancedImageUpload
        onImagesProcessed={handleImagesProcessed}
        maxImages={10}
      />

      {/* AI Analysis Section */}
      {validImages.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600" />
              AI Coin Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Analyze your coin images with advanced AI to automatically identify and value your coin.
              </p>
              <Button
                onClick={handleAIAnalysis}
                disabled={!canAnalyze}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>

            {/* AI Results Display */}
            {aiResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
              >
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  AI Analysis Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Coin Identification</p>
                    <p className="text-gray-900">{aiResults.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Year</p>
                    <p className="text-gray-900">{aiResults.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Grade</p>
                    <p className="text-gray-900">{aiResults.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Country</p>
                    <p className="text-gray-900">{aiResults.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Estimated Value</p>
                    <p className="text-gray-900 font-semibold">${aiResults.estimatedValue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Confidence</p>
                    <Badge variant="outline" className="font-semibold">
                      {Math.round(aiResults.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Coin Details Form */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            Listing Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Coin Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., 1921 Morgan Silver Dollar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {coinCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the condition, history, and unique features of your coin..."
              className="h-24"
            />
          </div>

          {/* Coin Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="e.g., 1921"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                placeholder="e.g., United States"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="denomination">Denomination</Label>
              <Input
                id="denomination"
                value={formData.denomination}
                onChange={(e) => setFormData(prev => ({ ...prev, denomination: e.target.value }))}
                placeholder="e.g., Dollar, Cent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                placeholder="e.g., MS-65, AU-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="composition">Composition</Label>
              <Input
                id="composition"
                value={formData.composition}
                onChange={(e) => setFormData(prev => ({ ...prev, composition: e.target.value }))}
                placeholder="e.g., 90% Silver"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rarity">Rarity</Label>
              <Input
                id="rarity"
                value={formData.rarity}
                onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value }))}
                placeholder="e.g., Common, Rare"
              />
            </div>
          </div>

          {/* Listing Type */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auction-mode">Auction Mode</Label>
              <Switch
                id="auction-mode"
                checked={formData.isAuction}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAuction: checked }))}
              />
            </div>

            {formData.isAuction ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingBid">Starting Bid (USD) *</Label>
                  <Input
                    id="startingBid"
                    type="number"
                    step="0.01"
                    value={formData.startingBid}
                    onChange={(e) => setFormData(prev => ({ ...prev, startingBid: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auctionDuration">Duration (days)</Label>
                  <Select value={formData.auctionDuration} onValueChange={(value) => setFormData(prev => ({ ...prev, auctionDuration: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                {formData.isAuction ? (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Start Auction
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Create Listing
                  </>
                )}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCoinUploadForm;
