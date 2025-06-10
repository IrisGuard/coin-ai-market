
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useApiKeys, useApiKeyCategories } from '@/hooks/admin';
import BulkImportSection from '../api-keys/BulkImportSection';
import AddKeyForm from '../api-keys/AddKeyForm';
import CategorizedKeysDisplay from '../api-keys/CategorizedKeysDisplay';

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

const AdminApiKeysTab = () => {
  const { data: apiKeysData = [], isLoading } = useApiKeys();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useApiKeyCategories();
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Type-safe array conversion
  const apiKeys: ApiKey[] = Array.isArray(apiKeysData) ? apiKeysData : [];
  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Enhanced API Key Management</h3>
          <p className="text-sm text-muted-foreground">Manage API keys with categories and bulk operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkImport(!showBulkImport)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Supabase Keys
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Bulk Import Section */}
      <BulkImportSection 
        categories={categories}
        showBulkImport={showBulkImport}
        setShowBulkImport={setShowBulkImport}
      />

      {/* Add New API Key Form */}
      <AddKeyForm 
        categories={categories}
        showForm={showForm}
        setShowForm={setShowForm}
      />

      {/* Categorized API Keys Display */}
      <CategorizedKeysDisplay 
        apiKeys={apiKeys}
        categories={categories}
      />

      {(isLoading || categoriesLoading) && (
        <div className="text-center py-8">Loading API keys...</div>
      )}
    </div>
  );
};

export default AdminApiKeysTab;
