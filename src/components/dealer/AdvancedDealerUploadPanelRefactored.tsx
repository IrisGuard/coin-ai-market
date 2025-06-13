
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Bot, Camera, Settings, TrendingUp } from 'lucide-react';
import EnhancedDealerUploadTriggers from './EnhancedDealerUploadTriggers';
import MultiCategoryListingManager from './MultiCategoryListingManager';
import PhotoBackgroundSelector from './PhotoBackgroundSelector';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdvancedDealerUploadPanelRefactored = () => {
  const [activeTab, setActiveTab] = useState('upload');

  // Get live system status
  const { data: systemStatus } = useQuery({
    queryKey: ['dealer-system-status'],
    queryFn: async () => {
      const [aiCommands, coins, categories] = await Promise.all([
        supabase.from('ai_commands').select('is_active').eq('is_active', true),
        supabase.from('coins').select('id'),
        supabase.from('categories').select('id')
      ]);

      return {
        activeAICommands: aiCommands.data?.length || 0,
        totalCoins: coins.data?.length || 0,
        totalCategories: categories.data?.length || 0,
        isSystemOperational: (aiCommands.data?.length || 0) > 0
      };
    },
    refetchInterval: 5000
  });

  const getSystemHealthBadge = () => {
    if (!systemStatus) return { text: 'Loading...', color: 'bg-gray-100 text-gray-800' };
    
    if (systemStatus.isSystemOperational) {
      return { text: 'OPERATIONAL', color: 'bg-green-100 text-green-800' };
    } else {
      return { text: 'READY', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const healthBadge = getSystemHealthBadge();

  return (
    <div className="space-y-6">
      {/* Header with Live Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-600" />
            Advanced Dealer Upload System
            <Badge className={healthBadge.color}>
              {healthBadge.text}
            </Badge>
            {systemStatus && (
              <>
                <Badge className="bg-green-100 text-green-800">
                  {systemStatus.activeAICommands} AI Commands
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {systemStatus.totalCoins} Coins
                </Badge>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Professional coin upload system with AI-powered analysis, visual matching, 
            background selection, and multi-category marketplace listing.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Smart Upload
          </TabsTrigger>
          <TabsTrigger value="background" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Background
          </TabsTrigger>
          <TabsTrigger value="multi-listing" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Multi-Listing
          </TabsTrigger>
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <EnhancedDealerUploadTriggers />
        </TabsContent>

        <TabsContent value="background">
          <PhotoBackgroundSelector />
        </TabsContent>

        <TabsContent value="multi-listing">
          <MultiCategoryListingManager />
        </TabsContent>

        <TabsContent value="ai-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-600" />
                AI Analysis Engine Status
                {systemStatus?.activeAICommands && (
                  <Badge className="bg-green-100 text-green-800">
                    {systemStatus.activeAICommands} Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">Visual Recognition</div>
                  <div className="text-sm text-muted-foreground">
                    {systemStatus?.isSystemOperational ? 'Active & Ready' : 'Ready for Use'}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">Market Analysis</div>
                  <div className="text-sm text-muted-foreground">
                    Real-time Data Available
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium">Auto-Listing</div>
                  <div className="text-sm text-muted-foreground">
                    {systemStatus?.totalCategories ? `${systemStatus.totalCategories} Categories` : 'Ready to List'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDealerUploadPanelRefactored;
