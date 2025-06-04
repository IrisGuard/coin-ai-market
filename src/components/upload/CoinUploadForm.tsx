import React, { useState } from 'react';
import { useCreateCoin } from '@/hooks/useCoins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, Loader2, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MobileCameraUploader from '@/components/MobileCameraUploader';

const CoinUploadForm = () => {
  const createCoin = useCreateCoin();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    country: '',
    denomination: '',
    grade: '',
    price: '',
    rarity: '',
    condition: '',
    composition: '',
    diameter: '',
    weight: '',
    mint: '',
    description: '',
    image: '',
  });

  // Check if device is mobile
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleMobileImagesSelected = async (images: { file: File; preview: string }[]) => {
    if (images.length === 0) return;

    const primaryImage = images[0];
    setImagePreview(primaryImage.preview);
    setFormData(prev => ({ ...prev, image: primaryImage.preview }));

    // Simulate AI analysis
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI results
      setFormData(prev => ({
        ...prev,
        name: 'Morgan Silver Dollar',
        year: '1921',
        country: 'United States',
        denomination: 'Dollar',
        grade: 'MS-63',
        rarity: 'Common',
        condition: 'Mint State',
        composition: '90% Silver, 10% Copper',
        diameter: '38.1',
        weight: '26.73',
        mint: 'Philadelphia',
        description: 'Morgan Silver Dollar minted in 1921, commonly found in good condition. Features Liberty head on obverse and eagle on reverse.',
      }));

      toast({
        title: "AI Analysis Complete",
        description: "Coin identified with 92% confidence. Please review and adjust the details.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the coin image. Please fill in the details manually.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);

    // Simulate AI analysis
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI results - same as before
      setFormData(prev => ({
        ...prev,
        name: 'Morgan Silver Dollar',
        year: '1921',
        country: 'United States',
        denomination: 'Dollar',
        grade: 'MS-63',
        rarity: 'Common',
        condition: 'Mint State',
        composition: '90% Silver, 10% Copper',
        diameter: '38.1',
        weight: '26.73',
        mint: 'Philadelphia',
        description: 'Morgan Silver Dollar minted in 1921, commonly found in good condition. Features Liberty head on obverse and eagle on reverse.',
      }));

      toast({
        title: "AI Analysis Complete",
        description: "Coin identified with 92% confidence. Please review and adjust the details.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the coin image. Please fill in the details manually.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast({
        title: "Image Required",
        description: "Please upload a coin image before submitting.",
        variant: "destructive",
      });
      return;
    }

    const imageUrl = imagePreview || formData.image;

    try {
      createCoin.mutate({
        name: formData.name,
        year: parseInt(formData.year),
        grade: formData.grade,
        price: parseFloat(formData.price),
        rarity: formData.rarity as any,
        image: imageUrl,
        country: formData.country,
        denomination: formData.denomination,
        description: formData.description,
        composition: formData.composition,
        diameter: formData.diameter ? parseFloat(formData.diameter) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        mint: formData.mint,
      });

      // Reset form
      setFormData({
        name: '', year: '', country: '', denomination: '', grade: '', price: '',
        rarity: '', condition: '', composition: '', diameter: '', weight: '',
        mint: '', description: '', image: '',
      });
      setImagePreview('');
    } catch (error) {
      console.error('Error creating coin:', error);
    }
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
            
            {/* Mobile Mode Toggle */}
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
              {/* Image Upload */}
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
                      {isAnalyzing && (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyzing coin with AI...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Upload a coin image</p>
                        <p className="text-gray-500">AI will automatically identify your coin</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Image Upload Options */}
                  <div className="mt-4 space-y-3">
                    {!isMobileMode ? (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="file-upload"
                      />
                    ) : null}
                    
                    <div className="flex flex-col space-y-2">
                      {!isMobileMode && (
                        <label htmlFor="file-upload">
                          <Button type="button" variant="outline" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </label>
                      )}
                      
                      {isMobileDevice && (
                        <div className="space-y-3">
                          <Button
                            type="button"
                            onClick={() => setIsMobileMode(!isMobileMode)}
                            variant={isMobileMode ? "default" : "outline"}
                            className="w-full"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            {isMobileMode ? "Using Mobile Camera" : "Use Mobile Camera"}
                          </Button>
                          
                          {isMobileMode && (
                            <div className="border rounded-lg p-4">
                              <MobileCameraUploader
                                onImagesSelected={handleMobileImagesSelected}
                                maxImages={5}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                  <Label htmlFor="denomination">Denomination</Label>
                  <Input
                    id="denomination"
                    value={formData.denomination}
                    onChange={(e) => setFormData(prev => ({ ...prev, denomination: e.target.value }))}
                    placeholder="e.g., Dollar, Cent, Dime"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade*</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    placeholder="e.g., MS-65, AU-50, VF-20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)*</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g., 85.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rarity">Rarity*</Label>
                  <Select value={formData.rarity} onValueChange={(value) => setFormData(prev => ({ ...prev, rarity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                      <SelectItem value="Uncommon">Uncommon</SelectItem>
                      <SelectItem value="Rare">Rare</SelectItem>
                      <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mint">Mint</SelectItem>
                      <SelectItem value="Near Mint">Near Mint</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="composition">Composition</Label>
                  <Input
                    id="composition"
                    value={formData.composition}
                    onChange={(e) => setFormData(prev => ({ ...prev, composition: e.target.value }))}
                    placeholder="e.g., 90% Silver, 10% Copper"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diameter">Diameter (mm)</Label>
                  <Input
                    id="diameter"
                    type="number"
                    step="0.1"
                    value={formData.diameter}
                    onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
                    placeholder="e.g., 38.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g., 26.73"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mint">Mint</Label>
                  <Input
                    id="mint"
                    value={formData.mint}
                    onChange={(e) => setFormData(prev => ({ ...prev, mint: e.target.value }))}
                    placeholder="e.g., Philadelphia, Denver"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the coin's condition, history, or any notable features..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full coin-button"
                disabled={createCoin.isPending || isAnalyzing}
              >
                {createCoin.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading Coin...
                  </>
                ) : (
                  'List Coin for Sale'
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
