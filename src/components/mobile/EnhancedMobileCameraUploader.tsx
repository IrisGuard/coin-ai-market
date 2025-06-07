
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  X,
  RotateCcw,
  FlipHorizontal,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnhancedMobileCameraUploaderProps {
  onImagesSelected: (images: { file: File; preview: string }[]) => void;
  maxImages?: number;
  onComplete: () => void;
}

const EnhancedMobileCameraUploader = ({ 
  onImagesSelected, 
  maxImages = 5,
  onComplete 
}: EnhancedMobileCameraUploaderProps) => {
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + selectedImages.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    const newImages: { file: File; preview: string }[] = [];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        
        newImages.push({ file, preview });
      }
    }

    const updatedImages = [...selectedImages, ...newImages];
    setSelectedImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  const handleComplete = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please capture at least one image",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getQualityBadge = (file: File) => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 2) return { label: "High Quality", color: "bg-green-50 text-green-700 border-green-300" };
    if (sizeMB > 0.5) return { label: "Good Quality", color: "bg-blue-50 text-blue-700 border-blue-300" };
    return { label: "Basic Quality", color: "bg-yellow-50 text-yellow-700 border-yellow-300" };
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Enhanced Mobile Camera
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Camera Interface */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Camera className="w-10 h-10 text-blue-600" />
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Capture Coin Images</h3>
            <p className="text-sm text-gray-600 mb-4">
              Take clear photos from multiple angles for best AI analysis
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleCameraCapture}
              disabled={selectedImages.length >= maxImages}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedImages.length >= maxImages}
            >
              <Upload className="w-4 h-4 mr-2" />
              Gallery
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Image Preview Grid */}
        {selectedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Captured Images ({selectedImages.length}/{maxImages})</h4>
              <Badge variant="outline" className="text-xs">
                Ready for Analysis
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {selectedImages.map((image, index) => {
                const quality = getQualityBadge(image.file);
                return (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Coin ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <Badge 
                      variant="outline" 
                      className={`absolute bottom-1 left-1 text-xs ${quality.color}`}
                    >
                      {quality.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading images...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        {selectedImages.length > 0 && (
          <div className="flex gap-3">
            <Button 
              onClick={handleComplete}
              disabled={uploadProgress > 0 && uploadProgress < 100}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedImages([]);
                onImagesSelected([]);
              }}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Photography Tips</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Use good lighting - natural light is best</li>
            <li>• Keep the coin flat and centered</li>
            <li>• Capture both obverse and reverse sides</li>
            <li>• Avoid shadows and reflections</li>
            <li>• Higher resolution images give better results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMobileCameraUploader;
