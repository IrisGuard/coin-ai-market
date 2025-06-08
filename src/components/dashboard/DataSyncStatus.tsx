
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const DataSyncStatus = () => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">All systems operational</span>
        </div>
      </CardContent>
    </Card>
  );
};
