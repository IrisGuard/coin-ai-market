
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Globe } from 'lucide-react';

interface DataSourceCardProps {
  name: string;
  url: string;
  type: string;
  is_active: boolean;
  success_rate: number;
  last_used: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({
  name,
  url,
  type,
  is_active,
  success_rate,
  last_used,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            {name}
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground truncate">{url}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant="outline">{type}</Badge>
            <Badge variant={is_active ? "default" : "secondary"}>
              {is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between">
              <span>Success Rate:</span>
              <span className="font-medium">{(success_rate * 100).toFixed(1)}%</span>
            </div>
            {last_used && (
              <div className="flex justify-between">
                <span>Last Used:</span>
                <span className="font-medium">
                  {new Date(last_used).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
