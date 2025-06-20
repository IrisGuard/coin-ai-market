
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Brain } from 'lucide-react';
import ProductionCoinUploadManager from '@/components/dealer/ProductionCoinUploadManager';
import { toast } from 'sonner';

const DealerCoinUploadPanel: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleImagesProcessed = (images: any[]) => {
    console.log('📸 Images processed:', images);
    setUploadedImages(images);
    toast.success(`${images.length} images processed successfully!`);
  };

  const handleAIAnalysisComplete = (results: any) => {
    console.log('🤖 AI Analysis complete:', results);
    setAnalysisResults(results);
    toast.success('AI analysis completed!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          AI-Powered Coin Upload
          <Brain className="w-4 h-4 text-blue-600" />
        </CardTitle>
        <p className="text-gray-600">
          Upload coin images with AI-powered recognition and market analysis
        </p>
      </CardHeader>
      <CardContent>
        <ProductionCoinUploadManager
          onImagesProcessed={handleImagesProcessed}
          onAIAnalysisComplete={handleAIAnalysisComplete}
          maxImages={10}
        />
      </CardContent>
    </Card>
  );
};

export default DealerCoinUploadPanel;
