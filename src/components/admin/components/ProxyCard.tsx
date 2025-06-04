
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Settings, Trash2 } from 'lucide-react';

interface ProxyCardProps {
  proxy: {
    id: string;
    name: string;
    country_code: string;
    type?: string;
    is_active: boolean;
    success_rate: number;
    last_used?: string;
  };
  onEdit: (proxy: any) => void;
  onDelete: (id: string) => void;
}

const ProxyCard = ({ proxy, onEdit, onDelete }: ProxyCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {proxy.name}
        </CardTitle>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onEdit(proxy)}>
            <Settings className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(proxy.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{proxy.country_code}</Badge>
            <Badge variant="outline">{proxy.type || 'http'}</Badge>
            <Badge variant={proxy.is_active ? 'default' : 'secondary'}>
              {proxy.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Success Rate: {(proxy.success_rate * 100).toFixed(1)}%</div>
            {proxy.last_used && (
              <div>Last Used: {new Date(proxy.last_used).toLocaleDateString()}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProxyCard;
