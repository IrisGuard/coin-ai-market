
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

const AISourceDiscovery = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Source Discovery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">AI-powered source discovery coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISourceDiscovery;
