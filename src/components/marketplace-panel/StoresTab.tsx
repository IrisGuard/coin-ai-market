
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, AlertTriangle } from 'lucide-react';

// This component should NOT be used in user marketplace panel
// Stores management is for ADMIN ONLY
const StoresTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Access Restricted
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center p-8">
        <Store className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h3>
        <p className="text-gray-600">
          Store management is restricted to administrators only. 
          Users can only view and manage their own store in the "My Store" section.
        </p>
      </CardContent>
    </Card>
  );
};

export default StoresTab;
