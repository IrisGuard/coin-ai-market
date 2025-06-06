
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Zap, Camera, TrendingUp, X, Plus, Loader2, CheckCircle, AlertCircle, Image as ImageIcon, FileText, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

const CoinUpload = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [coinData, setCoinData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    year: '',
    country: '',
    denomination: '',
    mint: '',
    composition: '',
    diameter: '',
    weight: '',
    grade: '',
    rarity: '',
    isAuction: false,
    startingBid: '',
    auctionDuration: '7'
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const maxImages = 5;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    const newImages: UploadedImage[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImage = async (imageData: UploadedImage, index: number): Promise<string> => {
    const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${imageData.file.name.split('.').pop()}`;
    
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, uploading: true, error: undefined } : img
    ));

    try {
      const { data, error } = await supabase.storage
        .from('coin-images')
        .upload(fileName, imageData.file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('coin-images')
        .getPublicUrl(fileName);

      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: false, uploaded: true, url: publicUrl } : img
      ));

      return publicUrl;
    } catch (error: any) {
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, uploading: false, error: error.message } : img
      ));
      throw error;
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeImages = async (imageUrls: string[]) => {
    setIsAnalyzing(true);
    try {
      const analysisPromises = imageUrls.map(async (url, index) => {
        try {
          // Convert image to base64 for AI analysis
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], `coin-${index}.jpg`, { type: 'image/jpeg' });
          const base64Image = await convertToBase64(file);

          const { data, error } = await supabase.functions.invoke('ai-coin-analysis', {
            body: { 
              image: base64Image,
              imageUrl: url
            }
          });

          if (error) throw error;
          return { ...data, imageIndex: index };
        } catch (error) {
          console.error(`Analysis failed for image ${index}:`, error);
          return { 
            error: error.message, 
            imageIndex: index,
            confidence: 0,
            identification: { name: 'Unknown' },
            valuation: { current_value: 0 }
          };
        }
      });

      const results = await Promise.all(analysisPromises);
      setAnalysisResults(results);
      
      // Auto-fill coin data from best analysis result
      const bestResult = results.reduce((best, current) => 
        (current.confidence || 0) > (best.confidence || 0) ? current : best
      );

      if (bestResult && bestResult.identification) {
        setCoinData(prev => ({
          ...prev,
          title: bestResult.identification.name || prev.title,
          year: bestResult.identification.year?.toString() || prev.year,
          country: bestResult.identification.country || prev.country,
          denomination: bestResult.identification.denomination || prev.denomination,
          condition: bestResult.grading?.condition || prev.condition,
          grade: bestResult.grading?.grade || prev.grade,
          mint: bestResult.identification.mint || prev.mint,
          composition: bestResult.specifications?.composition || prev.composition,
          diameter: bestResult.specifications?.diameter?.toString() || prev.diameter,
          weight: bestResult.specifications?.weight?.toString() || prev.weight,
          rarity: bestResult.rarity || prev.rarity,
          price: bestResult.valuation?.current_value?.toString() || prev.price
        }));
      }

      toast.success('Images analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze images');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      setUploadProgress(0);
      const imageUrls: string[] = [];

      // Upload all images
      for (let i = 0; i < images.length; i++) {
        if (!images[i].uploaded) {
          const url = await uploadImage(images[i], i);
          imageUrls.push(url);
        } else if (images[i].url) {
          imageUrls.push(images[i].url!);
        }
        setUploadProgress(((i + 1) / images.length) * 50); // 50% for upload
      }

      // Analyze images
      setUploadProgress(75);
      await analyzeImages(imageUrls);
      setUploadProgress(100);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload and analyze images');
    }
  };

  const handleSubmitListing = async () => {
    if (!coinData.title || (!coinData.price && !coinData.isAuction) || (!coinData.startingBid && coinData.isAuction)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0 || !images.every(img => img.uploaded)) {
      toast.error('Please upload and analyze images first');
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls = images.map(img => img.url).filter(Boolean) as string[];
      const primaryImageUrl = imageUrls[0];

      const coinRecord = {
        name: coinData.title,
        description: coinData.description,
        price: coinData.isAuction ? null : parseFloat(coinData.price || '0'),
        condition: coinData.condition,
        grade: coinData.grade,
        year: coinData.year ? parseInt(coinData.year) : null,
        country: coinData.country,
        denomination: coinData.denomination,
        mint: coinData.mint,
        composition: coinData.composition,
        diameter: coinData.diameter ? parseFloat(coinData.diameter) : null,
        weight: coinData.weight ? parseFloat(coinData.weight) : null,
        rarity: coinData.rarity || 'Common',
        image: primaryImageUrl,
        user_id: user?.id,
        seller_id: user?.id,
        is_auction: coinData.isAuction,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid || '0') : null,
        auction_end: coinData.isAuction 
          ? new Date(Date.now() + parseInt(coinData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString()
          : null,
        ai_confidence: analysisResults.length > 0 ? analysisResults[0].confidence || 0.5 : null,
        ai_provider: 'anthropic-claude',
        featured: false,
        views: 0,
        favorites: 0,
        authentication_status: 'pending'
      };

      const { data, error } = await supabase
        .from('coins')
        .insert(coinRecord)
        .select()
        .single();

      if (error) throw error;

      toast.success(`Coin listed successfully! ${coinData.isAuction ? 'Auction started.' : 'Available for purchase.'}`);
      navigate(`/coin/${data.id}`);

    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 mb-6">
              <Zap className="w-5 h-5 mr-3 text-indigo-600 animate-pulse" />
              <span className="text-sm font-semibold text-indigo-600">Professional Listing Tool</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              List Your Coin
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Upload multiple photos, get AI analysis, and create a professional listing. 
              Our advanced technology ensures maximum visibility and accurate valuation.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: 'Multi-Image Upload',
                description: 'Upload up to 5 high-quality photos from different angles',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'AI Analysis',
                description: 'Automatic identification and market valuation',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Smart Pricing',
                description: 'Get optimal pricing recommendations based on market data',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 hover:bg-white/80 transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-xl mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Image Upload */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-indigo-600" />
                  Coin Photos ({images.length}/5)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-indigo-300 bg-gradient-to-br from-indigo-50/50 to-blue-50/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Camera className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Upload High-Quality Photos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop up to 5 photos or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={images.length >= 5}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {images.length === 0 ? 'Select Photos' : 'Add More Photos'}
                  </Button>
                </div>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                          <img
                            src={image.preview}
                            alt={`Coin ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {image.uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}
                          {image.uploaded && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-emerald-500 bg-white rounded-full" />
                            </div>
                          )}
                          {image.error && (
                            <div className="absolute top-2 right-2">
                              <AlertCircle className="w-5 h-5 text-red-500 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        {image.error && (
                          <p className="text-xs text-red-500 mt-1 truncate">{image.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Upload and Analyze Button */}
                {images.length > 0 && !images.every(img => img.uploaded) && (
                  <Button
                    onClick={handleUploadAndAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Images...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Upload & Analyze Photos
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResults.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    AI Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisResults.map((result, index) => (
                      <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-emerald-600 text-white">
                            Photo {index + 1}
                          </Badge>
                          <span className="text-sm text-emerald-600 font-semibold">
                            {((result.confidence || 0) * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{result.identification?.name || 'Unknown'}</h4>
                        <p className="text-sm text-gray-600">
                          {result.identification?.year || 'Unknown'} • {result.identification?.country || 'Unknown'}
                        </p>
                        <div className="mt-2 text-lg font-bold text-emerald-600">
                          ${result.valuation?.current_value || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Listing Details Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  Listing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Coin Title *</Label>
                    <Input
                      id="title"
                      value={coinData.title}
                      onChange={(e) => setCoinData({...coinData, title: e.target.value})}
                      placeholder="e.g., 1921 Morgan Silver Dollar"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  {!coinData.isAuction && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={coinData.price}
                        onChange={(e) => setCoinData({...coinData, price: e.target.value})}
                        placeholder="0.00"
                        className="border-indigo-200 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={coinData.year}
                      onChange={(e) => setCoinData({...coinData, year: e.target.value})}
                      placeholder="e.g., 1921"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={coinData.country}
                      onChange={(e) => setCoinData({...coinData, country: e.target.value})}
                      placeholder="e.g., United States"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="denomination">Denomination</Label>
                    <Input
                      id="denomination"
                      value={coinData.denomination}
                      onChange={(e) => setCoinData({...coinData, denomination: e.target.value})}
                      placeholder="e.g., Dollar"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={coinData.condition} onValueChange={(value) => setCoinData({...coinData, condition: value})}>
                      <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mint State">Mint State</SelectItem>
                        <SelectItem value="About Uncirculated">About Uncirculated</SelectItem>
                        <SelectItem value="Extremely Fine">Extremely Fine</SelectItem>
                        <SelectItem value="Very Fine">Very Fine</SelectItem>
                        <SelectItem value="Fine">Fine</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="About Good">About Good</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={coinData.grade}
                      onChange={(e) => setCoinData({...coinData, grade: e.target.value})}
                      placeholder="e.g., MS-65, AU-50"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rarity">Rarity</Label>
                    <Select value={coinData.rarity} onValueChange={(value) => setCoinData({...coinData, rarity: value})}>
                      <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Common">Common</SelectItem>
                        <SelectItem value="Uncommon">Uncommon</SelectItem>
                        <SelectItem value="Rare">Rare</SelectItem>
                        <SelectItem value="Very Rare">Very Rare</SelectItem>
                        <SelectItem value="Ultra Rare">Ultra Rare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mint">Mint</Label>
                    <Input
                      id="mint"
                      value={coinData.mint}
                      onChange={(e) => setCoinData({...coinData, mint: e.target.value})}
                      placeholder="e.g., Philadelphia, Denver"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="composition">Composition</Label>
                    <Input
                      id="composition"
                      value={coinData.composition}
                      onChange={(e) => setCoinData({...coinData, composition: e.target.value})}
                      placeholder="e.g., 90% Silver, 10% Copper"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diameter">Diameter (mm)</Label>
                    <Input
                      id="diameter"
                      type="number"
                      step="0.1"
                      value={coinData.diameter}
                      onChange={(e) => setCoinData({...coinData, diameter: e.target.value})}
                      placeholder="e.g., 38.1"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={coinData.weight}
                      onChange={(e) => setCoinData({...coinData, weight: e.target.value})}
                      placeholder="e.g., 26.73"
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={coinData.description}
                    onChange={(e) => setCoinData({...coinData, description: e.target.value})}
                    placeholder="Describe the coin's history, condition, and any special features..."
                    className="border-indigo-200 focus:border-indigo-500"
                    rows={4}
                  />
                </div>

                {/* Auction Option */}
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="isAuction"
                      checked={coinData.isAuction}
                      onChange={(e) => setCoinData({...coinData, isAuction: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <Label htmlFor="isAuction" className="text-lg font-semibold">
                      List as Auction
                    </Label>
                  </div>

                  {coinData.isAuction && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startingBid">Starting Bid ($) *</Label>
                        <Input
                          id="startingBid"
                          type="number"
                          value={coinData.startingBid}
                          onChange={(e) => setCoinData({...coinData, startingBid: e.target.value})}
                          placeholder="0.00"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auctionDuration">Duration</Label>
                        <Select value={coinData.auctionDuration} onValueChange={(value) => setCoinData({...coinData, auctionDuration: value})}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="5">5 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="10">10 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitListing}
                  disabled={
                    !coinData.title || 
                    (!coinData.price && !coinData.isAuction) || 
                    (!coinData.startingBid && coinData.isAuction) ||
                    images.length === 0 || 
                    !images.every(img => img.uploaded) ||
                    isSubmitting
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      {coinData.isAuction ? 'Start Auction' : 'Create Listing'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <Card className="bg-white/80 backdrop-blur-sm border border-indigo-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
                  Photography Tips for Best Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    'Use natural daylight or bright LED lighting',
                    'Keep camera steady and focused on details',
                    'Include obverse, reverse, and edge views',
                    'Avoid shadows, glare, and reflections'
                  ].map((tip, index) => (
                    <div key={tip} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoinUpload;
