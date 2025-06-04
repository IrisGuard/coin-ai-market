
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Pause, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Trash2,
  RefreshCw,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { useCreateCoin, useAICoinRecognition } from '@/hooks/useCoins';
import { toast } from '@/hooks/use-toast';

interface CoinBatch {
  id: string;
  name: string;
  images: File[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  aiResult?: any;
  error?: string;
  estimatedValue?: number;
}

interface BulkCoinUploadManagerProps {
  onComplete?: () => void;
}

const BulkCoinUploadManager = ({ onComplete }: BulkCoinUploadManagerProps) => {
  const [batches, setBatches] = useState<CoinBatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createCoin = useCreateCoin();
  const aiRecognition = useAICoinRecognition();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Group images into batches (assuming 2-6 images per coin)
    const newBatches: CoinBatch[] = [];
    let currentImages: File[] = [];
    let batchIndex = 1;

    files.forEach((file, index) => {
      currentImages.push(file);
      
      // Create batch every 2-4 images or at the end
      if (currentImages.length >= 2 && (currentImages.length >= 4 || index === files.length - 1)) {
        newBatches.push({
          id: `batch-${Date.now()}-${batchIndex}`,
          name: `Coin ${batchIndex}`,
          images: [...currentImages],
          status: 'pending',
          progress: 0
        });
        currentImages = [];
        batchIndex++;
      }
    });

    setBatches(prev => [...prev, ...newBatches]);
    
    toast({
      title: "Images Added",
      description: `Added ${newBatches.length} coin batches for processing`,
    });
  };

  const processBatch = async (batch: CoinBatch, index: number) => {
    try {
      // Update batch status
      setBatches(prev => prev.map((b, i) => 
        i === index ? { ...b, status: 'processing', progress: 0 } : b
      ));

      // Step 1: AI Analysis (50% progress)
      const primaryImage = await convertFileToBase64(batch.images[0]);
      const additionalImages = await Promise.all(
        batch.images.slice(1).map(img => convertFileToBase64(img))
      );

      setBatches(prev => prev.map((b, i) => 
        i === index ? { ...b, progress: 25 } : b
      ));

      const aiResult = await aiRecognition.mutateAsync({
        image: primaryImage,
        additionalImages
      });

      setBatches(prev => prev.map((b, i) => 
        i === index ? { ...b, progress: 50, aiResult } : b
      ));

      // Step 2: Create Coin (100% progress)
      await createCoin.mutateAsync({
        name: aiResult?.name || 'Unidentified Coin',
        year: aiResult?.year || new Date().getFullYear(),
        country: aiResult?.country || 'Unknown',
        grade: aiResult?.grade || 'Ungraded',
        price: aiResult?.estimated_value || 10,
        rarity: aiResult?.rarity || 'Common',
        condition: aiResult?.condition || 'Good',
        composition: aiResult?.composition || 'Unknown',
        diameter: aiResult?.diameter,
        weight: aiResult?.weight,
        mint: aiResult?.mint || 'Unknown',
        description: aiResult?.description || 'Bulk uploaded coin',
        image: primaryImage,
      });

      setBatches(prev => prev.map((b, i) => 
        i === index ? { 
          ...b, 
          status: 'completed', 
          progress: 100,
          estimatedValue: aiResult?.estimated_value || 10
        } : b
      ));

    } catch (error) {
      console.error('Error processing batch:', error);
      setBatches(prev => prev.map((b, i) => 
        i === index ? { 
          ...b, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Processing failed'
        } : b
      ));
    }
  };

  const startBulkProcessing = async () => {
    setIsProcessing(true);
    setIsPaused(false);
    
    const pendingBatches = batches.filter(b => b.status === 'pending' || b.status === 'failed');
    
    for (let i = 0; i < pendingBatches.length; i++) {
      if (isPaused) break;
      
      const batchIndex = batches.findIndex(b => b.id === pendingBatches[i].id);
      setCurrentBatchIndex(batchIndex);
      
      await processBatch(pendingBatches[i], batchIndex);
      
      // Update overall progress
      const completedCount = batches.filter(b => b.status === 'completed').length + i + 1;
      setOverallProgress((completedCount / batches.length) * 100);
      
      // Small delay between batches to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsProcessing(false);
    
    toast({
      title: "Bulk Upload Complete",
      description: `Processed ${batches.filter(b => b.status === 'completed').length} coins successfully`,
    });
    
    onComplete?.();
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    setIsProcessing(false);
  };

  const resumeProcessing = () => {
    setIsPaused(false);
    startBulkProcessing();
  };

  const removeBatch = (index: number) => {
    setBatches(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setBatches(prev => prev.filter(b => b.status !== 'completed'));
  };

  const retryFailed = () => {
    setBatches(prev => prev.map(b => 
      b.status === 'failed' ? { ...b, status: 'pending', error: undefined } : b
    ));
  };

  const getStatusIcon = (status: CoinBatch['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <Upload className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: CoinBatch['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = batches.filter(b => b.status === 'completed').length;
  const failedCount = batches.filter(b => b.status === 'failed').length;
  const totalValue = batches
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.estimatedValue || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Upload Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Bulk Coin Upload Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Coin Images
            </Button>
            
            {batches.length > 0 && !isProcessing && (
              <Button
                onClick={startBulkProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Processing
              </Button>
            )}
            
            {isProcessing && !isPaused && (
              <Button
                onClick={pauseProcessing}
                variant="outline"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isPaused && (
              <Button
                onClick={resumeProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
          </div>

          {/* Overall Progress */}
          {batches.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}

          {/* Statistics */}
          {batches.length > 0 && (
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{batches.length}</div>
                <div className="text-xs text-blue-600">Total Batches</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <div className="text-xs text-red-600">Failed</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${totalValue.toFixed(0)}</div>
                <div className="text-xs text-purple-600">Total Value</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {batches.length > 0 && (
            <div className="flex gap-2">
              {failedCount > 0 && (
                <Button
                  onClick={retryFailed}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Failed ({failedCount})
                </Button>
              )}
              
              {completedCount > 0 && (
                <Button
                  onClick={clearCompleted}
                  variant="outline"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Clear Completed ({completedCount})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch List */}
      {batches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {batches.map((batch, index) => (
                <div
                  key={batch.id}
                  className={`p-4 border rounded-lg ${
                    currentBatchIndex === index && isProcessing ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(batch.status)}
                      <div>
                        <h4 className="font-medium">{batch.name}</h4>
                        <p className="text-sm text-gray-600">
                          {batch.images.length} images
                          {batch.aiResult && ` • ${batch.aiResult.name}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                      
                      {batch.estimatedValue && (
                        <Badge className="bg-green-100 text-green-800">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${batch.estimatedValue}
                        </Badge>
                      )}
                      
                      <Button
                        onClick={() => removeBatch(index)}
                        size="sm"
                        variant="ghost"
                        disabled={batch.status === 'processing'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {batch.status === 'processing' && (
                    <Progress value={batch.progress} className="h-1" />
                  )}
                  
                  {batch.error && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      Error: {batch.error}
                    </div>
                  )}
                  
                  {/* Image Preview */}
                  <div className="flex gap-2 mt-2">
                    {batch.images.slice(0, 3).map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${imgIndex + 1}`}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ))}
                    {batch.images.length > 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                        +{batch.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {batches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready for Bulk Upload</h3>
            <p className="text-gray-600 mb-4">
              Select multiple coin images to process them in batches.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>💡 Group 2-6 images per coin for best results</p>
              <p>⚡ AI will analyze each coin automatically</p>
              <p>📊 Track progress and manage batches efficiently</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkCoinUploadManager;
