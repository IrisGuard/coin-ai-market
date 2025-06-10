
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Edit } from 'lucide-react';

interface ApiKey {
  id: string;
  key_name: string;
  encrypted_value: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface CategorizedKeysDisplayProps {
  apiKeys: ApiKey[];
  categories: Category[];
}

const CategorizedKeysDisplay = ({ apiKeys, categories }: CategorizedKeysDisplayProps) => {
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const groupedKeys = apiKeys.reduce((groups, key) => {
    const categoryName = getCategoryName(key.category_id);
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(key);
    return groups;
  }, {} as Record<string, ApiKey[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedKeys).map(([categoryName, keys]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{categoryName}</span>
              <Badge variant="outline">{keys.length} keys</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{key.key_name}</span>
                      <Badge variant={key.is_active ? 'default' : 'secondary'}>
                        {key.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {key.description && (
                      <p className="text-sm text-muted-foreground mt-1">{key.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {key.created_at ? new Date(key.created_at).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategorizedKeysDisplay;
