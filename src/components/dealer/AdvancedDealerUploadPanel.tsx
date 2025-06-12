
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Brain, TrendingUp, Package, Settings, Truck, CreditCard, Store, AlertCircle } from 'lucide-react';
import AdvancedImageUploadManager from './AdvancedImageUploadManager';
import CoinListingForm from './CoinListingForm';
import BulkUploadManager from './BulkUploadManager';
import MarketIntelligenceDashboard from './MarketIntelligenceDashboard';
import DraftManager from './DraftManager';
import ShippingPaymentManager from './ShippingPaymentManager';
import StoreManager from './StoreManager';

const AdvancedDealerUploadPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stores');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [coinData, setCoinData] = useState<any>({});

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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Dealer Panel</h1>
          <p className="text-muted-foreground">
            Professional coin listing management with AI-powered analysis and global commerce features
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI-Powered Platform
        </Badge>
      </div>

      {/* Store Selection Alert */}
      {!selectedStoreId && activeTab !== 'stores' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a store first to upload coins. Go to the "Store Management" tab to create or select a store.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Store Management
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2" disabled={!selectedStoreId}>
            <Upload className="w-4 h-4" />
            Smart Upload
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2" disabled={!selectedStoreId}>
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
          {selectedStoreId && (
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
          {selectedStoreId && <BulkUploadManager />}
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
