import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Settings, Trash2, TestTube } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  source_type: string;
  base_url: string;
  is_active: boolean;
  rate_limit_per_hour: number;
  last_successful_fetch?: string;
  success_rate: number;
  [key: string]: unknown;
}

interface DataSourceCardProps {
  dataSource: DataSource;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
}

const DataSourceCard = ({ dataSource, onEdit, onDelete, onTest }: DataSourceCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4" />
          {dataSource.name}
        </CardTitle>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onTest(dataSource.id)}>
            <TestTube className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(dataSource.id)}>
            <Settings className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(dataSource.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{dataSource.source_type}</Badge>
            <Badge variant={dataSource.is_active ? 'default' : 'secondary'}>
              {dataSource.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Rate Limit: {dataSource.rate_limit_per_hour}/hour</div>
            <div>Success Rate: {(dataSource.success_rate * 100).toFixed(1)}%</div>
            {dataSource.last_successful_fetch && (
              <div>Last Fetch: {new Date(dataSource.last_successful_fetch).toLocaleDateString()}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
