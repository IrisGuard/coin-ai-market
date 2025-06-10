
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import BulkCoinUploadManager from '@/components/mobile/BulkCoinUploadManager';

const DealerCoinUploadPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          Upload Coins - Dealer Panel
        </CardTitle>
        <p className="text-gray-600">
          Upload and manage your coin inventory with AI-powered recognition and categorization
        </p>
      </CardHeader>
      <CardContent>
        <BulkCoinUploadManager />
      </CardContent>
    </Card>
  );
};

export default DealerCoinUploadPanel;
