
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, Brain, TrendingUp, Package, Settings, Truck, CreditCard, Store, AlertCircle, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import AdvancedImageUploadManager from './AdvancedImageUploadManager';
import CoinListingForm from './CoinListingForm';
import BulkUploadManager from './BulkUploadManager';
import MarketIntelligenceDashboard from './MarketIntelligenceDashboard';
import DraftManager from './DraftManager';
import ShippingPaymentManager from './ShippingPaymentManager';
import StoreManager from './StoreManager';
import CreateStoreForm from './store/CreateStoreForm';

const AdvancedDealerUploadPanel: React.FC = () => {
  const { user } = useAuth();
  const { isAdminUser, selectedStoreId, setSelectedStoreId } = useAdminStore();
  const [activeTab, setActiveTab] = useState('stores');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [coinData, setCoinData] = useState<any>({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch stores for admin users
  const { data: adminStores = [] } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      if (!isAdminUser) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdminUser,
  });

  const handleImagesProcessed = (images: any[]) => {
    setUploadedImages(images);
  };

  const handleAIAnalysisComplete = (results: any) => {
    setAiAnalysisResults(results);
    // Auto-populate form with AI results
    setCoinData(prev => ({
      ...prev,
      title: results.analysis?.name || '',
      year: results.analysis?.year || '',
      grade: results.analysis?.grade || '',
      composition: results.analysis?.composition || '',
      diameter: results.analysis?.diameter || '',
      weight: results.analysis?.weight || '',
      estimatedValue: results.analysis?.estimated_value || '',
      errors: results.errors || [],
      rarity: results.analysis?.rarity || 'Common',
      store_id: selectedStoreId // Connect to selected store
    }));
  };

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    setCoinData(prev => ({ ...prev, store_id: storeId }));
  };

  const handleCreateSuccess = (storeId: string) => {
    setShowCreateForm(false);
    setSelectedStoreId(storeId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isAdminUser ? 'Advanced Admin Dealer Panel' : 'Advanced Dealer Panel'}
          </h1>
          <p className="text-muted-foreground">
            Professional coin listing management with AI-powered analysis and global commerce features
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Admin Store Selector and Create Button - Only for admin users */}
          {isAdminUser && (
            <div className="flex items-center gap-3">
              <Select value={selectedStoreId || ''} onValueChange={setSelectedStoreId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a store..." />
                </SelectTrigger>
                <SelectContent>
                  {adminStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <span>{store.name}</span>
                        {store.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowCreateForm(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Store
              </Button>
            </div>
          )}
          
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI-Powered Platform
          </Badge>
        </div>
      </div>

      {/* Store Selection Alert */}
      {isAdminUser && !selectedStoreId && activeTab !== 'stores' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a store first to upload coins. Go to the "Store Management" tab to create or select a store.
          </AlertDescription>
        </Alert>
      )}

      {/* Create Store Form Modal for Admin */}
      {isAdminUser && showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Store</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateStoreForm
              onCancel={() => setShowCreateForm(false)}
              onSuccess={handleCreateSuccess}
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Store Management
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2" disabled={isAdminUser && !selectedStoreId}>
            <Upload className="w-4 h-4" />
            Smart Upload
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2" disabled={isAdminUser && !selectedStoreId}>
            <Package className="w-4 h-4" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Market Intel
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Drafts & Templates
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping & Payments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-6">
          <StoreManager 
            onStoreSelect={handleStoreSelect}
            selectedStoreId={selectedStoreId}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          {(!isAdminUser || selectedStoreId) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedImageUploadManager
                onImagesProcessed={handleImagesProcessed}
                onAIAnalysisComplete={handleAIAnalysisComplete}
                maxImages={10}
              />
              <CoinListingForm
                images={uploadedImages}
                aiResults={aiAnalysisResults}
                coinData={coinData}
                onCoinDataChange={setCoinData}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="bulk">
          {(!isAdminUser || selectedStoreId) && <BulkUploadManager />}
        </TabsContent>

        <TabsContent value="intelligence">
          <MarketIntelligenceDashboard />
        </TabsContent>

        <TabsContent value="drafts">
          <DraftManager />
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingPaymentManager />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Performance tracking and analytics coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDealerUploadPanel;
