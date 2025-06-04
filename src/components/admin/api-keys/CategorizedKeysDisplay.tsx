
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Database, Key, Globe, Brain, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

const CategorizedKeysDisplay: React.FC<CategorizedKeysDisplayProps> = ({
  apiKeys,
  categories
}) => {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const categoryIcons = {
    'Database': Database,
    'Authentication': Key,
    'External APIs': Globe,
    'AI Services': Brain,
    'Payment': CreditCard
  };

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || Key;
    return <IconComponent className="h-4 w-4" />;
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard.",
    });
  };

  const groupedKeys = apiKeys.reduce((acc, key) => {
    const categoryName = categories.find(c => c.id === key.category_id)?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(key);
    return acc;
  }, {} as Record<string, ApiKey[]>);

  return (
    <>
      {Object.entries(groupedKeys).map(([categoryName, keys]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(categoryName)}
              {categoryName} ({keys.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div className="font-medium">{key.key_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={key.description || 'N/A'}>
                        {key.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded max-w-[200px] truncate">
                          {visibleKeys.has(key.id) 
                            ? key.encrypted_value 
                            : '••••••••••••••••'
                          }
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(key.encrypted_value)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {key.created_at ? new Date(key.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CategorizedKeysDisplay;
