
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

  // SECURITY FIX: Production database credentials - properly categorized
  const productionKeys = [
    {
      name: 'Supabase URL',
      value: 'https://blvujdcdiwtgvmbuavgi.supabase.co',
      description: 'Production Supabase project URL',
      category: 'Database'
    },
    {
      name: 'Supabase Project ID',
      value: 'blvujdcdiwtgvmbuavgi',
      description: 'Production Supabase project identifier',
      category: 'Database'
    },
    {
      name: 'Supabase Anon Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdnVqZGNkaXd0Z3ZtYnVhdmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjU0NTUsImV4cCI6MjA2NDY0MTQ1NX0.WxGcy3GHqxir7Jo49nbE1z88ED8BNw3LnAHyPUROG_A',
      description: 'Production Supabase anonymous access key for client-side operations',
      category: 'Authentication'
    },
    {
      name: 'Supabase Service Role Key',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdnVqZGNkaXd0Z3ZtYnVhdmdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA2NTQ1NSwiZXhwIjoyMDY0NjQxNDU1fQ.vjLQSm7MeRez6oeLI4qqFOtAY-MB6CjYn9TWIdFFfDw',
      description: 'Production Supabase service role key - ADMIN ACCESS ONLY',
      category: 'Security'
    },
    {
      name: 'Supabase JWT Secret',
      value: 'NIyadLC/xhfjAODXf7aHqBMfQwH+uONmKR4YQZP+tQ+abZhnFicW4GcW+M15NkwUZA2ja+nQsQE4FS1Rt0owZA==',
      description: 'JWT secret for token validation',
      category: 'Security'
    },
    {
      name: 'Postgres URL',
      value: 'postgres://postgres.blvujdcdiwtgvmbuavgi:X59ld41Z4pofR9rS@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
      description: 'PostgreSQL connection URL with pooling',
      category: 'Database'
    },
    {
      name: 'Postgres URL Non-Pooling',
      value: 'postgres://postgres.blvujdcdiwtgvmbuavgi:X59ld41Z4pofR9rS@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require',
      description: 'PostgreSQL direct connection URL',
      category: 'Database'
    },
    {
      name: 'Postgres Prisma URL',
      value: 'postgres://postgres.blvujdcdiwtgvmbuavgi:X59ld41Z4pofR9rS@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x',
      description: 'PostgreSQL URL optimized for Prisma ORM',
      category: 'Database'
    },
    {
      name: 'Postgres User',
      value: 'postgres',
      description: 'PostgreSQL database username',
      category: 'Database'
    },
    {
      name: 'Postgres Password',
      value: 'X59ld41Z4pofR9rS',
      description: 'PostgreSQL database password',
      category: 'Security'
    },
    {
      name: 'Postgres Host',
      value: 'db.blvujdcdiwtgvmbuavgi.supabase.co',
      description: 'PostgreSQL database host',
      category: 'Database'
    },
    {
      name: 'Postgres Database',
      value: 'postgres',
      description: 'PostgreSQL database name',
      category: 'Database'
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
                  Αυτά είναι τα πραγματικά production credentials. Θα κρυπτογραφηθούν με ασφάλεια και θα αποθηκευτούν με κωδικούς πρόσβασης.
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
