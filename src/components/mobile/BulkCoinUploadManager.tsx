
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useRealAIAnalysis } from '@/hooks/useRealAIAnalysis';

const BulkCoinUploadManager = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { performRealAnalysis, isAnalyzing } = useRealAIAnalysis();

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files.slice(0, 10)); // Limit to 10 files
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await performRealAnalysis(selectedFiles);
      console.log('Bulk analysis results:', results);
      // Handle results as needed
    } catch (error) {
      console.error('Bulk upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Coin Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelection}
            className="hidden"
            id="bulk-upload"
          />
          <label htmlFor="bulk-upload">
            <Button variant="outline" className="w-full" asChild>
              <span>
                <ImageIcon className="w-4 h-4 mr-2" />
                Select Images (Max 10)
              </span>
            </Button>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {selectedFiles.length} files selected
            </p>
            <Button 
              onClick={handleBulkUpload}
              disabled={isProcessing || isAnalyzing}
              className="w-full"
            >
              {isProcessing || isAnalyzing ? 'Processing...' : 'Analyze All'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkCoinUploadManager;
