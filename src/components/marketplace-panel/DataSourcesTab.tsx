
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

interface DataSourcesTabProps {
  dataSources: any[];
}

const DataSourcesTab = ({ dataSources }: DataSourcesTabProps) => {
  return (
    <div className="space-y-6">
      {/* External Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            External Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources?.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${source.is_active ? 'bg-electric-green' : 'bg-red-500'}`}></div>
                  <div>
                    <h4 className="font-medium">{source.source_name}</h4>
                    <p className="text-sm text-gray-600">{source.base_url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={source.is_active ? 'default' : 'destructive'}>
                    {source.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {((source.reliability_score || 0) * 100).toFixed(1)}% success
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No data sources available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourcesTab;
