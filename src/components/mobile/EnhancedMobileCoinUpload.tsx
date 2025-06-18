
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Zap, CheckCircle, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedMobileCameraUploader from '@/components/mobile/EnhancedMobileCameraUploader';
import type { UploadedImage, CoinData, ItemType } from '@/types/upload';

const EnhancedMobileCoinUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coinData, setCoinData] = useState<CoinData>({
    title: '',
    description: '',
    structured_description: '',
    price: '',
    startingBid: '',
    isAuction: false,
    condition: '',
    year: '',
    country: '',
    denomination: '',
    grade: '',
    rarity: '',
    mint: '',
    composition: '',
    diameter: '',
    weight: '',
    auctionDuration: '7',
    category: ''
  });

  const { analyzeImage, isAnalyzing, result: analysisResults } = useRealAICoinRecognition();
  const { submitListing, isSubmitting } = useCoinSubmission();
  const { selectedStoreId, isAdminUser, setSelectedStoreId } = useAdminStore();
  const { user } = useAuth();
  
  // Load real stores data from database
  const { data: dealerStores = [], isLoading: storesLoading } = useDealerStores();

  const handleImagesSelected = (selectedImages: { file: File; preview: string; itemType: ItemType }[]) => {
    const newImages: UploadedImage[] = selectedImages.map(img => ({
      file: img.file,
      preview: img.preview,
      uploaded: false,
      uploading: false
    }));
    setImages(newImages);
  };

  const handleAnalyze = async () => {
    if (!images.length) return;

    try {
      const result = await analyzeImage(images[0].file!);
      
      if (result) {
        // Complete auto-fill with ALL fields including new ones
        setCoinData(prev => ({
          ...prev,
          title: result.name,
          description: result.description || `${result.name} from ${result.year}. Grade: ${result.grade}. Composition: ${result.composition}. ${result.rarity} rarity coin.`,
          structured_description: result.structured_description || `Professional Analysis: ${result.name} (${result.year}) - ${result.grade} grade ${result.composition} coin from ${result.country}. Rarity: ${result.rarity}. Current market estimate: $${result.estimatedValue}. This coin has been professionally analyzed using advanced AI recognition.`,
          year: result.year.toString(),
          country: result.country,
          denomination: result.denomination,
          grade: result.grade,
          rarity: result.rarity,
          mint: result.mint || '',
          composition: result.composition,
          diameter: result.diameter?.toString() || '',
          weight: result.weight?.toString() || '',
          price: result.estimatedValue.toString(),
          condition: result.grade,
          category: result.category || determineCategory(result.country, result.denomination)
        }));

        // Mark images as uploaded and analyzed
        setImages(prev => prev.map(img => ({ ...img, uploaded: true, uploading: false })));
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleSubmit = async () => {
    await submitListing(coinData, images);
  };

  const updateCoinData = (updates: Partial<CoinData>) => {
    setCoinData(prev => ({ ...prev, ...updates }));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const categories = [
    'USA COINS', 'EUROPEAN COINS', 'ANCIENT COINS', 'ERROR COINS',
    'SILVER COINS', 'GOLD COINS', 'COMMEMORATIVE COINS', 'WORLD COINS',
    'RUSSIA COINS', 'CHINESE COINS', 'BRITISH COINS', 'CANADIAN COINS'
  ];

  const determineCategory = (country?: string, denomination?: string): string => {
    if (!country) return 'WORLD COINS';
    
    const countryLower = country.toLowerCase();
    
    if (countryLower.includes('usa') || countryLower.includes('united states')) {
      return 'USA COINS';
    }
    if (countryLower.includes('russia') || countryLower.includes('soviet')) {
      return 'RUSSIA COINS';
    }
    if (countryLower.includes('china') || countryLower.includes('chinese')) {
      return 'CHINESE COINS';
    }
    if (countryLower.includes('britain') || countryLower.includes('england') || countryLower.includes('uk')) {
      return 'BRITISH COINS';
    }
    if (countryLower.includes('canada') || countryLower.includes('canadian')) {
      return 'CANADIAN COINS';
    }
    if (countryLower.includes('europe') || countryLower.includes('germany') || countryLower.includes('france')) {
      return 'EUROPEAN COINS';
    }
    if (denomination && (denomination.toLowerCase().includes('gold') || denomination.toLowerCase().includes('au'))) {
      return 'GOLD COINS';
    }
    if (denomination && (denomination.toLowerCase().includes('silver') || denomination.toLowerCase().includes('ag'))) {
      return 'SILVER COINS';
    }
    
    return 'WORLD COINS';
  };

  const handleComplete = () => {
    // This is called when the enhanced camera completes image capture
    console.log('Enhanced camera capture completed');
  };

  return (
    <div className="space-y-6">
      {/* Store Selection for Admin - using real store data */}
      {isAdminUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              Select Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storesLoading ? (
              <div className="text-center py-4">Loading stores...</div>
            ) : dealerStores.length > 0 ? (
              <Select value={selectedStoreId || ''} onValueChange={setSelectedStoreId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose store for listing" />
                </SelectTrigger>
                <SelectContent>
                  {dealerStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No stores available in database. Create a store first.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Native Mobile Camera Integration */}
      <EnhancedMobileCameraUploader
        onImagesSelected={handleImagesSelected}
        maxImages={5}
        onComplete={handleComplete}
      />

      {/* Enhanced Analysis Results with ALL fields */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Complete AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Coin:</span>
                <p>{analysisResults.name}</p>
              </div>
              <div>
                <span className="font-medium">Year:</span>
                <p>{analysisResults.year}</p>
              </div>
              <div>
                <span className="font-medium">Grade:</span>
                <p>{analysisResults.grade}</p>
              </div>
              <div>
                <span className="font-medium">Value:</span>
                <p>${analysisResults.estimatedValue}</p>
              </div>
              <div>
                <span className="font-medium">Country:</span>
                <p>{analysisResults.country}</p>
              </div>
              <div>
                <span className="font-medium">Composition:</span>
                <p>{analysisResults.composition}</p>
              </div>
              <div>
                <span className="font-medium">Weight:</span>
                <p>{analysisResults.weight}g</p>
              </div>
              <div>
                <span className="font-medium">Diameter:</span>
                <p>{analysisResults.diameter}mm</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="font-medium">Category:</span>
              <p className="text-sm">{analysisResults.category}</p>
            </div>
            <div className="mt-3">
              <span className="font-medium">Structured Description:</span>
              <p className="text-sm">{analysisResults.structured_description}</p>
            </div>
            <Badge variant="outline" className="w-full justify-center">
              Confidence: {Math.round(analysisResults.confidence * 100)}%
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Complete Auto-Fill Listing Form */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Listing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={coinData.title}
              onChange={(e) => updateCoinData({ title: e.target.value })}
              placeholder="Enter coin title"
              className="touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={coinData.category} onValueChange={(value) => updateCoinData({ category: value })}>
              <SelectTrigger className="touch-manipulation" style={{ touchAction: 'manipulation' }}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={coinData.description}
              onChange={(e) => updateCoinData({ description: e.target.value })}
              placeholder="Describe your coin"
              className="h-24 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            />
          </div>

          <div>
            <Label htmlFor="structured-description">Structured Description</Label>
            <Textarea
              id="structured-description"
              value={coinData.structured_description || ''}
              onChange={(e) => updateCoinData({ structured_description: e.target.value })}
              placeholder="Professional structured description from AI analysis"
              className="h-20 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auction-mode">Auction Mode</Label>
            <Switch
              id="auction-mode"
              checked={coinData.isAuction}
              onCheckedChange={(checked) => updateCoinData({ isAuction: checked })}
            />
          </div>

          <div>
            <Label htmlFor="price">
              {coinData.isAuction ? 'Starting Bid *' : 'Price *'}
            </Label>
            <Input
              id="price"
              type="number"
              value={coinData.isAuction ? coinData.startingBid : coinData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (coinData.isAuction) {
                  updateCoinData({ startingBid: value });
                } else {
                  updateCoinData({ price: value });
                }
              }}
              placeholder="Enter amount in USD"
              className="touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            />
          </div>

          {/* Complete auto-fill fields grid with weight and diameter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={coinData.year}
                onChange={(e) => updateCoinData({ year: e.target.value })}
                placeholder="e.g. 1921"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={coinData.grade}
                onChange={(e) => updateCoinData({ grade: e.target.value })}
                placeholder="e.g. MS-63"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={coinData.country}
                onChange={(e) => updateCoinData({ country: e.target.value })}
                placeholder="e.g. United States"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="composition">Composition</Label>
              <Input
                id="composition"
                value={coinData.composition}
                onChange={(e) => updateCoinData({ composition: e.target.value })}
                placeholder="e.g. Silver"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (g)</Label>
              <Input
                id="weight"
                value={coinData.weight}
                onChange={(e) => updateCoinData({ weight: e.target.value })}
                placeholder="e.g. 26.73"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="diameter">Diameter (mm)</Label>
              <Input
                id="diameter"
                value={coinData.diameter}
                onChange={(e) => updateCoinData({ diameter: e.target.value })}
                placeholder="e.g. 38.1"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="mint">Mint</Label>
              <Input
                id="mint"
                value={coinData.mint}
                onChange={(e) => updateCoinData({ mint: e.target.value })}
                placeholder="e.g. Philadelphia"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <div>
              <Label htmlFor="rarity">Rarity</Label>
              <Input
                id="rarity"
                value={coinData.rarity}
                onChange={(e) => updateCoinData({ rarity: e.target.value })}
                placeholder="e.g. Common, Rare"
                className="touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              !coinData.title || 
              (!coinData.price && !coinData.isAuction) || 
              (!coinData.startingBid && coinData.isAuction) ||
              images.length === 0 || 
              !images.every(img => img.uploaded) ||
              isSubmitting
            }
            className="w-full bg-green-600 hover:bg-green-700 py-4 touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            {isSubmitting ? 'Creating Complete Listing...' : 'Create Complete Listing'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMobileCoinUpload;
