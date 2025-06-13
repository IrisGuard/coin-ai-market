
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  BarChart3,
  Brain,
  Upload,
  Search,
  Database,
  Target,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import BulkSourceImporter from './BulkSourceImporter';
import SourceTemplateManager from './SourceTemplateManager';
import PerformanceAnalytics from './PerformanceAnalytics';
import AISourceDiscovery from './AISourceDiscovery';
import GeographicSourceMap from './GeographicSourceMap';
import CustomSourceManager from './CustomSourceManager';
import SourcesOverviewTab from './sources/SourcesOverviewTab';
import SourcesHeader from './sources/SourcesHeader';
import EnhancedErrorKnowledgeManager from './EnhancedErrorKnowledgeManager';
import EnhancedErrorMarketDataManager from './EnhancedErrorMarketDataManager';
import { useRealExternalSources } from '@/hooks/useRealExternalSources';

const EnhancedSourcesManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: sources, isLoading } = useRealExternalSources();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SourcesHeader sources={sources} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="custom-sources" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="error-knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Error Knowledge
          </TabsTrigger>
          <TabsTrigger value="market-data" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Data
          </TabsTrigger>
          <TabsTrigger value="bulk-import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="ai-discovery" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discovery
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="geographic" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geographic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SourcesOverviewTab sources={sources} />
        </TabsContent>

        <TabsContent value="custom-sources">
          <CustomSourceManager />
        </TabsContent>

        <TabsContent value="error-knowledge">
          <EnhancedErrorKnowledgeManager />
        </TabsContent>

        <TabsContent value="market-data">
          <EnhancedErrorMarketDataManager />
        </TabsContent>

        <TabsContent value="bulk-import">
          <BulkSourceImporter />
        </TabsContent>

        <TabsContent value="ai-discovery">
          <AISourceDiscovery />
        </TabsContent>

        <TabsContent value="templates">
          <SourceTemplateManager />
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="geographic">
          <GeographicSourceMap sources={sources || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSourcesManager;
