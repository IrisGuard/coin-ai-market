import React, { useState } from 'react';
import { useCreateCoin } from '@/hooks/useCoins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, Loader2, Smartphone, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { uploadImage } from '@/utils/imageUpload';
import { mapUIToDatabaseCategory } from '@/utils/categoryMapping';
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
          category: result.category || '',
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

  const handleNativeCameraImagesSelected = async (images: { file: File; preview: string; url?: string }[]) => {
    if (images.length === 0) return;

    const primaryImage = images[0];
    setImagePreview(primaryImage.preview);
    
    if (primaryImage.url) {
      // Already uploaded
      setUploadedImageUrl(primaryImage.url);
      setFormData(prev => ({ ...prev, image: primaryImage.url! }));
    } else {
      // Upload to storage
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadImage(primaryImage.file, 'coin-images');
        setUploadedImageUrl(uploadedUrl);
        setFormData(prev => ({ ...prev, image: uploadedUrl }));
      } catch (error) {
        console.error('Image upload failed:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }

    await handleAIAnalysis(primaryImage.file);
  };

  // Handle regular file input upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const uploadedUrl = await uploadImage(file, 'coin-images');
      setUploadedImageUrl(uploadedUrl);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: uploadedUrl }));
      
      // Run AI analysis
      await handleAIAnalysis(file);
      
      toast({
        title: "Image Uploaded Successfully!",
        description: "Image saved to cloud storage and analyzed.",
      });
    } catch (error) {
      console.error('File upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImageUrl) {
      toast({
        title: "Image Required",
        description: "Please upload an image before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    const isAuction = formData.listingType === 'auction';
    const mappedCategory = mapUIToDatabaseCategory(formData.category);
    
    const coinData = {
      name: formData.name,
      year: parseInt(formData.year) || new Date().getFullYear(),
      grade: formData.grade,
      price: parseFloat(formData.price) || 0,
      rarity: formData.rarity,
      image: uploadedImageUrl, // Use uploaded URL
      country: formData.country,
      denomination: formData.denomination,
      description: formData.description,
      category: mappedCategory, // Use mapped category
      is_auction: isAuction,
      listing_type: formData.listingType,
      auction_end: isAuction ? new Date(Date.now() + parseInt(formData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString() : null,
      starting_bid: isAuction ? parseFloat(formData.price) || 0 : null,
    };
    
    setFormSubmitted(true);
    createCoin.mutate(coinData, {
      onSuccess: () => {
        // Don't navigate immediately - show success message
        toast({
          title: "🎉 Success!",
          description: isAuction 
            ? "Auction started successfully! Your coin is now live in the marketplace." 
            : "Coin listed successfully! Your coin is now available for purchase.",
        });
      },
      onError: () => {
        setFormSubmitted(false);
      }
    });
  };

  const resetForm = () => {
    setFormData({
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
    setImagePreview('');
    setUploadedImageUrl('');
    setFormSubmitted(false);
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
            {/* Success Message */}
            {formSubmitted && !createCoin.isPending && !createCoin.error && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <h3 className="text-lg font-semibold text-green-800">
                      🎉 Coin Successfully Listed!
                    </h3>
                    <p className="text-green-700">
                      Your coin has been uploaded with image saved to cloud storage.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/marketplace')} 
                        className="bg-green-600 hover:bg-green-700"
                      >
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
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
                      {uploadedImageUrl && (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Image saved to cloud storage</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Upload coin image</p>
                        <p className="text-gray-500">AI will automatically identify your coin</p>
                      </div>
                    </div>
                  )}

                  {/* Native Camera for Mobile */}
                  {isMobileDevice ? (
                    <div className="mt-4">
                      <NativeCameraOnly
                        onImagesSelected={handleNativeCameraImagesSelected}
                        maxImages={1}
                      />
                    </div>
                  ) : (
                    /* Regular File Input for Desktop */
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </label>
                    </div>
                  )}
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
                disabled={createCoin.isPending || !formData.name || !formData.price || !uploadedImageUrl || isUploading}
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
