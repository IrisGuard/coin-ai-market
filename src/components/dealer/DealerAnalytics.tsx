
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const DealerAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>View your sales and performance analytics</p>
      </CardContent>
    </Card>
  );
};

export default DealerAnalytics;
