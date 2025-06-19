
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image } from 'lucide-react';

interface EnhancedCoinUploadManagerProps {
  onImagesProcessed?: (images: any[]) => void;
  onAIAnalysisComplete?: (results: any) => void;
  maxImages?: number;
}

const EnhancedCoinUploadManager: React.FC<EnhancedCoinUploadManagerProps> = ({
  onImagesProcessed,
  onAIAnalysisComplete,
  maxImages = 10
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Mock processing
    setTimeout(() => {
      const processedImages = files.map((file, index) => ({
        id: `img-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }));
      
      onImagesProcessed?.(processedImages);
      
      // Mock AI analysis
      setTimeout(() => {
        const analysisResults = {
          coinType: 'Morgan Dollar',
          year: 1921,
          grade: 'MS-63',
          estimatedValue: { min: 45, max: 65 },
          confidence: 0.87
        };
        
        onAIAnalysisComplete?.(analysisResults);
      }, 2000);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Coin Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">Drop your coin images here</p>
          <p className="text-gray-500 mb-4">or click to browse (max {maxImages} images)</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoinUploadManager;
