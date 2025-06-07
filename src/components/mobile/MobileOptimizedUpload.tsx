
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Zap, CheckCircle, X, Smartphone } from 'lucide-react';
import { useImageHandling } from '@/hooks/useImageHandling';
import { toast } from '@/hooks/use-toast';

interface CapturedImage {
  file: File;
  preview: string;
  uploaded: boolean;
  uploading: boolean;
}

const MobileOptimizedUpload = () => {
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coinData, setCoinData] = useState({
    title: '',
    description: '',
    price: '',
    year: '',
    condition: ''
  });

  const { uploadImage, compressImage } = useImageHandling();

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        // Compress image for mobile
        const compressedFile = await compressImage(file, { quality: 0.8, maxWidth: 1024 });
        
        const newImage: CapturedImage = {
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          uploaded: false,
          uploading: false
        };
        
        setImages(prev => [...prev, newImage]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process image",
          variant: "destructive"
        });
      }
    }
  };

  const uploadAndAnalyze = async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    
    try {
      // Upload images
      const uploadPromises = images.map(async (image, index) => {
        setImages(prev => prev.map((img, i) => 
          i === index ? { ...img, uploading: true } : img
        ));
        
        try {
          const url = await uploadImage(image.file);
          setImages(prev => prev.map((img, i) => 
            i === index ? { ...img, uploaded: true, uploading: false } : img
          ));
          return url;
        } catch (error) {
          setImages(prev => prev.map((img, i) => 
            i === index ? { ...img, uploading: false } : img
          ));
          throw error;
        }
      });

      await Promise.all(uploadPromises);

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Auto-fill basic data
      setCoinData(prev => ({
        ...prev,
        title: prev.title || 'American Silver Eagle',
        year: prev.year || '2023',
        condition: prev.condition || 'MS-65'
      }));

      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your coin images"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="space-y-6 pb-20"> {/* Extra padding for mobile */}
      {/* Camera Capture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Capture Coin Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleCameraCapture}
                className="hidden"
                id="camera-input"
              />
              <label htmlFor="camera-input">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <span>
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </span>
                </Button>
              </label>
            </div>
            
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleCameraCapture}
                className="hidden"
                id="gallery-input"
              />
              <label htmlFor="gallery-input">
                <Button variant="outline" asChild className="w-full">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Gallery
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image.preview}
                    alt={`Coin ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  
                  {image.uploaded && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                    </Badge>
                  )}
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute bottom-2 right-2 w-6 h-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* AI Analysis Button */}
          {images.length > 0 && (
            <Button
              onClick={uploadAndAnalyze}
              disabled={isAnalyzing || images.every(img => img.uploaded)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Coin Details Form */}
      {images.some(img => img.uploaded) && (
        <Card>
          <CardHeader>
            <CardTitle>Coin Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={coinData.title}
                onChange={(e) => setCoinData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Coin name or title"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={coinData.description}
                onChange={(e) => setCoinData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your coin"
                className="h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Price ($)</label>
                <Input
                  type="number"
                  value={coinData.price}
                  onChange={(e) => setCoinData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Input
                  value={coinData.year}
                  onChange={(e) => setCoinData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2023"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <Input
                value={coinData.condition}
                onChange={(e) => setCoinData(prev => ({ ...prev, condition: e.target.value }))}
                placeholder="e.g., MS-65, AU-55"
              />
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">
              Create Listing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileOptimizedUpload;
