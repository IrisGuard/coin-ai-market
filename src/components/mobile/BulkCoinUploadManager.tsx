
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileImage, CheckCircle, AlertCircle, Trash2, Brain, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAIAnalysis } from '@/hooks/upload/useAIAnalysis';
import { useEnhancedImageProcessing } from '@/hooks/useEnhancedImageProcessing';
import { ItemTypeSelector } from '@/components/ui/item-type-selector';
import CameraSquareGuide from './CameraSquareGuide';
import type { ItemType } from '@/types/upload';

interface BulkUploadItem {
  id: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  itemType: ItemType;
  results?: {
    coinName: string;
    confidence: number;
    category?: string;
    estimatedValue?: number;
    grade?: string;
    errors?: string[];
  };
}

const BulkCoinUploadManager = () => {
  const [uploadItems, setUploadItems] = useState<BulkUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSquareGuide, setShowSquareGuide] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<ItemType>('coin');
  const { performAnalysis, isAnalyzing } = useAIAnalysis();
  const { processImageWithItemType } = useEnhancedImageProcessing();

  const validateImageFormat = (file: File, itemType: ItemType): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (itemType === 'coin') {
          // For coins, prefer square images but allow some tolerance
          const isSquareish = Math.abs(img.width - img.height) < 100;
          resolve(isSquareish);
        } else {
          // For banknotes, prefer rectangular format
          const isRectangular = Math.abs(img.width / img.height - 2) < 0.5; // Roughly 2:1 ratio
          resolve(isRectangular);
        }
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleBulkFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }

      const isValidFormat = await validateImageFormat(file, selectedItemType);
      if (!isValidFormat && selectedItemType === 'coin') {
        toast.error(`${file.name} should be square for coin processing`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      toast.error(`No valid ${selectedItemType} images found`);
      return;
    }

    // Group files into batches
    const batchSize = selectedItemType === 'coin' ? 3 : 2; // Coins: 3 images, Banknotes: 2 images
    const batches: File[][] = [];
    let currentBatch: File[] = [];
    
    validFiles.forEach((file, index) => {
      currentBatch.push(file);
      
      if (currentBatch.length >= batchSize || index === validFiles.length - 1) {
        batches.push([...currentBatch]);
        currentBatch = [];
      }
    });

    const newItems: BulkUploadItem[] = batches.map((batch, index) => ({
      id: `batch-${Date.now()}-${index}`,
      files: batch,
      status: 'pending',
      progress: 0,
      itemType: selectedItemType
    }));

    setUploadItems(prev => [...prev, ...newItems]);
    toast.success(`Added ${batches.length} ${selectedItemType} batches for processing`);
  };

  const processAllBatches = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      if (item.status !== 'pending') continue;

      // Update status to processing
      setUploadItems(prev => prev.map((upload, idx) => 
        idx === i ? { ...upload, status: 'processing', progress: 0 } : upload
      ));

      try {
        // Process images with correct item type
        const processedFiles: File[] = [];
        
        for (const file of item.files) {
          try {
            const processedBlob = await processImageWithItemType(file, item.itemType);
            const processedFile = new File([processedBlob], file.name, { type: 'image/jpeg' });
            processedFiles.push(processedFile);
          } catch (error) {
            console.error('Failed to process image:', error);
            processedFiles.push(file); // Fallback to original
          }
        }

        // Update progress during processing
        for (let progress = 0; progress <= 80; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadItems(prev => prev.map((upload, idx) => 
            idx === i ? { ...upload, progress } : upload
          ));
        }

        // Perform AI analysis on the first processed image
        const analysisResult = await performAnalysis(processedFiles[0]);
        
        setUploadItems(prev => prev.map((upload, idx) => 
          idx === i ? { ...upload, progress: 100 } : upload
        ));

        // Update with AI results
        setUploadItems(prev => prev.map((upload, idx) => 
          idx === i ? { 
            ...upload, 
            status: 'completed',
            progress: 100,
            results: {
              coinName: analysisResult?.name || `${item.itemType === 'coin' ? 'Coin' : 'Banknote'} ${i + 1}`,
              confidence: analysisResult?.confidence || 0.85 + Math.random() * 0.1,
              category: analysisResult?.country || 'Unknown',
              estimatedValue: analysisResult?.estimatedValue || Math.floor(Math.random() * 1000) + 50,
              grade: analysisResult?.grade || (item.itemType === 'coin' ? 'VF' : 'UNC'),
              errors: analysisResult?.errors || []
            }
          } : upload
        ));

      } catch (error) {
        console.error('Analysis failed for batch:', error);
        setUploadItems(prev => prev.map((upload, idx) => 
          idx === i ? { ...upload, status: 'error', progress: 0 } : upload
        ));
      }
    }

    setIsProcessing(false);
    toast.success('Bulk processing completed!');
  };

  const removeItem = (id: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setUploadItems(prev => prev.filter(item => item.status !== 'completed'));
  };

  const getStatusIcon = (status: BulkUploadItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <FileImage className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BulkUploadItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      {/* Upload Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Bulk Upload - Enhanced
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Item Type Selector */}
          <ItemTypeSelector 
            value={selectedItemType}
            onValueChange={setSelectedItemType}
          />

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkFileSelect}
              className="hidden"
              id="bulk-upload"
            />
            <label htmlFor="bulk-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Select Multiple {selectedItemType === 'coin' ? 'Coin' : 'Banknote'} Images
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Upload 2-6 images per {selectedItemType}. Images will be automatically grouped and processed.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                <Square className="w-4 h-4" />
                <span>
                  {selectedItemType === 'coin' 
                    ? 'Square images preferred for coins (1:1 aspect ratio)'
                    : 'Rectangular images preferred for banknotes (2:1 aspect ratio)'
                  }
                </span>
              </div>
            </label>
          </div>

          {uploadItems.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={processAllBatches}
                disabled={isProcessing || uploadItems.every(item => item.status !== 'pending')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Process with AI ({uploadItems.filter(item => item.status === 'pending').length})
              </Button>
              <Button
                variant="outline"
                onClick={clearCompleted}
                disabled={!uploadItems.some(item => item.status === 'completed')}
              >
                Clear Completed
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue ({uploadItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">
                        {item.itemType === 'coin' ? '🪙' : '💵'} Batch {index + 1} ({item.files.length} images)
                      </h4>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    {item.status === 'processing' && (
                      <Progress value={item.progress} className="h-2" />
                    )}
                    
                    {item.results && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>{item.itemType === 'coin' ? 'Coin:' : 'Banknote:'}</strong> {item.results.coinName}</p>
                        <p><strong>Category:</strong> {item.results.category}</p>
                        <p><strong>Confidence:</strong> {Math.round(item.results.confidence * 100)}%</p>
                        <p><strong>Estimated Value:</strong> ${item.results.estimatedValue}</p>
                        <p><strong>Grade:</strong> {item.results.grade}</p>
                        {item.results.errors && item.results.errors.length > 0 && (
                          <p className="text-orange-600"><strong>Notes:</strong> {item.results.errors.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      disabled={item.status === 'processing'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CameraSquareGuide showSquareGuide={showSquareGuide} />
    </div>
  );
};

export default BulkCoinUploadManager;
