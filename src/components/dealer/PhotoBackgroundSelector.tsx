
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Upload, Zap, Download } from 'lucide-react';
import { useEnhancedImageProcessing } from '@/hooks/useEnhancedImageProcessing';
import type { ItemType } from '@/types/upload';

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
            {/* Background Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Background Color</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                      selectedBackground === bg.color 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedBackground(bg.color)}
                  >
                    <div className={`h-20 rounded-lg ${bg.preview} flex items-center justify-center`}>
                      {selectedBackground === bg.color && (
                        <Check className="h-6 w-6 text-green-600 bg-white rounded-full p-1" />
                      )}
                      {bg.id === 'transparent' && (
                        <span className="text-xs text-gray-500 font-mono">PNG</span>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <div className="font-medium text-xs">{bg.name}</div>
                      <div className="text-xs text-muted-foreground">{bg.color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Upload Photos for Background Processing</p>
              <p className="text-sm text-gray-500 mb-4">
                Selected background: <span className="font-medium">{backgrounds.find(b => b.color === selectedBackground)?.name}</span>
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="background-upload"
                disabled={isProcessing}
              />
              <label htmlFor="background-upload">
                <Button asChild disabled={isProcessing}>
                  <span>
                    {isProcessing ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Select Images
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>

            {/* Processing Progress */}
            {isProcessing && (
              <div className="text-center">
                <div className="animate-pulse">
                  <Zap className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-purple-600 font-medium">Processing images with selected background...</p>
                </div>
              </div>
            )}

            {/* Processed Images Preview */}
            {processedImages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Processed Images</h3>
                  <Button variant="outline" size="sm" onClick={clearProcessedImages}>
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedImages.map((img, index) => (
                    <div key={index} className="space-y-3 border rounded-lg p-3">
                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Original</p>
                          <img
                            src={img.original}
                            alt={`Original ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                            onError={(e) => {
                              console.error('🚨 Original image failed to load:', img.original);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('✅ Original image loaded successfully:', img.original?.substring(0, 50));
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Processed</p>
                          <img
                            src={img.processed}
                            alt={`Processed ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                            onError={(e) => {
                              console.error('🚨 Processed image failed to load:', img.processed);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('✅ Processed image loaded successfully:', img.processed?.substring(0, 50));
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* File Info and Actions */}
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="font-medium truncate">{img.filename}</div>
                          <div className="text-muted-foreground text-xs">
                            Background: {backgrounds.find(b => b.color === selectedBackground)?.name}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadProcessedImage(img)}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoBackgroundSelector;
