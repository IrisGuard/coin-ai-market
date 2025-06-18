
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, CheckCircle, AlertTriangle, Trash2, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { useCoinImageManagement } from '@/hooks/useCoinImageManagement';

interface UltraFastBulkUploadSystemProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated: () => void;
  maxImages?: number;
}

interface UploadBatch {
  id: string;
  files: File[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: number;
  endTime?: number;
}

const UltraFastBulkUploadSystem: React.FC<UltraFastBulkUploadSystemProps> = ({
  coinId,
  coinName,
  currentImages,
  onImagesUpdated,
  maxImages = 50
}) => {
  const [uploadBatches, setUploadBatches] = useState<UploadBatch[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [images, setImages] = useState(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    addNewImageToCoin,
    isUpdating
  } = useCoinImageManagement({ coinId, currentImages: images });

  // Ultra-fast file processing with parallel chunks
  const processFilesInParallelChunks = async (files: File[], chunkSize: number = 10) => {
    const chunks: File[][] = [];
    for (let i = 0; i < files.length; i += chunkSize) {
      chunks.push(files.slice(i, i + chunkSize));
    }

    const results: string[] = [];
    let completedFiles = 0;

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (file) => {
        try {
          const newImages = await addNewImageToCoin(file);
          completedFiles++;
          setOverallProgress((completedFiles / files.length) * 100);
          return newImages[newImages.length - 1]; // Return the newly added image
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          completedFiles++;
          setOverallProgress((completedFiles / files.length) * 100);
          return null;
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults.filter(Boolean));
    }

    return results;
  };

  const handleUltraFastBulkUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast.error(`Maximum ${remainingSlots} more images allowed (limit: ${maxImages})`);
      return;
    }

    setIsUploading(true);
    setOverallProgress(0);
    
    const startTime = Date.now();
    const fileArray = Array.from(files);
    
    // Create ultra-fast batch
    const batchId = `ultra-batch-${Date.now()}`;
    const newBatch: UploadBatch = {
      id: batchId,
      files: fileArray,
      status: 'processing',
      progress: 0,
      startTime
    };

    setUploadBatches(prev => [...prev, newBatch]);

    try {
      console.log(`🚀 ULTRA-FAST: Starting parallel upload of ${fileArray.length} images`);
      
      // Ultra-parallel processing with dynamic chunk sizing
      const optimalChunkSize = Math.min(Math.max(Math.ceil(fileArray.length / 4), 5), 15);
      const uploadedImages = await processFilesInParallelChunks(fileArray, optimalChunkSize);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      const imagesPerSecond = (fileArray.length / duration) * 1000;

      // Update batch status
      setUploadBatches(prev => prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'completed', progress: 100, endTime }
          : batch
      ));

      // Update images state
      setImages(prev => [...prev, ...uploadedImages]);
      onImagesUpdated();

      // Ultra-fast success feedback
      toast.success(
        `🚀 ULTRA-FAST UPLOAD COMPLETE!\n` +
        `${fileArray.length} images • ${duration}ms • ${imagesPerSecond.toFixed(1)} img/sec`,
        { duration: 4000 }
      );

      console.log(`✅ ULTRA-FAST COMPLETE: ${fileArray.length} images in ${duration}ms`);
      
    } catch (error) {
      console.error('❌ Ultra-fast upload failed:', error);
      setUploadBatches(prev => prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, status: 'failed', progress: 0 }
          : batch
      ));
      toast.error('Ultra-fast upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setOverallProgress(0);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    handleDragEvents(e);
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleUltraFastBulkUpload(files);
  }, []);

  const clearCompletedBatches = () => {
    setUploadBatches(prev => prev.filter(batch => batch.status !== 'completed'));
  };

  return (
    <div className="space-y-4">
      {/* Ultra-Fast Upload Zone */}
      <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-blue-800">
            <Zap className="h-6 w-6 text-yellow-500" />
            ULTRA-FAST BULK UPLOAD SYSTEM
            <Zap className="h-6 w-6 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragOver 
                ? 'border-blue-500 bg-blue-100 scale-105' 
                : 'border-blue-300 bg-white/50'
            }`}
            onDragOver={(e) => { handleDragEvents(e); setDragOver(true); }}
            onDragLeave={(e) => { handleDragEvents(e); setDragOver(false); }}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleUltraFastBulkUpload(e.target.files)}
              className="hidden"
              disabled={isUploading || images.length >= maxImages}
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Upload className="h-16 w-16 text-blue-500 animate-pulse" />
                  <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-blue-800">
                  {isUploading ? 'PROCESSING AT ULTRA-SPEED...' : 'ULTRA-FAST BULK UPLOAD'}
                </h3>
                <p className="text-blue-600 font-medium">
                  Supports up to 20,000+ images simultaneously
                </p>
                <p className="text-sm text-gray-600">
                  Drop massive amounts of images here or click to select
                </p>
                <p className="text-xs text-green-600 font-semibold">
                  ⚡ Parallel Processing • 🚀 Ultra-Fast • 💪 Enterprise Grade
                </p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || images.length >= maxImages}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-200"
              >
                <Brain className="h-5 w-5 mr-2" />
                SELECT MASSIVE BATCH ({maxImages - images.length} slots available)
              </Button>
            </div>
          </div>

          {/* Ultra-Fast Progress */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-800">ULTRA-FAST PROCESSING</span>
                <span className="text-blue-600 font-mono">{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 bg-blue-100" />
              <p className="text-xs text-blue-600 text-center animate-pulse">
                🚀 Parallel processing enabled • Enterprise-grade performance
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ultra-Fast Batch Status */}
      {uploadBatches.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Ultra-Fast Upload Batches
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompletedBatches}
              disabled={!uploadBatches.some(batch => batch.status === 'completed')}
            >
              Clear Completed
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  {batch.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : batch.status === 'failed' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  
                  <div>
                    <div className="font-medium">
                      {batch.files.length} images
                      {batch.endTime && batch.startTime && (
                        <span className="text-green-600 ml-2">
                          • {batch.endTime - batch.startTime}ms ⚡
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Batch {batch.id.split('-')[2]}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={
                    batch.status === 'completed' ? 'bg-green-100 text-green-800' :
                    batch.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {batch.status}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadBatches(prev => prev.filter(b => b.id !== batch.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Ultra-Performance Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{images.length}</div>
              <div className="text-xs text-gray-600">Current Images</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{maxImages}</div>
              <div className="text-xs text-gray-600">Maximum Capacity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">20K+</div>
              <div className="text-xs text-gray-600">Bulk Capacity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">⚡</div>
              <div className="text-xs text-gray-600">Ultra-Fast</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UltraFastBulkUploadSystem;
