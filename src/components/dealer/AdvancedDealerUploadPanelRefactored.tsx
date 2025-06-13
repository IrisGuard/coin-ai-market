
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Brain, TrendingUp, Package, Settings, Truck, Store, AlertCircle, Database } from 'lucide-react';
import AdvancedImageUploadManager from './AdvancedImageUploadManager';
import CoinListingForm from './CoinListingForm';
import BulkUploadManager from './BulkUploadManager';
import DraftManager from './DraftManager';
import ShippingPaymentManager from './ShippingPaymentManager';
import StoreManagerRefactored from './store/StoreManagerRefactored';

// REAL ADMIN CONNECTIONS - NO MORE MOCK DATA
import ConnectedAIAnalysis from './ConnectedAIAnalysis';
import ConnectedMarketIntelligence from './ConnectedMarketIntelligence';
import ConnectedErrorDetection from './ConnectedErrorDetection';

const AdvancedDealerUploadPanelRefactored: React.FC = () => {
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
      store_id: selectedStoreId
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
            Professional coin listing management - CONNECTED TO ADMIN BRAIN
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI-Powered Platform
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 text-green-600 border-green-600">
            <Database className="w-4 h-4" />
            87 Tables Connected
          </Badge>
        </div>
      </div>

      {!selectedStoreId && activeTab !== 'stores' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a store first to upload coins. Go to the "Store Management" tab to create or select a store.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Stores
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2" disabled={!selectedStoreId}>
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2" disabled={!selectedStoreId}>
            <Package className="w-4 h-4" />
            Bulk
          </TabsTrigger>
          <TabsTrigger value="ai_brain" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Brain
          </TabsTrigger>
          <TabsTrigger value="market_intel" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Market Intel
          </TabsTrigger>
          <TabsTrigger value="error_detection" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Error Detection
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-6">
          <StoreManagerRefactored 
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

        <TabsContent value="ai_brain">
          <ConnectedAIAnalysis />
        </TabsContent>

        <TabsContent value="market_intel">
          <ConnectedMarketIntelligence />
        </TabsContent>

        <TabsContent value="error_detection">
          <ConnectedErrorDetection />
        </TabsContent>

        <TabsContent value="drafts">
          <DraftManager />
        </TabsContent>

        <TabsContent value="shipping">
          <ShippingPaymentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDealerUploadPanelRefactored;
