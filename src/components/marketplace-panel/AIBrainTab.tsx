
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Database } from 'lucide-react';

interface AIBrainTabProps {
  performance: any;
  dataSources: any[];
}

const AIBrainTab = ({ performance, dataSources }: AIBrainTabProps) => {
  return (
    <div className="space-y-6">
      {/* AI Brain Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Brain Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Recognition Accuracy</span>
                <span className="text-sm font-medium">{performance?.successRate || 85}%</span>
              </div>
              <Progress value={performance?.successRate || 85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Processing Speed</span>
                <span className="text-sm font-medium">{performance?.aiProcessingTime || 2.5}s</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">{performance?.successRate || 92}%</span>
              </div>
              <Progress value={performance?.successRate || 92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Aggregation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Aggregation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSources?.slice(0, 5).map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${source.is_active ? 'bg-electric-green' : 'bg-gray-300'}`}></div>
                  <span className="font-medium">{source.source_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={source.is_active ? 'default' : 'secondary'}>
                    {source.is_active ? 'active' : 'inactive'}
                  </Badge>
                  <span className="text-sm text-gray-500">{source.reliability_score?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No aggregation sources configured</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBrainTab;
