import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Camera, 
  X, 
  Check, 
  AlertTriangle, 
  Zap, 
  Eye,
  RotateCw,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useDualImageAnalysis } from '@/hooks/useDualImageAnalysis';
import { useEnhancedImageProcessing } from '@/hooks/useEnhancedImageProcessing';
import { ItemTypeSelector } from '@/components/ui/item-type-selector';
import type { ItemType } from '@/types/upload';

interface ProcessedImage {
  file: File;
  preview: string;
  uploaded: boolean;
  uploading: boolean;
  aiAnalyzed: boolean;
  errors: string[];
  id: string;
  itemType?: ItemType;
}

interface AdvancedImageUploadManagerProps {
  onImagesProcessed: (images: ProcessedImage[]) => void;
  onAIAnalysisComplete: (results: any) => void;
  maxImages?: number;
}

const AdvancedImageUploadManager: React.FC<AdvancedImageUploadManagerProps> = ({
  onImagesProcessed,
  onAIAnalysisComplete,
  maxImages = 10
}) => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedItemType, setSelectedItemType] = useState<ItemType>('coin');
  
  const { performDualAnalysis, isAnalyzing, analysisProgress, currentStep } = useDualImageAnalysis();
  const { processImageWithItemType, isProcessing } = useEnhancedImageProcessing();

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Process images with selected item type
    const processedImages: ProcessedImage[] = [];
    
    for (const file of fileArray) {
      try {
        // Process image based on selected item type
        const processedBlob = await processImageWithItemType(file, selectedItemType);
        const processedFile = new File([processedBlob], file.name, { type: 'image/jpeg' });
        
        processedImages.push({
          file: processedFile,
          preview: URL.createObjectURL(processedBlob),
          uploaded: false,
          uploading: false,
          aiAnalyzed: false,
          errors: [],
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          itemType: selectedItemType
        });
      } catch (error) {
        console.error('Failed to process image:', error);
        // Fallback to original file
        processedImages.push({
          file,
          preview: URL.createObjectURL(file),
          uploaded: false,
          uploading: false,
          aiAnalyzed: false,
          errors: ['Processing failed - using original'],
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          itemType: selectedItemType
        });
      }
    }

    setImages(prev => [...prev, ...processedImages]);
  }, [images.length, maxImages, selectedItemType, processImageWithItemType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const uploadImages = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload process
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, uploading: true } : img
        ));

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, uploading: false, uploaded: true } : img
        ));

        setUploadProgress(((i + 1) / images.length) * 100);
      }

      toast.success('All images uploaded successfully!');
      onImagesProcessed(images);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const performAIAnalysis = async () => {
    if (images.length < 2) {
      toast.error('Please upload at least 2 images (front and back) for AI analysis');
      return;
    }

    try {
      const frontImage = images[0].file;
      const backImage = images[1].file;
      
      const results = await performDualAnalysis(frontImage, backImage);
      
      if (results) {
        setImages(prev => prev.map(img => ({ ...img, aiAnalyzed: true })));
        onAIAnalysisComplete(results);
        toast.success('AI analysis completed successfully!');
      }
    } catch (error) {
      toast.error('AI analysis failed. Please try again.');
    }
  };

  const canUpload = images.length > 0 && !isUploading;
  const canAnalyze = images.length >= 2 && images.some(img => img.uploaded) && !isAnalyzing;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Advanced Image Upload
          <Badge variant="outline">{images.length}/{maxImages}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Item Type Selector */}
        <ItemTypeSelector 
          value={selectedItemType}
          onValueChange={setSelectedItemType}
        />

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Upload up to {maxImages} {selectedItemType === 'coin' ? 'coin' : 'banknote'} images
          </h3>
          <p className="text-gray-600 mb-4">
            Drag & drop images here, or click to select files
          </p>
          
          <div className="flex gap-4 justify-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </span>
              </Button>
            </label>
            
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="camera-upload"
            />
            <label htmlFor="camera-upload">
              <Button variant="outline" asChild>
                <span>
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Image Preview Grid */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className={`w-full border-2 border-gray-200 overflow-hidden ${
                    image.itemType === 'coin' ? 'aspect-square rounded-full' : 'aspect-[2/1] rounded-lg'
                  }`}>
                    <img
                      src={image.preview}
                      alt={image.itemType === 'coin' ? 'Coin' : 'Banknote'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="absolute top-2 left-2 space-y-1">
                    {image.uploading && (
                      <Badge variant="secondary" className="text-xs">
                        <RotateCw className="w-3 h-3 mr-1 animate-spin" />
                        Uploading...
                      </Badge>
                    )}
                    {image.uploaded && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                    {image.aiAnalyzed && (
                      <Badge variant="default" className="text-xs bg-purple-500">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Analyzed
                      </Badge>
                    )}
                  </div>

                  {/* Item Type Badge */}
                  <Badge variant="outline" className="absolute bottom-2 left-2 text-xs">
                    {image.itemType === 'coin' ? '🪙' : '💵'}
                  </Badge>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Image Index */}
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="text-xs">
                      {images.indexOf(image) + 1}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading images...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* AI Analysis Progress */}
        {isAnalyzing && (
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="flex justify-between">
                <span>{currentStep}</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} />
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={uploadImages}
            disabled={!canUpload}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </>
            )}
          </Button>

          <Button
            onClick={performAIAnalysis}
            disabled={!canAnalyze}
            variant="outline"
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                AI Analysis
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        <Alert>
          <Eye className="h-4 w-4" />
          <AlertDescription>
            <strong>Pro Tips:</strong> Select the correct item type before uploading. 
            {selectedItemType === 'coin' ? 'Coins will be cropped to circular shape.' : 'Banknotes will maintain rectangular format.'}
            All images get consistent #F5F5F5 background.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AdvancedImageUploadManager;
