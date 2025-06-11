
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Upload, FileSpreadsheet, Download } from 'lucide-react';

const BulkUploadManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Bulk Upload Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-center space-y-3">
                <FileSpreadsheet className="w-8 h-8 mx-auto text-green-600" />
                <h3 className="font-semibold">CSV Import</h3>
                <p className="text-sm text-gray-600">
                  Upload multiple coins from CSV file
                </p>
                <Button size="sm" className="w-full">
                  Choose CSV File
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center space-y-3">
                <Upload className="w-8 h-8 mx-auto text-blue-600" />
                <h3 className="font-semibold">Batch Images</h3>
                <p className="text-sm text-gray-600">
                  Upload multiple coin image sets
                </p>
                <Button size="sm" className="w-full">
                  Select Folders
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center space-y-3">
                <Download className="w-8 h-8 mx-auto text-orange-600" />
                <h3 className="font-semibold">Template</h3>
                <p className="text-sm text-gray-600">
                  Download CSV template
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Download Template
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center text-gray-500">
            <p>Bulk upload operations coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadManager;
