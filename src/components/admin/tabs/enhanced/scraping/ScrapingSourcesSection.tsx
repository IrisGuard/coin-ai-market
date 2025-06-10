
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrapingSource } from './types';

interface ScrapingSourcesSectionProps {
  sources: ScrapingSource[];
}

const ScrapingSourcesSection: React.FC<ScrapingSourcesSectionProps> = ({ sources }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scraping Sources Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <Card key={source.name}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{source.name}</h4>
                      <p className="text-sm text-gray-600">{source.url}</p>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-medium">{source.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Points:</span>
                      <span className="font-medium">{source.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Scrape:</span>
                      <span className="font-medium">{source.lastScrape}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrapingSourcesSection;
