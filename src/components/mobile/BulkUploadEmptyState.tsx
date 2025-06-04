
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const BulkUploadEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Ready for Bulk Upload</h3>
        <p className="text-gray-600 mb-4">
          Select multiple coin images to process them in batches.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>💡 Group 2-6 images per coin for best results</p>
          <p>⚡ AI will analyze each coin automatically</p>
          <p>📊 Track progress and manage batches efficiently</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUploadEmptyState;
