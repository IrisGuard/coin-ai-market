import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Store, Zap, DollarSign, Globe, Package, Wallet, Brain, TrendingUp, Settings, Camera, BarChart3, Database, Shield, Users, Activity, PieChart, Target, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAIAnalysis } from '@/hooks/upload/useAIAnalysis';
import { useAIStats } from '@/hooks/useAIStats';
import { useDatabaseStats } from '@/hooks/useDatabaseStats';
import { useAnalyticsStats } from '@/hooks/useAnalyticsStats';
import { toast } from 'sonner';
import WalletManagementTab from './WalletManagementTab';

interface UploadedImage {
  file: File;
  preview: string;
  aiAnalysis?: any;
  analyzing: boolean;
}

const SimpleDealerPanel = () => {
  const { user } = useAuth();
  
  // 🧠 AI ANALYSIS HOOKS
  const { performAnalysis } = useAIAnalysis();
  const { data: dbStats, isLoading: dbLoading } = useDatabaseStats();
  const { data: aiStats, isLoading: aiLoading } = useAIStats();
  const { data: analyticsStats, isLoading: analyticsLoading } = useAnalyticsStats();

  // Enhanced state with AI Brain integration
  const [activeTab, setActiveTab] = useState('upload');
  
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

  // Real-time dealer performance data
  const { data: dealerCoins = [] } = useQuery({
    queryKey: ['dealer-coins-performance', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
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

  // 🎯 ADVANCED IMAGE PROCESSING WITH QUALITY VALIDATION
  const handleImageUpload = async (files: FileList) => {
    const newImages = [...images];
    
    for (let i = 0; i < files.length && newImages.length < 10; i++) {
      const file = files[i];
      
      // 🔍 ADVANCED IMAGE QUALITY VALIDATION
      const qualityCheck = await validateImageQuality(file);
      
      if (!qualityCheck.isValid) {
        toast.error(`Image Quality Issue: ${qualityCheck.reason}`, {
          description: 'Please upload a clear, natural photo for optimal AI analysis'
        });
        continue;
      }
      
      const preview = URL.createObjectURL(file);
      const imageData = {
        file,
        preview,
        analyzing: true,
        aiAnalysis: null
      };
      
      newImages.push(imageData);
      setImages([...newImages]);
      
      // 🧠 START AI ANALYSIS IMMEDIATELY
      toast.info('🧠 Starting Advanced AI Analysis...', {
        description: 'Scanning worldwide databases for coin identification and error detection'
      });
      
      try {
        const analysis = await performAnalysis(file);
        
        if (analysis) {
          // Update the image with analysis results
          const updatedImages = [...newImages];
          const imageIndex = updatedImages.findIndex(img => img.preview === preview);
          
          if (imageIndex !== -1) {
            updatedImages[imageIndex] = {
              ...updatedImages[imageIndex],
              analyzing: false,
              aiAnalysis: analysis
            };
            setImages(updatedImages);
            
            // 🎉 SUCCESS NOTIFICATION WITH DETAILED RESULTS
            toast.success('🎯 AI Analysis Complete!', {
              description: `${analysis.name} • ${Math.round(analysis.confidence * 100)}% confidence • ${analysis.hasError ? 'ERROR DETECTED!' : 'No errors found'}`
            });
            
            // 💰 VALUATION NOTIFICATION
            if (analysis.estimatedValue > 1000) {
              toast.success('💰 High Value Coin Detected!', {
                description: `Estimated value: $${analysis.estimatedValue.toLocaleString()}`
              });
            }

            // 🤖 AUTO-FILL FORM WITH AI RESULTS
            setFormData(prev => ({
              ...prev,
              title: analysis.name,
              year: analysis.year.toString(),
              metal: analysis.composition,
              error: analysis.hasError ? analysis.errorType.join(', ') : '',
              price: analysis.estimatedValue.toString(),
              description: `${analysis.name} - ${analysis.year} ${analysis.country}. ${analysis.hasError ? `ERROR COIN: ${analysis.errorDescription}` : 'Normal strike.'} Grade: ${analysis.grade}. ${analysis.historicalContext || ''}`
            }));

            // 🏷️ AUTO-SELECT APPROPRIATE CATEGORIES
            const autoCategories = [];
            if (analysis.country === 'United States') autoCategories.push('US Coins');
            if (analysis.hasError) {
              autoCategories.push('Error Coins');
              if (analysis.errorType.includes('Double Die')) autoCategories.push('Double Die');
              if (analysis.errorType.includes('Off-Center')) autoCategories.push('Off-Center Strike');
            }
            if (analysis.composition.includes('Gold')) autoCategories.push('Gold Coins');
            if (analysis.composition.includes('Silver')) autoCategories.push('Silver Coins');
            
            setSelectedCategories(prev => [...new Set([...prev, ...autoCategories])]);
          }
        }
      } catch (error) {
        // Update analyzing status on error
        const updatedImages = [...newImages];
        const imageIndex = updatedImages.findIndex(img => img.preview === preview);
        
        if (imageIndex !== -1) {
          updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            analyzing: false,
            aiAnalysis: null
          };
          setImages(updatedImages);
        }
        
        toast.error('AI Analysis Failed', {
          description: 'Please try again with a clearer image'
        });
      }
    }
  };

  // 🔍 ADVANCED IMAGE QUALITY VALIDATION
  const validateImageQuality = async (file: File): Promise<{isValid: boolean, reason?: string}> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // 📏 RESOLUTION CHECK
        if (img.width < 800 || img.height < 600) {
          resolve({ isValid: false, reason: 'Image resolution too low (minimum 800x600)' });
          return;
        }
        
        // 📐 ASPECT RATIO CHECK
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.8 || aspectRatio > 1.5) {
          resolve({ isValid: false, reason: 'Unusual aspect ratio - ensure full coin is visible' });
          return;
        }
        
        // 🎨 COLOR ANALYSIS FOR NATURAL LIGHTING
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        if (imageData) {
          const { brightness, contrast, saturation } = analyzeImageMetrics(imageData);
          
          if (brightness < 50 || brightness > 200) {
            resolve({ isValid: false, reason: 'Poor lighting - use natural light without flash' });
            return;
          }
          
          if (contrast < 30) {
            resolve({ isValid: false, reason: 'Image too blurry - ensure sharp focus' });
            return;
          }
          
          if (saturation > 150) {
            resolve({ isValid: false, reason: 'Over-saturated image - avoid artificial enhancement' });
            return;
          }
        }
        
        // ✅ ALL QUALITY CHECKS PASSED
        resolve({ isValid: true });
      };
      
      img.onerror = () => {
        resolve({ isValid: false, reason: 'Invalid image file' });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // 📊 IMAGE METRICS ANALYSIS
  const analyzeImageMetrics = (imageData: ImageData) => {
    const data = imageData.data;
    let totalBrightness = 0;
    let totalSaturation = 0;
    let minBrightness = 255;
    let maxBrightness = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
      minBrightness = Math.min(minBrightness, brightness);
      maxBrightness = Math.max(maxBrightness, brightness);
      
      // Calculate saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : ((max - min) / max) * 100;
      totalSaturation += saturation;
    }
    
    const pixelCount = data.length / 4;
    const avgBrightness = totalBrightness / pixelCount;
    const avgSaturation = totalSaturation / pixelCount;
    const contrast = maxBrightness - minBrightness;
    
    return {
      brightness: avgBrightness,
      contrast,
      saturation: avgSaturation
    };
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
      // Get AI analysis data for more accurate coin data
      const aiAnalysis = images[0]?.aiAnalysis;
      
      // Create coin listing with AI-enhanced data
      const coinData = {
        user_id: user?.id,
        store_id: dealerStore?.id,
        name: formData.title,
        description: formData.description,
        year: parseInt(formData.year) || new Date().getFullYear(),
        grade: aiAnalysis?.grade || 'Ungraded',
        rarity: aiAnalysis?.rarity || 'Common',
        country: aiAnalysis?.country || 'Unknown',
        price: parseFloat(formData.price) || 0,
        image: images[0]?.preview || '',
        is_auction: listingType === 'auction',
        starting_bid: listingType === 'auction' ? parseFloat(formData.startingBid) || 0 : null,
        reserve_price: listingType === 'auction' ? parseFloat(formData.reservePrice) || 0 : null,
        auction_end: listingType === 'auction' 
          ? new Date(Date.now() + parseInt(formData.auctionDuration) * 24 * 60 * 60 * 1000).toISOString()
          : null,
        composition: formData.metal,
        tags: selectedCategories,
        category: selectedCategories[0] || 'unclassified',
        featured: aiAnalysis?.estimatedValue > 1000, // Auto-feature high-value coins
        ai_confidence: aiAnalysis?.confidence || 0,
        error_type: formData.error || null,
        denomination: aiAnalysis?.denomination || null
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
            Dealer Panel
            <Badge variant={dealerStore?.is_active ? 'default' : 'secondary'}>
              {dealerStore?.is_active ? 'Store Active' : 'Store Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Manage your store, upload coins, and handle payments
            </p>
            <Button variant="outline" onClick={() => window.open('/dealer/upgrade', '_blank')}>
              <Package className="h-4 w-4 mr-2" />
              Upgrade Store
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Coins
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            My Wallets
          </TabsTrigger>
          <TabsTrigger value="ai-brain" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Brain
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Photo Upload Section - 10 Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                🎯 Advanced Photo Analysis System (Up to 10)
                <Badge className="bg-purple-100 text-purple-800">
                  AI-Powered Recognition
                </Badge>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                📸 Upload clear, natural photos • 🧠 AI analyzes instantly • 🌐 Scans worldwide databases • 💰 Real-time pricing
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 mb-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg p-2 relative hover:border-blue-400 transition-colors"
                  >
                    {images[index] ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={images[index].preview} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        {images[index].analyzing && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded">
                            <Zap className="h-6 w-6 text-yellow-400 animate-pulse mb-2" />
                            <div className="text-white text-xs text-center">
                              <div>🧠 AI Analyzing...</div>
                              <div>🌐 Scanning Web...</div>
                              <div>🔍 Detecting Errors...</div>
                            </div>
                          </div>
                        )}
                        {images[index].aiAnalysis && !images[index].analyzing && (
                          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded">
                            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">
                              ✅ {Math.round(images[index].aiAnalysis.confidence * 100)}%
                            </div>
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
                      <label className="w-full h-full border border-dashed border-gray-400 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
                        <Camera className="h-8 w-8 text-blue-500 mb-2" />
                        <span className="text-xs text-blue-600 text-center font-medium">
                          📸 Photo {index + 1}
                        </span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          Clear & Natural
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
              
              {/* 🎯 ADVANCED AI ANALYSIS RESULTS */}
              {images.some(img => img.aiAnalysis) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    🧠 AI Analysis Results - Worldwide Database Scan Complete
                  </h4>
                  
                  {images[0]?.aiAnalysis && (
                    <div className="space-y-4">
                      {/* COIN IDENTIFICATION */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-800 mb-2">🪙 Coin Identification</h5>
                          <div className="text-sm space-y-1">
                            <p><strong>Name:</strong> {images[0].aiAnalysis.name}</p>
                            <p><strong>Year:</strong> {images[0].aiAnalysis.year}</p>
                            <p><strong>Country:</strong> {images[0].aiAnalysis.country}</p>
                            <p><strong>Grade:</strong> {images[0].aiAnalysis.grade}</p>
                            <p><strong>Confidence:</strong> <span className="text-green-600 font-semibold">{Math.round(images[0].aiAnalysis.confidence * 100)}%</span></p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-800 mb-2">🔍 Error Detection</h5>
                          <div className="text-sm space-y-1">
                            <p><strong>Has Error:</strong> 
                              <span className={images[0].aiAnalysis.hasError ? "text-red-600 font-semibold" : "text-green-600"}>
                                {images[0].aiAnalysis.hasError ? " YES" : " NO"}
                              </span>
                            </p>
                            {images[0].aiAnalysis.hasError && (
                              <>
                                <p><strong>Error Type:</strong> {images[0].aiAnalysis.errorType?.join(', ')}</p>
                                <p><strong>Category:</strong> <span className="text-red-600 font-semibold">{images[0].aiAnalysis.errorCategory}</span></p>
                                <p><strong>Rarity:</strong> <span className="text-purple-600 font-semibold">{images[0].aiAnalysis.errorRarity}</span></p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* VALUATION */}
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-800 mb-2">💰 Professional Valuation</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Estimated Value</p>
                            <p className="text-xl font-bold text-green-600">${images[0].aiAnalysis.estimatedValue?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Certified</p>
                            <p className="text-lg font-semibold text-blue-600">${images[0].aiAnalysis.certifiedValue?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Uncertified</p>
                            <p className="text-lg font-semibold text-orange-600">${images[0].aiAnalysis.uncertifiedValue?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Auction Record</p>
                            <p className="text-lg font-semibold text-purple-600">${images[0].aiAnalysis.auctionRecord?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* MARKET INTELLIGENCE */}
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-800 mb-2">📊 Market Intelligence</h5>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Market Trend</p>
                            <p className={`font-semibold ${
                              images[0].aiAnalysis.marketTrend === 'Rising' ? 'text-green-600' :
                              images[0].aiAnalysis.marketTrend === 'Stable' ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              {images[0].aiAnalysis.marketTrend === 'Rising' ? '📈 Rising' :
                               images[0].aiAnalysis.marketTrend === 'Stable' ? '➡️ Stable' : '📉 Declining'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Demand Level</p>
                            <p className={`font-semibold ${
                              images[0].aiAnalysis.demandLevel === 'High' ? 'text-green-600' :
                              images[0].aiAnalysis.demandLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {images[0].aiAnalysis.demandLevel === 'High' ? '🔥 High' :
                               images[0].aiAnalysis.demandLevel === 'Medium' ? '⚡ Medium' : '❄️ Low'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Liquidity Score</p>
                            <p className="font-semibold text-blue-600">{Math.round(images[0].aiAnalysis.liquidityScore * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* IMAGE QUALITY REQUIREMENTS */}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2">📋 Photo Requirements for Optimal AI Analysis</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div>
                    <h6 className="font-medium mb-1">✅ Required:</h6>
                    <ul className="space-y-1 text-xs">
                      <li>• Clear, sharp focus</li>
                      <li>• Natural lighting (no flash)</li>
                      <li>• Neutral background</li>
                      <li>• Full coin visible</li>
                      <li>• High resolution</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">❌ Avoid:</h6>
                    <ul className="space-y-1 text-xs">
                      <li>• Blurry or out-of-focus</li>
                      <li>• Heavy shadows</li>
                      <li>• Reflective surfaces</li>
                      <li>• Partial coin views</li>
                      <li>• Artificial enhancement</li>
                    </ul>
                  </div>
                </div>
              </div>
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
                    placeholder="Coin name will be filled automatically by AI"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="Year will be detected by AI analysis"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description will be generated automatically"
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
                    placeholder="Metal composition from AI analysis"
                  />
                </div>
                <div>
                  <Label htmlFor="error">Error (if any)</Label>
                  <Input
                    id="error"
                    value={formData.error}
                    onChange={(e) => setFormData(prev => ({ ...prev, error: e.target.value }))}
                    placeholder="Errors will be detected automatically"
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
                    placeholder="Price will be estimated by AI analysis"
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
                      placeholder="Suggested starting bid"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reservePrice">Reserve Price ($)</Label>
                    <Input
                      id="reservePrice"
                      type="number"
                      value={formData.reservePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, reservePrice: e.target.value }))}
                      placeholder="Minimum acceptable price"
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
        </TabsContent>

        <TabsContent value="wallets">
          <WalletManagementTab />
        </TabsContent>

        {/* AI BRAIN TAB - THOUSANDS OF FUNCTIONS */}
        <TabsContent value="ai-brain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                🧠 AI BRAIN - THOUSANDS OF FUNCTIONS ACTIVE
                <Badge className="bg-purple-100 text-purple-800">
                  {aiStats?.activeCommands || 0} Functions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{aiStats?.activeCommands || 0}</p>
                          <p className="text-sm text-muted-foreground">Active AI Commands</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">{aiStats?.dailyExecutions || 0}</p>
                          <p className="text-sm text-muted-foreground">Daily Executions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{aiStats?.successRate || 0}%</p>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* AI Tables Overview */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">AI System Tables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiStats?.tables?.map((table) => (
                    <Card key={table.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{table.name}</p>
                            <p className="text-sm text-muted-foreground">{table.description}</p>
                          </div>
                          <Badge>{table.records} records</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DATABASE TAB - ALL 95+ TABLES */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                📊 DATABASE OVERVIEW - 95+ TABLES
                <Badge className="bg-blue-100 text-blue-800">
                  {dbStats?.totalRecords || 0} Total Records
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dbLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{dbStats?.categories?.find(c => c.name === 'User Management')?.records || 0}</p>
                          <p className="text-sm text-muted-foreground">User Records</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{dbStats?.categories?.find(c => c.name === 'Core Business')?.records || 0}</p>
                          <p className="text-sm text-muted-foreground">Coin Records</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold">{dbStats?.categories?.find(c => c.name === 'E-commerce')?.records || 0}</p>
                          <p className="text-sm text-muted-foreground">Store Records</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">{dbStats?.categories?.find(c => c.name === 'AI & Intelligence')?.records || 0}</p>
                          <p className="text-sm text-muted-foreground">AI Records</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Database Tables Grid */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Database Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {dbStats?.categories?.map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{category.name}</p>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs mb-1">
                              {category.tables} tables
                            </Badge>
                            <p className="text-xs text-muted-foreground">{category.records} records</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-green-600" />
                📈 REAL-TIME ANALYTICS
                <Badge className="bg-green-100 text-green-800">Live Data</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{analyticsStats?.totalEvents || 0}</p>
                          <p className="text-sm text-muted-foreground">Total Events</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{analyticsStats?.activeUsers || 0}</p>
                          <p className="text-sm text-muted-foreground">Active Users</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold">{analyticsStats?.pageViews || 0}</p>
                          <p className="text-sm text-muted-foreground">Page Views</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-2xl font-bold">{analyticsStats?.searchQueries || 0}</p>
                          <p className="text-sm text-muted-foreground">Search Queries</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERFORMANCE TAB - DEALER SPECIFIC */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
                🚀 DEALER PERFORMANCE
                <Badge className="bg-orange-100 text-orange-800">
                  {dealerCoins.length} Listed Coins
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{dealerCoins.length}</p>
                        <p className="text-sm text-muted-foreground">Total Listings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          ${dealerCoins.reduce((sum, coin) => sum + (coin.price || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {dealerCoins.filter(coin => coin.featured).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Featured Items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {dealerCoins.filter(coin => coin.is_auction).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Active Auctions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Listings */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dealerCoins.slice(0, 6).map((coin) => (
                    <Card key={coin.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={coin.image || '/placeholder.svg'} 
                            alt={coin.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">{coin.name}</p>
                            <p className="text-sm text-muted-foreground">{coin.year} • {coin.country}</p>
                            <p className="text-sm font-semibold text-green-600">
                              ${coin.price?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleDealerPanel;
