import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Brain, CheckCircle, AlertCircle, Banknote, Coins, Square } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { useGlobalAIBrainIntegration, AIBrainAnalysis } from '@/hooks/dealer/useGlobalAIBrainIntegration';
import type { CoinCategory } from '@/types/coin';

interface MultiCategoryUploadData {
  name: string;
  year: number;
  denomination: string;
  country: string;
  grade: string;
  condition: string;
  price: number;
  description: string;
  category: CoinCategory;
  rarity: string;
  is_auction: boolean;
  featured: boolean;
  store_id: string;
  images: File[];
  // Banknote specific fields
  series?: string;
  serial_number?: string;
  printer?: string;
  security_features?: string[];
  error_type?: string;
  error_description?: string;
  // Bullion specific fields
  metal_type?: string;
  weight?: number;
  purity?: number;
  brand?: string;
  refinery?: string;
  assay_certificate?: boolean;
  hallmarks?: string[];
  dimensions?: any;
  // Coin specific fields
  mint?: string;
  composition?: string;
}

interface EnhancedMultiCategoryUploadFormProps {
  onUploadComplete?: (result: any) => void;
  maxImages?: number;
}

const EnhancedMultiCategoryUploadForm: React.FC<EnhancedMultiCategoryUploadFormProps> = ({
  onUploadComplete,
  maxImages = 10
}) => {
  const { user } = useAuth();
  const { selectedStoreId: adminSelectedStoreId, isAdminUser } = useAdminStore();
  const queryClient = useQueryClient();
  const { analyzeImageWithGlobalBrain, isAnalyzing } = useGlobalAIBrainIntegration();

  const [uploadData, setUploadData] = useState<Partial<MultiCategoryUploadData>>({
    name: '',
    year: new Date().getFullYear(),
    denomination: '',
    country: '',
    grade: 'VF',
    condition: 'Good',
    price: 0,
    description: '',
    category: 'modern',
    rarity: 'Common',
    is_auction: false,
    featured: false,
    store_id: '',
    images: []
  });

  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIBrainAnalysis | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');

  // 🧠 Phase 2B.2: Multi-category options
  const categoryOptions = [
    { value: 'modern', label: 'Modern Coins', icon: Coins },
    { value: 'ancient', label: 'Ancient Coins', icon: Coins },
    { value: 'gold', label: 'Gold Coins', icon: Coins },
    { value: 'silver', label: 'Silver Coins', icon: Coins },
    { value: 'error_coin', label: 'Error Coins', icon: Coins },
    { value: 'banknotes', label: 'Banknotes', icon: Banknote },
    { value: 'error_banknotes', label: 'Error Banknotes', icon: Banknote },
    { value: 'gold_bullion', label: 'Gold Bullion', icon: Square },
    { value: 'silver_bullion', label: 'Silver Bullion', icon: Square }
  ];

  const rarities = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Ultra Rare'];
  const grades = [
    'MS-70', 'MS-69', 'MS-68', 'MS-67', 'MS-66', 'MS-65', 'MS-64', 'MS-63', 'MS-62', 'MS-61', 'MS-60',
    'AU-58', 'AU-55', 'AU-53', 'AU-50',
    'XF-45', 'XF-40', 'VF-35', 'VF-30', 'VF-25', 'VF-20',
    'F-15', 'F-12', 'VG-10', 'VG-8', 'G-6', 'G-4'
  ];

  // Get effective store ID
  const getEffectiveStoreId = async () => {
    if (isAdminUser && adminSelectedStoreId) {
      return adminSelectedStoreId;
    }
    
    const { data: stores } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user?.id)
      .eq('is_active', true)
      .limit(1);
    
    return stores?.[0]?.id || '';
  };

  // 🧠 Phase 2B.2: Enhanced Image Upload with AI Analysis
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploadData(prev => ({ ...prev, images: files }));
    
    if (files.length > 0) {
      setUploadStatus('processing');
      
      try {
        console.log('🧠 Phase 2B.2: Starting Enhanced Multi-Category AI Analysis...');
        
        // Use enhanced AI Brain with multi-category support
        const aiResult = await analyzeImageWithGlobalBrain(files[0]);
        
        if (aiResult) {
          setAiAnalysisResult(aiResult);
          
          // 🧠 Phase 2B.2: Auto-fill form based on detected category and AI analysis
          setUploadData(prev => ({
            ...prev,
            name: aiResult.name,
            year: aiResult.year,
            country: aiResult.country,
            denomination: aiResult.denomination,
            grade: aiResult.grade,
            condition: aiResult.grade,
            price: aiResult.estimatedValue,
            description: aiResult.description,
            category: (aiResult.category as CoinCategory) || 'modern',
            rarity: aiResult.rarity,
            // Add category-specific fields if available
            ...(aiResult.specificFields || {})
          }));
          
          setUploadStatus('complete');
          toast.success(`🧠 Enhanced AI Analysis Complete! ${aiResult.name} detected as ${aiResult.category} with ${Math.round(aiResult.confidence * 100)}% confidence.`);
        } else {
          throw new Error('AI analysis failed');
        }
        
      } catch (error) {
        console.error('Enhanced AI analysis failed:', error);
        toast.error('AI analysis failed, please fill manually');
        setUploadStatus('idle');
      }
    }
  };

  // 🧠 Phase 2B.2: Multi-category upload mutation
  const uploadItemMutation = useMutation({
    mutationFn: async (data: MultiCategoryUploadData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const effectiveStoreId = await getEffectiveStoreId();
      if (!effectiveStoreId) {
        throw new Error('No store selected. Please create or select a store first.');
      }

      // Upload images first if any
      let imageUrl = '/placeholder-coin.jpg';
      const imageUrls: string[] = [];
      
      if (data.images && data.images.length > 0) {
        try {
          const firstImage = data.images[0];
          const fileName = `${user.id}/${Date.now()}-${firstImage.name}`;
          
          const { data: uploadResult, error: uploadError } = await supabase.storage
            .from('coin-images')
            .upload(fileName, firstImage);

          if (uploadError) throw uploadError;
          
          const { data: urlData } = supabase.storage
            .from('coin-images')
            .getPublicUrl(fileName);
          
          imageUrl = urlData.publicUrl;
          imageUrls.push(imageUrl);
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }

      // 🧠 Phase 2B.2: Route to appropriate table based on category
      let result, tableName;
      
      if (data.category === 'banknotes' || data.category === 'error_banknotes') {
        tableName = 'banknotes';
        const recordData = buildRecordData(data, effectiveStoreId, imageUrl, imageUrls) as any;
        const { data: banknoteResult, error } = await supabase.from('banknotes').insert(recordData).select().single();
        if (error) throw error;
        result = banknoteResult;
      } else if (data.category === 'gold_bullion' || data.category === 'silver_bullion') {
        tableName = 'bullion_bars';
        const recordData = buildRecordData(data, effectiveStoreId, imageUrl, imageUrls) as any;
        const { data: bullionResult, error } = await supabase.from('bullion_bars').insert(recordData).select().single();
        if (error) throw error;
        result = bullionResult;
      } else {
        tableName = 'coins';
        const recordData = buildRecordData(data, effectiveStoreId, imageUrl, imageUrls) as any;
        const { data: coinResult, error } = await supabase.from('coins').insert(recordData).select().single();
        if (error) throw error;
        result = coinResult;
      }
      return { result, tableName };
    },
    onSuccess: ({ result, tableName }) => {
      toast.success(`${getCategoryDisplayName(uploadData.category)} "${result.name}" uploaded successfully!`);
      setUploadStatus('complete');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['featuredCoins'] });
      queryClient.invalidateQueries({ queryKey: ['store-coins'] });
      queryClient.invalidateQueries({ queryKey: ['dealer-coins'] });
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      queryClient.invalidateQueries({ queryKey: [tableName] });
      
      if (onUploadComplete) {
        onUploadComplete({ result, aiAnalysis: aiAnalysisResult, tableName });
      }
    },
    onError: (error: any) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadStatus('idle');
    }
  });

  // 🧠 Phase 2B.2: Helper functions for multi-category support
  const getTableForCategory = (category: CoinCategory): string => {
    if (category === 'banknotes' || category === 'error_banknotes') {
      return 'banknotes';
    }
    if (category === 'gold_bullion' || category === 'silver_bullion') {
      return 'bullion_bars';
    }
    return 'coins';
  };

  const getCategoryDisplayName = (category?: CoinCategory): string => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.label : 'Item';
  };

  const buildRecordData = (data: MultiCategoryUploadData, storeId: string, imageUrl: string, imageUrls: string[]) => {
    const baseData = {
      user_id: user!.id,
      store_id: storeId,
      name: data.name,
      year: data.year,
      country: data.country,
      price: data.price,
      description: data.description,
      category: data.category,
      grade: data.grade,
      condition: data.condition,
      rarity: data.rarity,
      image: imageUrl,
      images: imageUrls,
      is_auction: data.is_auction,
      featured: data.featured,
      authentication_status: 'pending',
      views: 0,
      favorites: 0,
      sold: false,
      ai_confidence: aiAnalysisResult?.confidence || 0.8
    };

    // Add category-specific fields
    if (data.category === 'banknotes' || data.category === 'error_banknotes') {
      return {
        ...baseData,
        denomination: data.denomination,
        series: data.series,
        serial_number: data.serial_number,
        printer: data.printer,
        security_features: data.security_features,
        error_type: data.error_type,
        error_description: data.error_description
      };
    }

    if (data.category === 'gold_bullion' || data.category === 'silver_bullion') {
      return {
        ...baseData,
        metal_type: data.metal_type || (data.category === 'gold_bullion' ? 'gold' : 'silver'),
        weight: data.weight || 1,
        purity: data.purity || 0.999,
        brand: data.brand,
        refinery: data.refinery,
        assay_certificate: data.assay_certificate || false,
        hallmarks: data.hallmarks,
        dimensions: data.dimensions
      };
    }

    // Coins table
    return {
      ...baseData,
      denomination: data.denomination,
      composition: aiAnalysisResult?.composition || 'Unknown',
      mint: '',
      pcgs_number: '',
      ngc_number: '',
      pcgs_grade: '',
      ngc_grade: '',
      mintage: null,
      weight: null,
      diameter: null
    };
  };

  // 🧠 Phase 2B.2: Dynamic form fields based on category
  const renderCategorySpecificFields = () => {
    const category = uploadData.category;

    if (category === 'banknotes' || category === 'error_banknotes') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="series">Series</Label>
            <Input
              id="series"
              value={uploadData.series || ''}
              onChange={(e) => setUploadData(prev => ({ ...prev, series: e.target.value }))}
              placeholder="e.g., Series 1996"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serial_number">Serial Number</Label>
            <Input
              id="serial_number"
              value={uploadData.serial_number || ''}
              onChange={(e) => setUploadData(prev => ({ ...prev, serial_number: e.target.value }))}
              placeholder="e.g., A12345678B"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="printer">Printer</Label>
            <Input
              id="printer"
              value={uploadData.printer || ''}
              onChange={(e) => setUploadData(prev => ({ ...prev, printer: e.target.value }))}
              placeholder="e.g., Bureau of Engraving"
            />
          </div>

          {category === 'error_banknotes' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="error_type">Error Type</Label>
                <Input
                  id="error_type"
                  value={uploadData.error_type || ''}
                  onChange={(e) => setUploadData(prev => ({ ...prev, error_type: e.target.value }))}
                  placeholder="e.g., Misprint, Offset"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="error_description">Error Description</Label>
                <Textarea
                  id="error_description"
                  value={uploadData.error_description || ''}
                  onChange={(e) => setUploadData(prev => ({ ...prev, error_description: e.target.value }))}
                  placeholder="Detailed description of the printing error..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      );
    }

    if (category === 'gold_bullion' || category === 'silver_bullion') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metal_type">Metal Type</Label>
            <Select 
              value={uploadData.metal_type || (category === 'gold_bullion' ? 'gold' : 'silver')} 
              onValueChange={(value) => setUploadData(prev => ({ ...prev, metal_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="palladium">Palladium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (troy oz)</Label>
            <Input
              id="weight"
              type="number"
              step="0.001"
              value={uploadData.weight || ''}
              onChange={(e) => setUploadData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
              placeholder="e.g., 1.000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purity">Purity</Label>
            <Input
              id="purity"
              type="number"
              step="0.0001"
              value={uploadData.purity || ''}
              onChange={(e) => setUploadData(prev => ({ ...prev, purity: parseFloat(e.target.value) }))}
              placeholder="e.g., 0.9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand/Refinery</Label>
            <Input
              id="brand"
              value={uploadData.brand || ''}
              onChange={(e) => setUploadData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="e.g., PAMP Suisse, Perth Mint"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="assay_certificate"
                checked={uploadData.assay_certificate || false}
                onChange={(e) => setUploadData(prev => ({ ...prev, assay_certificate: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <Label htmlFor="assay_certificate">Has Assay Certificate</Label>
            </div>
          </div>
        </div>
      );
    }

    // Default coin fields
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mint">Mint</Label>
          <Input
            id="mint"
            value={uploadData.mint || ''}
            onChange={(e) => setUploadData(prev => ({ ...prev, mint: e.target.value }))}
            placeholder="e.g., Philadelphia, Denver"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="composition">Composition</Label>
          <Input
            id="composition"
            value={uploadData.composition || ''}
            onChange={(e) => setUploadData(prev => ({ ...prev, composition: e.target.value }))}
            placeholder="e.g., 90% Silver, 10% Copper"
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-600" />
          🧠 Phase 2B.2: Enhanced Multi-Category Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-4">
          <Label>Upload Images ({uploadData.images?.length || 0}/{maxImages})</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Click to upload images or drag and drop</p>
            </label>
          </div>
          
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-blue-600">
              <Brain className="w-4 h-4 animate-pulse" />
              <span>Analyzing with Enhanced AI Brain...</span>
            </div>
          )}
        </div>

        {/* AI Analysis Results */}
        {aiAnalysisResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">AI Analysis Complete</h3>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>Detected:</strong> {aiAnalysisResult.name}</p>
              <p><strong>Category:</strong> {getCategoryDisplayName(aiAnalysisResult.category as CoinCategory)}</p>
              <p><strong>Confidence:</strong> {Math.round(aiAnalysisResult.confidence * 100)}%</p>
              <p><strong>Sources:</strong> {aiAnalysisResult.source_analysis.sources_consulted.length} consulted</p>
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={uploadData.category} 
            onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value as CoinCategory }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={uploadData.name}
              onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`e.g., ${getCategoryDisplayName(uploadData.category)} Name`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={uploadData.price}
              onChange={(e) => setUploadData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={uploadData.year}
              onChange={(e) => setUploadData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              placeholder="e.g., 2023"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={uploadData.country}
              onChange={(e) => setUploadData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="e.g., United States"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="denomination">Denomination</Label>
            <Input
              id="denomination"
              value={uploadData.denomination}
              onChange={(e) => setUploadData(prev => ({ ...prev, denomination: e.target.value }))}
              placeholder="e.g., Dollar, Euro, 1 oz"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select value={uploadData.grade} onValueChange={(value) => setUploadData(prev => ({ ...prev, grade: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rarity">Rarity</Label>
            <Select value={uploadData.rarity} onValueChange={(value) => setUploadData(prev => ({ ...prev, rarity: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rarities.map(rarity => (
                  <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category-Specific Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {getCategoryDisplayName(uploadData.category)} Specific Details
          </h3>
          {renderCategorySpecificFields()}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={uploadData.description}
            onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
            placeholder={`Describe this ${getCategoryDisplayName(uploadData.category).toLowerCase()}...`}
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={() => uploadItemMutation.mutate(uploadData as MultiCategoryUploadData)}
          disabled={uploadItemMutation.isPending || !uploadData.name || !uploadData.price}
          className="w-full"
        >
          {uploadItemMutation.isPending ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-spin" />
              Uploading {getCategoryDisplayName(uploadData.category)}...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {getCategoryDisplayName(uploadData.category)}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedMultiCategoryUploadForm;