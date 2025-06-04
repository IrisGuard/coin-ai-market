
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Settings, Trash2 } from 'lucide-react';

interface DataSourceCardProps {
  source: {
    id: string;
    name: string;
    url: string;
    type?: string;
    is_active: boolean;
    success_rate?: number;
    last_used?: string;
    rate_limit?: number;
  };
  onEdit: (source: any) => void;
  onDelete: (id: string) => void;
}

const DataSourceCard = ({ source, onEdit, onDelete }: DataSourceCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4" />
          {source.name}
        </CardTitle>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onEdit(source)}>
            <Settings className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(source.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground truncate">{source.url}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{source.type || 'web_scraper'}</Badge>
            <Badge variant={source.is_active ? 'default' : 'secondary'}>
              {source.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            {source.success_rate && (
              <div>Success Rate: {source.success_rate.toFixed(1)}%</div>
            )}
            {source.last_used && (
              <div>Last Used: {new Date(source.last_used).toLocaleDateString()}</div>
            )}
            {source.rate_limit && (
              <div>Rate Limit: {source.rate_limit}/hour</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
