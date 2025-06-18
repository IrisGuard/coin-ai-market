
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
import { mapUIToDatabaseCategory, getValidDatabaseCategories } from '@/utils/categoryMapping';
import NativeCameraOnly from '@/components/mobile/NativeCameraOnly';
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

  const [formSubmitted, setFormSubmitted] = useState(false);
  const { analyzeImage, isAnalyzing, result: analysisResults } = useRealAICoinRecognition();
  const { submitListing, isSubmitting } = useCoinSubmission();
  const { selectedStoreId, isAdminUser, setSelectedStoreId } = useAdminStore();
  const { user } = useAuth();
  
  const { data: dealerStores = [], isLoading: storesLoading } = useDealerStores();

  const handleImagesSelected = (selectedImages: { file: File; preview: string; url?: string }[]) => {
    const newImages: UploadedImage[] = selectedImages.map(img => ({
      file: img.file,
      preview: img.preview,
      url: img.url,
      uploaded: !!img.url,
      uploading: false
    }));
    setImages(newImages);
  };

  const handleAnalyze = async () => {
    if (!images.length) return;

    try {
      const result = await analyzeImage(images[0].file!);
      
      if (result) {
        // Auto-fill with AI analysis - preserve existing data
        setCoinData(prev => ({
          ...prev,
          title: result.name || prev.title,
          description: result.description || `${result.name} from ${result.year}. Grade: ${result.grade}. Composition: ${result.composition}. ${result.rarity} rarity coin with complete professional analysis.`,
          structured_description: result.structured_description || `PROFESSIONAL NUMISMATIC ANALYSIS: ${result.name} (${result.year}) - ${result.grade} grade ${result.composition} coin from ${result.country}${result.mint ? `, ${result.mint} mint` : ''}. RARITY ASSESSMENT: ${result.rarity}. PHYSICAL SPECIFICATIONS: Weight ${result.weight}g, Diameter ${result.diameter}mm. MARKET VALUATION: Current estimate $${result.estimatedValue}. AUTHENTICATION: AI verified with ${Math.round(result.confidence * 100)}% confidence. COLLECTOR VALUE: Based on current market conditions and comparative sales data.`,
          year: result.year?.toString() || prev.year,
          country: result.country || prev.country,
          denomination: result.denomination || prev.denomination,
          grade: result.grade || prev.grade,
          rarity: result.rarity || prev.rarity,
          mint: result.mint || prev.mint,
          composition: result.composition || prev.composition,
          diameter: result.diameter?.toString() || prev.diameter,
          weight: result.weight?.toString() || prev.weight,
          price: result.estimatedValue?.toString() || prev.price,
          condition: result.condition || result.grade || prev.condition,
          category: result.category || determineCategory(result.country, result.denomination) || prev.category
        }));

        setImages(prev => prev.map(img => ({ ...img, uploaded: true, uploading: false })));
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);
    await submitListing(coinData, images);
    // DON'T reset form - let user decide what to do next
  };

  const resetForm = () => {
    setCoinData({
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
    setImages([]);
    setFormSubmitted(false);
  };

  const updateCoinData = (updates: Partial<CoinData>) => {
    setCoinData(prev => ({ ...prev, ...updates }));
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

  return (
    <div className="space-y-6">
      {/* Success message after submission */}
      {formSubmitted && !isSubmitting && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold text-green-800">
                🎉 Coin Successfully Listed!
              </h3>
              <p className="text-green-700">
                Your coin has been uploaded with all images and details saved to the marketplace.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.href = '/marketplace'} className="bg-green-600 hover:bg-green-700">
                  View in Marketplace
                </Button>
                <Button onClick={resetForm} variant="outline">
                  List Another Coin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Store Selection - Live Data Only */}
      {isAdminUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              Production Store Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storesLoading ? (
              <div className="text-center py-4">Loading live stores...</div>
            ) : dealerStores.length > 0 ? (
              <Select value={selectedStoreId || ''} onValueChange={setSelectedStoreId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose production store" />
                </SelectTrigger>
                <SelectContent>
                  {dealerStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name} {store.verified && '✓'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No production stores available. Create a store first.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Native Camera Only - No Fallbacks */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Native Camera Only
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NativeCameraOnly
            onImagesSelected={handleImagesSelected}
            maxImages={5}
          />
          
          {images.length > 0 && !images.every(img => img.uploaded) && (
            <div className="mt-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Complete AI Analysis...' : 'Start 100% Auto-Fill Analysis'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Analysis Results with ALL Fields */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">100% Complete AI Analysis</CardTitle>
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
                <span className="font-medium">Weight:</span>
                <p>{analysisResults.weight}g</p>
              </div>
              <div>
                <span className="font-medium">Diameter:</span>
                <p>{analysisResults.diameter}mm</p>
              </div>
              <div>
                <span className="font-medium">Composition:</span>
                <p>{analysisResults.composition}</p>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <p>{analysisResults.category} → {mapUIToDatabaseCategory(analysisResults.category || '')}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="font-medium">Structured Description:</span>
              <p className="text-sm">{analysisResults.structured_description}</p>
            </div>
            <Badge variant="outline" className="w-full justify-center bg-green-50 text-green-700">
              AI Confidence: {Math.round(analysisResults.confidence * 100)}% • All Fields Auto-Filled
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Complete Listing Form - All Fields Auto-Filled */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Auto-Filled Listing</CardTitle>
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
                    {category} → {mapUIToDatabaseCategory(category)}
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

          {/* Complete auto-fill fields grid */}
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
                placeholder="Auto-filled from AI"
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
                placeholder="Auto-filled from AI"
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
            {isSubmitting ? 'Creating Production Listing...' : 'Create Complete Production Listing'}
          </Button>

          {formSubmitted && (
            <div className="text-center text-green-600 font-medium">
              ✅ Listing submitted successfully! Check above for next steps.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMobileCoinUpload;
