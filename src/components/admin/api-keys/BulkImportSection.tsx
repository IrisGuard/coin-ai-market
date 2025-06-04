
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, Key, Globe, Brain, CreditCard, Server, Shield } from 'lucide-react';
import { useBulkCreateApiKeys } from '@/hooks/useAdminData';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface BulkImportSectionProps {
  categories: Category[];
  showBulkImport: boolean;
  setShowBulkImport: (show: boolean) => void;
}

const BulkImportSection: React.FC<BulkImportSectionProps> = ({
  categories,
  showBulkImport,
  setShowBulkImport
}) => {
  const bulkCreateApiKeys = useBulkCreateApiKeys();

  const categoryIcons = {
    'Database': Database,
    'Authentication': Key,
    'External APIs': Globe,
    'AI Services': Brain,
    'Payment': CreditCard,
    'System': Server,
    'Security': Shield
  };

  // Updated production credentials for the correct project
  const productionKeys = [
    {
      name: 'Supabase URL',
      value: 'https://wdgnllgbfvjgurbqhfqb.supabase.co',
      description: 'Production Supabase project URL',
      category: 'Database'
    },
    {
      name: 'Supabase Project ID',
      value: 'wdgnllgbfvjgurbqhfqb',
      description: 'Production Supabase project identifier',
      category: 'Database'
    },
    {
      name: 'Supabase Anon Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzA4MjksImV4cCI6MjA0OTUwNjgyOX0.XTKxF0kT9aH_HZPGZEqH4qGa_B2kK2VJH7dKZW4N0Zs',
      description: 'Production Supabase anonymous access key for client-side operations',
      category: 'Authentication'
    }
  ];

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || Key;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleBulkImportProduction = () => {
    const keysToImport = productionKeys.map(key => ({
      ...key,
      category_id: categories.find(c => c.name === key.category)?.id || null
    }));

    bulkCreateApiKeys.mutate(keysToImport, {
      onSuccess: () => {
        setShowBulkImport(false);
      },
    });
  };

  if (!showBulkImport) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Import Production Database Keys
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Production Credentials</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Αυτά είναι τα πραγματικά production credentials για το σωστό project. Θα κρυπτογραφηθούν με ασφάλεια.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Import όλα τα production database keys αυτόματα με σωστή κατηγοριοποίηση:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {productionKeys.map((key, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(key.category)}
                  <span className="font-medium text-sm">{key.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{key.description}</p>
                <Badge variant="outline" className="text-xs">
                  {key.category}
                </Badge>
              </Card>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleBulkImportProduction} disabled={bulkCreateApiKeys.isPending}>
              {bulkCreateApiKeys.isPending ? 'Importing...' : 'Import All Production Keys'}
            </Button>
            <Button variant="outline" onClick={() => setShowBulkImport(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkImportSection;
