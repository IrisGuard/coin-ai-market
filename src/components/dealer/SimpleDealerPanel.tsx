
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, TrendingUp, Package, Settings, Truck, AlertCircle, Brain, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import AdvancedImageUploadManager from './AdvancedImageUploadManager';
import CoinListingForm from './CoinListingForm';
import BulkUploadManager from './BulkUploadManager';
import MarketIntelligenceDashboard from './MarketIntelligenceDashboard';
import DraftManager from './DraftManager';
import ShippingPaymentManager from './ShippingPaymentManager';
import MyCoinsTab from './MyCoinsTab';

const SimpleDealerPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('my-coins');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [coinData, setCoinData] = useState<any>({});

  const { user } = useAuth();
  const { selectedStoreId: adminSelectedStoreId, isAdminUser } = useAdminStore();
  const effectiveSelectedStoreId = isAdminUser ? adminSelectedStoreId : null;

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
      store_id: effectiveSelectedStoreId
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isAdminUser ? 'Admin Dealer Panel' : 'Dealer Panel'}
          </h1>
          <p className="text-muted-foreground">
            Comprehensive coin management with AI-powered analysis and professional image editing
            {isAdminUser && ' - Admin Multi-Store Mode'}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          {isAdminUser ? 'Admin AI-Platform' : 'AI-Powered Platform'}
        </Badge>
      </div>

      {isAdminUser && !effectiveSelectedStoreId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a store from the dropdown in the header to access dealer functionality.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="my-coins" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Τα Νομίσματά Μου
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2" disabled={isAdminUser && !effectiveSelectedStoreId}>
            <Upload className="w-4 h-4" />
            Smart Upload
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2" disabled={isAdminUser && !effectiveSelectedStoreId}>
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
        </TabsList>

        <TabsContent value="my-coins" className="space-y-6">
          <MyCoinsTab />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          {(!isAdminUser || effectiveSelectedStoreId) && (
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
          {(!isAdminUser || effectiveSelectedStoreId) && <BulkUploadManager />}
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
      </Tabs>
    </div>
  );
};

export default SimpleDealerPanel;
