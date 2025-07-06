import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Brain, TrendingUp, Package, Settings, Truck, AlertCircle, Camera } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import EnhancedMultiCategoryUploadForm from './EnhancedMultiCategoryUploadForm';
import BulkUploadManager from './BulkUploadManager';
import MarketIntelligenceDashboard from './MarketIntelligenceDashboard';
import DraftManager from './DraftManager';
import ShippingPaymentManager from './ShippingPaymentManager';
import CoinImageEditor from './CoinImageEditor';

const AdvancedDealerUploadPanelRefactored: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [coinData, setCoinData] = useState<any>({});
  const [editingCoin, setEditingCoin] = useState<any>(null);

  const { user } = useAuth();
  const { selectedStoreId: adminSelectedStoreId, isAdminUser } = useAdminStore();
  const effectiveSelectedStoreId = isAdminUser ? adminSelectedStoreId : null;

  // Fetch dealer coins for image management
  const { data: dealerCoins = [], refetch: refetchCoins } = useQuery({
    queryKey: ['dealer-coins-upload-panel', user?.id, effectiveSelectedStoreId],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('coins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (effectiveSelectedStoreId) {
        query = query.eq('store_id', effectiveSelectedStoreId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && (!isAdminUser || !!effectiveSelectedStoreId),
  });

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

  const handleEditImages = (coin: any) => {
    setEditingCoin(coin);
  };

  const handleImagesUpdated = () => {
    refetchCoins();
    setEditingCoin(null);
  };

  const getValidImages = (coin: any): string[] => {
    const allImages: string[] = [];
    
    if (coin.images && Array.isArray(coin.images) && coin.images.length > 0) {
      const validImages = coin.images.filter((img: string) => 
        img && typeof img === 'string' && img.trim() !== '' && !img.startsWith('blob:')
      );
      allImages.push(...validImages);
    }
    
    if (allImages.length === 0 && coin.image && !coin.image.startsWith('blob:')) {
      allImages.push(coin.image);
    }
    
    return allImages;
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdminUser ? 'Advanced Admin Dealer Panel' : 'Advanced Dealer Panel'}
            </h1>
            <p className="text-muted-foreground">
              Professional coin listing management with AI-powered analysis and global commerce features
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
              Please select a store from the dropdown in the header to upload coins.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
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
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {(!isAdminUser || effectiveSelectedStoreId) && (
              <EnhancedMultiCategoryUploadForm />
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

      {/* Image Editor Modal */}
      {editingCoin && (
        <Dialog open={!!editingCoin} onOpenChange={() => setEditingCoin(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Manage Images - {editingCoin.name}
              </DialogTitle>
            </DialogHeader>
            <CoinImageEditor
              coinId={editingCoin.id}
              coinName={editingCoin.name}
              currentImages={getValidImages(editingCoin)}
              onImagesUpdated={handleImagesUpdated}
              maxImages={10}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdvancedDealerUploadPanelRefactored;
