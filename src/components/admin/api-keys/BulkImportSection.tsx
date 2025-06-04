
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, Key, Globe, Brain, CreditCard } from 'lucide-react';
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
    'Payment': CreditCard
  };

  const supabaseKeys = [
    {
      name: 'Supabase URL',
      value: 'https://wdgnllgbfvjgurbqhfqb.supabase.co',
      description: 'Main Supabase project URL',
      category: 'Database'
    },
    {
      name: 'Supabase Anon Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU',
      description: 'Supabase anonymous access key for client-side operations',
      category: 'Authentication'
    },
    {
      name: 'Supabase Service Role Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1Mzg2NSwiZXhwIjoyMDY0NjI5ODY1fQ.O7_DPBmNmL-YOUUnFnr0Stxaz4D64CyAfMCcf_GWuoY',
      description: 'Supabase service role key for server-side operations',
      category: 'Database'
    }
  ];

  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName as keyof typeof categoryIcons] || Key;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleBulkImportSupabase = () => {
    const keysToImport = supabaseKeys.map(key => ({
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
        <CardTitle>Import Supabase Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import the Supabase project keys automatically with proper categorization:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supabaseKeys.map((key, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(key.category)}
                  <span className="font-medium text-sm">{key.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{key.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {key.category}
                </Badge>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleBulkImportSupabase} disabled={bulkCreateApiKeys.isPending}>
              {bulkCreateApiKeys.isPending ? 'Importing...' : 'Import All Keys'}
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
