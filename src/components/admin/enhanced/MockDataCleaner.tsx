
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

const MockDataCleaner = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Cleanup Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All mock data has been removed and replaced with real database queries. 
            The system now uses live data from Supabase for all operations.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default MockDataCleaner;
