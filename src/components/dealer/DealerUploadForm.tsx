
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const DealerUploadForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Coin Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Upload and manage your coin listings</p>
      </CardContent>
    </Card>
  );
};

export default DealerUploadForm;
