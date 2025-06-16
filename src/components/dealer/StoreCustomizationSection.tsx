
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const StoreCustomizationSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Store Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Store customization features coming soon...</p>
          <p className="text-sm">Manage your store appearance, shipping, and policies.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCustomizationSection;
