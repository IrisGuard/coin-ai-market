
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const BulkSourceImporter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Source Importer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Bulk source import functionality coming soon.</p>
          <Button className="mt-4" disabled>
            Import Sources
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkSourceImporter;
