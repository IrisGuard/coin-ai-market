
import React, { useState } from 'react';
import { useCreateCoin } from '@/hooks/useCoins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, Loader2, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import NativeCameraOnly from '@/components/mobile/NativeCameraOnly';

const coinCategories = [
  'Ancient',
  'Modern', 
  'Error',
  'Graded',
  'European',
  'American',
  'Asian',
  'Gold',
  'Silver',
  'Rare'
];

const CoinUploadForm = () => {
  const createCoin = useCreateCoin();
  const aiRecognition = useRealAICoinRecognition();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    year: '',
    grade: '',
    price: '',
    rarity: '',
    image: '',
    country: '',
    denomination: '',
    description: '',
    condition: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: '',
    category: '',
    listingType: 'direct_sale',
    auctionDuration: '7'
  });

  // Check if device is mobile
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleAIAnalysis = async (imageFile: File) => {
    try {
      const result = await aiRecognition.analyzeImage(imageFile);

      if (result) {
        setFormData(prev => ({
          ...prev,
          name: result.name || '',
          year: result.year?.toString() || '',
          grade: result.grade || '',
          rarity: result.rarity || '',
          country: result.country || '',
          denomination: result.denomination || '',
          condition: result.grade || '',
          composition: result.composition || '',
          diameter: result.diameter?.toString() || '',
          weight: result.weight?.toString() || '',
          mint: result.mint || '',
          price: result.estimatedValue?.toString() || '',
          description: `${result.name} from ${result.year}. AI analyzed with ${Math.round(result.confidence * 100)}% confidence.`.trim()
        }));

        toast({
          title: "AI Analysis Complete!",
          description: `${result.name} identified with ${Math.round(result.confidence * 100)}% confidence`,
        });
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to analyze the coin image. Please fill in the details manually.",
        variant: "destructive",
      });
    }
  };

  const handleNativeCameraImagesSelected = async (images: { file: File; preview: string }[]) => {
    if (images.length === 0) return;

    const primaryImage = images[0];
    setImagePreview(primaryImage.preview);
    setFormData(prev => ({ ...prev, image: primaryImage.preview }));

    await handleAIAnalysis(primaryImage.file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isAuction = formData.listingType === 'auction';
    
    const coinData = {
      name: formData.name,
      year: parseInt(formData.year) || new Date().getFullYear(),
      grade: formData.grade,
      price: parseFloat(formData.price) || 0,
      rarity: formData.rarity,
      image: formData.image,
      country: formData.country,
      denomination: formData.denomination,
      description: formData.description,
      category: formData.category,
      is_auction: isAuction,
      listing_type: formData.listingType,
      auction_end: isAuction ? new Date(Date.now() + parseInt(formData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString() : null,
      starting_bid: isAuction ? parseFloat(formData.price) || 0 : null,
    };
    
    createCoin.mutate(coinData, {
      onSuccess: () => {
        // Redirect based on listing type
        if (isAuction) {
          navigate('/auctions');
        } else {
          navigate('/');
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-2">
              <Upload className="w-6 h-6" />
              Upload Your Coin
            </CardTitle>
            
            {isMobileDevice && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Enhanced Mobile Experience Available
                  </span>
                </div>
                <Button
                  onClick={() => navigate('/mobile-upload')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Mobile Mode
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section - NATIVE CAMERA ONLY */}
              <div className="space-y-4">
                <Label>Coin Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Coin preview"
                        className="max-w-xs mx-auto rounded-lg shadow-md"
                      />
                      {aiRecognition.isAnalyzing && (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <Zap className="w-4 h-4 animate-pulse" />
                          <span>AI analyzing your coin...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Capture coin with native camera</p>
                        <p className="text-gray-500">AI will automatically identify your coin</p>
                      </div>
                    </div>
                  )}

                  {/* NATIVE CAMERA ONLY - NO FALLBACK FILE INPUT */}
                  <div className="mt-4">
                    <NativeCameraOnly
                      onImagesSelected={handleNativeCameraImagesSelected}
                      maxImages={5}
                    />
                  </div>
                </div>
              </div>

              {/* Listing Type Selection */}
              <div className="space-y-4">
                <Label>Listing Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.listingType === 'direct_sale' ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, listingType: 'direct_sale' }))}
                    className="h-16 flex flex-col gap-1"
                  >
                    <span className="font-medium">Direct Sale</span>
                    <span className="text-xs opacity-75">Sell immediately at fixed price</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.listingType === 'auction' ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, listingType: 'auction' }))}
                    className="h-16 flex flex-col gap-1"
                  >
                    <span className="font-medium">Auction</span>
                    <span className="text-xs opacity-75">Let buyers bid for best price</span>
                  </Button>
                </div>
              </div>

              {/* Coin Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Coin Name*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Morgan Silver Dollar"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {coinCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year*</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="e.g., 1921"
                    required
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
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    placeholder="e.g., MS-65"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="composition">Composition</Label>
                  <Input
                    id="composition"
                    value={formData.composition}
                    onChange={(e) => setFormData(prev => ({ ...prev, composition: e.target.value }))}
                    placeholder="e.g., Silver"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="Auto-filled from AI"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diameter">Diameter (mm)</Label>
                  <Input
                    id="diameter"
                    value={formData.diameter}
                    onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
                    placeholder="Auto-filled from AI"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your coin's condition, history, and notable features"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  {formData.listingType === 'auction' ? 'Starting Bid*' : 'Price*'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Enter amount in USD"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={createCoin.isPending || !formData.name || !formData.price || !formData.image}
                className="w-full"
              >
                {createCoin.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.listingType === 'auction' ? 'Start Auction' : 'List for Sale'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CoinUploadForm;
