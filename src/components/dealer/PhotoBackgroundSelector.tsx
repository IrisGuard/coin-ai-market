
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';
import { useEnhancedImageProcessing } from '@/hooks/useEnhancedImageProcessing';
import type { ItemType } from '@/types/upload';
import { BackgroundColorSelector } from './photo-background/BackgroundColorSelector';
import { ImageUploadArea } from './photo-background/ImageUploadArea';
import { ProcessingProgress } from './photo-background/ProcessingProgress';
import { ProcessedImageGrid } from './photo-background/ProcessedImageGrid';

const PhotoBackgroundSelector = () => {
  const [selectedBackground, setSelectedBackground] = useState('#FFFFFF');
  const [selectedItemType, setSelectedItemType] = useState<ItemType>('coin');
  const { 
    isProcessing, 
    processedImages, 
    processMultipleImages, 
    setProcessedImages 
  } = useEnhancedImageProcessing();

  const backgrounds = [
    { id: 'white', name: 'White', color: '#FFFFFF', preview: 'bg-white border-2' },
    { id: 'black', name: 'Black', color: '#000000', preview: 'bg-black' },
    { id: 'blue', name: 'Blue', color: '#3B82F6', preview: 'bg-blue-500' },
    { id: 'gray', name: 'Gray', color: '#6B7280', preview: 'bg-gray-500' },
    { id: 'green', name: 'Green', color: '#10B981', preview: 'bg-green-500' },
    { id: 'transparent', name: 'Transparent', color: 'transparent', preview: 'bg-gray-100 border-2 border-dashed' }
  ];

  const processWithBackground = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    console.log('🔍 DEBUG PhotoBackgroundSelector - Processing files:', fileArray.length);
    await processMultipleImages(fileArray, selectedItemType);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processWithBackground(files);
    }
  };

  const downloadProcessedImage = (imageData: any) => {
    const link = document.createElement('a');
    link.href = imageData.processed;
    link.download = `processed_${imageData.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearProcessedImages = () => {
    processedImages.forEach(img => {
      // Only revoke blob URLs, not data URLs
      if (img.original?.startsWith('blob:')) {
        URL.revokeObjectURL(img.original);
      }
      if (img.processed?.startsWith('blob:')) {
        URL.revokeObjectURL(img.processed);
      }
    });
    setProcessedImages([]);
  };

  const selectedBackgroundName = backgrounds.find(b => b.color === selectedBackground)?.name || 'Unknown';

  // Debug logging for processed images
  console.log('🔍 DEBUG PhotoBackgroundSelector - processedImages:', processedImages);
  processedImages.forEach((img, index) => {
    console.log(`🔍 DEBUG Image ${index}:`, {
      filename: img.filename,
      original: img.original?.substring(0, 50) + '...',
      processed: img.processed?.substring(0, 50) + '...',
      originalType: img.original?.startsWith('data:') ? 'DATA_URL' : img.original?.startsWith('blob:') ? 'BLOB_URL' : 'OTHER',
      processedType: img.processed?.startsWith('data:') ? 'DATA_URL' : img.processed?.startsWith('blob:') ? 'BLOB_URL' : 'OTHER'
    });
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-purple-600" />
            Professional Photo Background Processor
            <Badge className="bg-purple-100 text-purple-800">Real-time Processing</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <BackgroundColorSelector
              backgrounds={backgrounds}
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
            />

            <ImageUploadArea
              isProcessing={isProcessing}
              selectedBackgroundName={selectedBackgroundName}
              onFileSelect={handleFileInput}
            />

            <ProcessingProgress isProcessing={isProcessing} />

            <ProcessedImageGrid
              processedImages={processedImages}
              selectedBackgroundName={selectedBackgroundName}
              onClearAll={clearProcessedImages}
              onDownload={downloadProcessedImage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoBackgroundSelector;
