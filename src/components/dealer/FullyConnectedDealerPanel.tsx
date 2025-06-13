
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Brain, TrendingUp, Shield, Database } from 'lucide-react';

// Import connected components that use real Admin data
import ConnectedAIAnalysis from './ConnectedAIAnalysis';
import ConnectedMarketIntelligence from './ConnectedMarketIntelligence';
import ConnectedErrorDetection from './ConnectedErrorDetection';

// Import existing dealer components
import DealerUploadForm from './DealerUploadForm';
import DealerCoinsList from './DealerCoinsList';
import DealerAnalytics from './DealerAnalytics';

const FullyConnectedDealerPanel = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Advanced Dealer Panel
            <Badge className="bg-blue-100 text-blue-800 ml-2">Admin Brain Connected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Full access to AI systems, market intelligence, and error detection from the Admin panel.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="market-intel" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Intel
          </TabsTrigger>
          <TabsTrigger value="error-detection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Error Detection
          </TabsTrigger>
          <TabsTrigger value="my-coins" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            My Coins
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <DealerUploadForm />
        </TabsContent>

        <TabsContent value="ai-analysis">
          <ConnectedAIAnalysis />
        </TabsContent>

        <TabsContent value="market-intel">
          <ConnectedMarketIntelligence />
        </TabsContent>

        <TabsContent value="error-detection">
          <ConnectedErrorDetection />
        </TabsContent>

        <TabsContent value="my-coins">
          <DealerCoinsList />
        </TabsContent>

        <TabsContent value="analytics">
          <DealerAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FullyConnectedDealerPanel;
