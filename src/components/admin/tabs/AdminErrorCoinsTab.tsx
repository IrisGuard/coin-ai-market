
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  BookOpen,
  DollarSign,
  Database,
  Brain
} from 'lucide-react';
import ErrorKnowledgeManager from '../enhanced/ErrorKnowledgeManager';
import ErrorMarketDataManager from '../enhanced/ErrorMarketDataManager';
import AdminErrorStatsOverview from '../enhanced/AdminErrorStatsOverview';
import AdminErrorQuickActions from '../enhanced/AdminErrorQuickActions';
import AdminErrorLegacyManager from '../enhanced/AdminErrorLegacyManager';

const AdminErrorCoinsTab = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Error Coins System</h2>
          <p className="text-muted-foreground">
            Comprehensive error coin knowledge base and market intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            AI Training Status
          </Button>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Import Sources
          </Button>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Market Data
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Legacy Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AdminErrorStatsOverview />
          <AdminErrorQuickActions onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="knowledge">
          <ErrorKnowledgeManager />
        </TabsContent>

        <TabsContent value="market">
          <ErrorMarketDataManager />
        </TabsContent>

        <TabsContent value="legacy" className="space-y-6">
          <AdminErrorLegacyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminErrorCoinsTab;
