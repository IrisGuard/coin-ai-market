
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Brain } from 'lucide-react';
import EnhancedCoinUploadManager from '@/components/dealer/EnhancedCoinUploadManager';

const DealerCoinUploadPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          AI-Powered Coin Upload
          <Brain className="w-4 h-4 text-blue-600" />
        </CardTitle>
        <p className="text-gray-600">
          Upload coin images or analyze website listings with AI-powered recognition and market analysis
        </p>
      </CardHeader>
      <CardContent>
        <EnhancedCoinUploadManager />
      </CardContent>
    </Card>
  );
};

export default DealerCoinUploadPanel;
