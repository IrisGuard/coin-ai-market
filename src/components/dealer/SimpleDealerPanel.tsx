import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Store, Zap, DollarSign, Globe, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAIAnalysis } from '@/hooks/upload/useAIAnalysis';
import { toast } from 'sonner';

interface UploadedImage {
  file: File;
  preview: string;
  aiAnalysis?: any;
  analyzing: boolean;
}

const SimpleDealerPanel = () => {
  const { user } = useAuth();
  const { performAnalysis } = useAIAnalysis();
  
  // State for the single upload form
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [listingType, setListingType] = useState<'buy_now' | 'auction'>('buy_now');
  const [commission, setCommission] = useState([10]);
  const [internationalShipping, setInternationalShipping] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Form data from AI analysis
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
    metal: '',
    error: '',
    price: '',
    startingBid: '',
    reservePrice: '',
    auctionDuration: '7'
  });

  // Dealer store data
  const { data: dealerStore } = useQuery({
    queryKey: ['dealer-store-simple'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching dealer store:', error);
        throw error;
      }
      
      return data;
    }
  });

  // 30 Categories for selection - EXACT SAME AS HOME PAGE
  const categories = [
    'US Coins', 'World Coins', 'Ancient Coins', 'Modern Coins', 'Gold Coins',
    'Silver Coins', 'Platinum Coins', 'Paper Money', 'Graded Coins', 'Commemorative Coins',
    'Proof Coins', 'Uncirculated Coins', 'Tokens & Medals', 'Bullion Bars', 'American Coins',
    'European Coins', 'Asian Coins', 'African Coins', 'Australian Coins', 'South American Coins',
    'Error Coins', 'Double Die', 'Off-Center Strike', 'Clipped Planchet', 'Broadstrike',
    'Die Crack', 'Lamination Error', 'Wrong Planchet', 'Rotated Die', 'Cud Error'
  ];

  const handleImageUpload = async (files: FileList) => {
    const newImages: UploadedImage[] = Array.from(files).slice(0, 10 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      analyzing: true
    }));

    setImages(prev => [...prev, ...newImages]);

    // AI Analysis for each image
    for (let i = 0; i < newImages.length; i++) {
      try {
        const analysis = await performAnalysis(newImages[i].file);
        
        if (analysis) {
          // Auto-fill form with first image analysis
          if (images.length === 0 && i === 0) {
            setFormData({
              title: analysis.name || '',
              description: `${analysis.name} from ${analysis.year}. ${analysis.grade} grade ${analysis.composition} coin.` || '',
              year: analysis.year?.toString() || '',
              metal: analysis.composition || '',
              error: analysis.errors?.join(', ') || '',
              price: analysis.estimatedValue?.toString() || '',
              startingBid: (analysis.estimatedValue * 0.7)?.toString() || '',
              reservePrice: (analysis.estimatedValue * 0.8)?.toString() || '',
              auctionDuration: '7'
            });
          }

          // Update image with analysis
          setImages(current => 
            current.map((img, index) => 
              index === images.length + i 
                ? { ...img, aiAnalysis: analysis, analyzing: false }
                : img
            )
          );
        }
      } catch (error) {
        console.error('AI analysis failed:', error);
        setImages(current => 
          current.map((img, index) => 
            index === images.length + i 
              ? { ...img, analyzing: false }
              : img
          )
        );
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePublish = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description');
      return;
    }

    try {
      // Create coin listing
      const coinData = {
        user_id: user?.id,
        store_id: dealerStore?.id,
        name: formData.title,
        description: formData.description,
        year: parseInt(formData.year) || new Date().getFullYear(),
        grade: 'Ungraded',
        rarity: 'Common',
        country: 'United States',
        price: parseFloat(formData.price) || 0,
        image: images[0]?.preview || '',
        is_auction: listingType === 'auction',
        starting_bid: listingType === 'auction' ? parseFloat(formData.startingBid) || 0 : null,
        reserve_price: listingType === 'auction' ? parseFloat(formData.reservePrice) || 0 : null,
        auction_end: listingType === 'auction' 
          ? new Date(Date.now() + parseInt(formData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString()
          : null,
        composition: formData.metal,
        tags: selectedCategories
      };

      const { data, error } = await supabase
        .from('coins')
        .insert([coinData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Coin listing published successfully!');
      
      // Reset form
      setImages([]);
      setFormData({
        title: '', description: '', year: '', metal: '', error: '', 
        price: '', startingBid: '', reservePrice: '', auctionDuration: '7'
      });
      setSelectedCategories([]);
      
    } catch (error) {
      console.error('Error publishing listing:', error);
      toast.error('Failed to publish listing');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Store Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-6 w-6 text-blue-600" />
            Dealer Upload Panel
            <Badge variant={dealerStore?.is_active ? 'default' : 'secondary'}>
              {dealerStore?.is_active ? 'Store Active' : 'Store Inactive'}
            </Badge>
            {dealerStore?.verified && (
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Upload your coins with AI-powered analysis and intelligent categorization
          </p>
        </CardContent>
      </Card>

      {/* Photo Upload Section - 10 Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Photos (Up to 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-2 relative"
              >
                {images[index] ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={images[index].preview} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    {images[index].analyzing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <label className="w-full h-full border border-dashed border-gray-400 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center">
                      Photo {index + 1}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          
          {/* AI Analysis Results */}
          {images.some(img => img.aiAnalysis) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Analysis Results
              </h4>
              <div className="text-sm text-blue-700">
                {images[0]?.aiAnalysis && (
                  <p>Detected: {images[0].aiAnalysis.name} • Confidence: {Math.round(images[0].aiAnalysis.confidence * 100)}%</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Section - All in one */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="AI will suggest a title..."
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="AI detected year..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="AI will generate description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="metal">Metal/Composition</Label>
              <Input
                id="metal"
                value={formData.metal}
                onChange={(e) => setFormData(prev => ({ ...prev, metal: e.target.value }))}
                placeholder="AI detected metal..."
              />
            </div>
            <div>
              <Label htmlFor="error">Error (if any)</Label>
              <Input
                id="error"
                value={formData.error}
                onChange={(e) => setFormData(prev => ({ ...prev, error: e.target.value }))}
                placeholder="AI detected errors..."
              />
            </div>
            <div>
              <Label>Commission Rate</Label>
              <div className="px-3 py-2">
                <Slider
                  value={commission}
                  onValueChange={setCommission}
                  max={20}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground mt-1">
                  {commission[0]}% commission
                </div>
              </div>
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <Label>Listing Type</Label>
            <RadioGroup 
              value={listingType} 
              onValueChange={(value: 'buy_now' | 'auction') => setListingType(value)}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy_now" id="buy_now" />
                <Label htmlFor="buy_now">Buy Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auction" id="auction" />
                <Label htmlFor="auction">Auction</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Price/Auction Fields */}
          {listingType === 'buy_now' ? (
            <div>
              <Label htmlFor="price">Buy Now Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="AI estimated value..."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startingBid">Starting Bid ($)</Label>
                <Input
                  id="startingBid"
                  type="number"
                  value={formData.startingBid}
                  onChange={(e) => setFormData(prev => ({ ...prev, startingBid: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                <Input
                  id="reservePrice"
                  type="number"
                  value={formData.reservePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, reservePrice: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="duration">Auction Duration</Label>
                <Select value={formData.auctionDuration} onValueChange={(value) => setFormData(prev => ({ ...prev, auctionDuration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Categories - 30 FINAL CATEGORIES */}
          <div>
            <Label>Categories (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories(prev => [...prev, category]);
                      } else {
                        setSelectedCategories(prev => prev.filter(c => c !== category));
                      }
                    }}
                  />
                  <Label htmlFor={category} className="text-sm">{category}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="international"
              checked={internationalShipping}
              onCheckedChange={(checked) => setInternationalShipping(checked === true)}
            />
            <Label htmlFor="international" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Offer International Shipping
            </Label>
          </div>

          {/* Publish Button */}
          <Button 
            onClick={handlePublish} 
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Package className="h-5 w-5 mr-2" />
            Publish Listing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDealerPanel;
