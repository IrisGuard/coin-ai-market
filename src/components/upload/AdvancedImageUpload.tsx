
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X, Check, AlertTriangle, Zap, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ImageValidationResult {
  isValid: boolean;
  isSquare: boolean;
  hasValidBackground: boolean;
  errors: string[];
  dimensions: { width: number; height: number };
}

interface ProcessedImage {
  file: File;
  preview: string;
  validation: ImageValidationResult;
  isProcessing: boolean;
  aiResult?: any;
}

interface AdvancedImageUploadProps {
  onImagesProcessed: (images: ProcessedImage[]) => void;
  maxImages?: number;
}

const AdvancedImageUpload: React.FC<AdvancedImageUploadProps> = ({
  onImagesProcessed,
  maxImages = 10
}) => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Image validation function
  const validateImage = async (file: File): Promise<ImageValidationResult> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        const { width, height } = img;
        
        // Check if image is square
        const isSquare = width === height;
        
        // Check background color (simplified - would need more sophisticated analysis)
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0);
        
        // Sample corners to check background
        const imageData = ctx?.getImageData(0, 0, width, height);
        let hasValidBackground = true;
        
        if (imageData) {
          // Sample corners and edges for background detection
          const corners = [
            [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]
          ];
          
          for (const [x, y] of corners) {
            const index = (y * width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            
            // Check if background is white or light gray
            const isWhite = r > 240 && g > 240 && b > 240;
            const isGray = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 200;
            
            if (!isWhite && !isGray) {
              hasValidBackground = false;
              break;
            }
          }
        }
        
        const errors: string[] = [];
        if (!isSquare) errors.push('Image must be square (1:1 aspect ratio)');
        if (!hasValidBackground) errors.push('Image must have white or neutral gray background');
        
        resolve({
          isValid: isSquare && hasValidBackground,
          isSquare,
          hasValidBackground,
          errors,
          dimensions: { width, height }
        });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Convert image to square if needed
  const makeImageSquare = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        const { width, height } = img;
        const size = Math.min(width, height);
        
        canvas.width = size;
        canvas.height = size;
        
        // Center crop to square
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;
        
        // Fill with white background first
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const squareFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(squareFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const processImages = async (files: File[]) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    const newImages: ProcessedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress((i / files.length) * 50);
      
      try {
        // Validate original image
        const validation = await validateImage(file);
        
        let processedFile = file;
        let finalValidation = validation;
        
        // If not square, offer to make it square
        if (!validation.isSquare) {
          processedFile = await makeImageSquare(file);
          finalValidation = await validateImage(processedFile);
        }
        
        const processedImage: ProcessedImage = {
          file: processedFile,
          preview: URL.createObjectURL(processedFile),
          validation: finalValidation,
          isProcessing: false
        };
        
        newImages.push(processedImage);
        
        if (finalValidation.isValid) {
          toast.success(`Image ${i + 1} processed successfully`);
        } else {
          toast.error(`Image ${i + 1}: ${finalValidation.errors.join(', ')}`);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error(`Failed to process image ${i + 1}`);
      }
    }
    
    setUploadProgress(100);
    setImages(prev => [...prev, ...newImages]);
    onImagesProcessed([...images, ...newImages]);
    
    setTimeout(() => {
      setUploadProgress(0);
      setIsProcessing(false);
    }, 1000);
  };

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }
    
    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    await processImages(validFiles);
  }, [images.length, maxImages]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesProcessed(newImages);
  };

  const validImages = images.filter(img => img.validation.isValid);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-indigo-600" />
          Advanced Image Upload ({images.length}/{maxImages})
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
          <div className="space-y-4">
            <div className="flex justify-center">
              <Square className="w-16 h-16 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload Square Coin Photos
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop up to {maxImages} images or click to browse
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>✓ Square images (1:1 ratio) preferred</p>
                <p>✓ White or neutral gray background</p>
                <p>✓ High quality, well-lit photos</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isProcessing || images.length >= maxImages}
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
              
              {/* Mobile Camera Support */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                disabled={isProcessing || images.length >= maxImages}
                className="md:hidden"
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-sm font-medium">Processing images...</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Uploaded Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Validation Status */}
                    <div className="absolute top-2 right-2">
                      {image.validation.isValid ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 left-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* Validation Details */}
                  {!image.validation.isValid && (
                    <div className="mt-2">
                      <Alert variant="destructive" className="p-2">
                        <AlertTriangle className="w-3 h-3" />
                        <AlertDescription className="text-xs">
                          {image.validation.errors.join(', ')}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {/* Image Info */}
                  <div className="mt-1 text-xs text-gray-500 text-center">
                    {image.validation.dimensions.width}×{image.validation.dimensions.height}
                    {image.validation.isSquare && (
                      <span className="text-green-600 ml-1">■ Square</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Upload Summary:</span>
                <div className="flex gap-4">
                  <span className="text-green-600">
                    ✓ {validImages.length} Valid
                  </span>
                  <span className="text-red-600">
                    ✗ {images.length - validImages.length} Issues
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedImageUpload;
