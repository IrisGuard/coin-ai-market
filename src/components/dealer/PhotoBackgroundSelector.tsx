
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Upload } from 'lucide-react';

const PhotoBackgroundSelector = () => {
  const [selectedBackground, setSelectedBackground] = useState('white');
  const [processedImages, setProcessedImages] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const backgrounds = [
    { id: 'white', name: 'White', color: '#FFFFFF', preview: 'bg-white border-2' },
    { id: 'black', name: 'Black', color: '#000000', preview: 'bg-black' },
    { id: 'blue', name: 'Blue', color: '#3B82F6', preview: 'bg-blue-500' },
    { id: 'transparent', name: 'Transparent', color: 'transparent', preview: 'bg-gray-100 border-2 border-dashed' }
  ];

  const processWithBackground = async (files: FileList) => {
    setIsProcessing(true);
    const processed = [];

    for (const file of Array.from(files)) {
      // Simulate background processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      processed.push({
        original: URL.createObjectURL(file),
        processed: URL.createObjectURL(file), // In real implementation, this would be the processed image
        background: selectedBackground,
        filename: file.name
      });
    }

    setProcessedImages(processed);
    setIsProcessing(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processWithBackground(files);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-purple-600" />
            Photo Background Processor
            <Badge className="bg-purple-100 text-purple-800">Professional Quality</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Background Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Background</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                      selectedBackground === bg.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedBackground(bg.id)}
                  >
                    <div className={`h-24 rounded-lg ${bg.preview} flex items-center justify-center`}>
                      {selectedBackground === bg.id && (
                        <Check className="h-6 w-6 text-green-600 bg-white rounded-full p-1" />
                      )}
                      {bg.id === 'transparent' && (
                        <span className="text-xs text-gray-500">PNG</span>
                      )}
                    </div>
                    <div className="p-2 text-center">
                      <div className="font-medium text-sm">{bg.name}</div>
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
                Selected background: <span className="font-medium">{backgrounds.find(b => b.id === selectedBackground)?.name}</span>
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="background-upload"
              />
              <label htmlFor="background-upload">
                <Button asChild disabled={isProcessing}>
                  <span>
                    {isProcessing ? 'Processing...' : 'Select Images'}
                  </span>
                </Button>
              </label>
            </div>

            {/* Processed Images Preview */}
            {processedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Processed Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedImages.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <div className="relative">
                        <img
                          src={img.processed}
                          alt={`Processed ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-purple-500">
                          {img.background}
                        </Badge>
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        {img.filename}
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
