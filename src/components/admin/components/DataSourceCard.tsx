
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Edit, Trash2, Activity } from 'lucide-react';

interface DataSourceCardProps {
  name: string;
  url: string;
  type: string;
  is_active: boolean;
  success_rate?: number;
  last_used?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({
  name,
  url,
  type,
  is_active,
  success_rate = 0,
  last_used,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground truncate">{url}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{type}</Badge>
            <Badge variant={is_active ? "default" : "secondary"}>
              {is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Success Rate:</span>
            <span className="font-medium">{success_rate}%</span>
          </div>
          {last_used && (
            <div className="flex justify-between">
              <span>Last Used:</span>
              <span className="font-medium">{new Date(last_used).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="flex-1">
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
