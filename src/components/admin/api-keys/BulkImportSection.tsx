import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { useBulkCreateApiKeys } from '@/hooks/admin';

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

const BulkImportSection = ({ categories, showBulkImport, setShowBulkImport }: BulkImportSectionProps) => {
  const [importData, setImportData] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const bulkCreateApiKeys = useBulkCreateApiKeys();

  const handleBulkImport = async () => {
    try {
      const lines = importData.split('\n').filter(line => line.trim());
      const keysData = lines.map(line => {
        const [key_name, encrypted_value] = line.split(':').map(s => s.trim());
        return {
          key_name: key_name || `Imported Key ${Date.now()}`,
          encrypted_value: encrypted_value || line,
          description: 'Bulk imported from Supabase',
          category_id: selectedCategory || undefined
        };
      });

      await bulkCreateApiKeys.mutateAsync(keysData);
      setImportData('');
      setShowBulkImport(false);
    } catch (error) {
      console.error('Bulk import failed:', error);
    }
  };

  if (!showBulkImport) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bulk Import API Keys</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowBulkImport(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Category for imported keys</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mt-1"
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium">API Keys (one per line, format: name:key)</label>
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder={`Example:\nSupabase Anon Key:eyJhbGciOiJIUzI1NiIs...\nSupabase Service Key:eyJhbGciOiJIUzI1NiIs...`}
            rows={8}
            className="mt-1"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleBulkImport} disabled={!importData.trim() || bulkCreateApiKeys.isPending}>
            <Upload className="h-4 w-4 mr-2" />
            {bulkCreateApiKeys.isPending ? 'Importing...' : 'Import Keys'}
          </Button>
          <Button variant="outline" onClick={() => setShowBulkImport(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkImportSection;
