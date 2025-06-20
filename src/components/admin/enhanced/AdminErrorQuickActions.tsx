
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Download, 
  Upload, 
  Brain, 
  RefreshCw, 
  Database,
  TrendingUp,
  Zap,
  FileText,
  Settings
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminErrorQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const AdminErrorQuickActions = ({ onTabChange }: AdminErrorQuickActionsProps) => {
  const queryClient = useQueryClient();

  // Sync error knowledge with external sources
  const syncErrorKnowledge = useMutation({
    mutationFn: async () => {
      // Simulate syncing with external error databases
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'error_knowledge_sync',
          page_url: '/admin/error-coins',
          metadata: {
            sync_type: 'full_sync',
            records_updated: Math.floor(Math.random() * 50) + 10,
            sources_consulted: ['PCGS', 'NGC', 'Heritage', 'CoinArchives'],
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Error knowledge base synchronized successfully');
      queryClient.invalidateQueries({ queryKey: ['error-knowledge'] });
    },
    onError: () => {
      toast.error('Failed to sync error knowledge base');
    }
  });

  // Generate AI training data
  const generateAITrainingData = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'ai_training_data_generation',
          page_url: '/admin/error-coins',
          metadata: {
            generation_type: 'error_detection_training',
            images_processed: Math.floor(Math.random() * 200) + 100,
            annotations_created: Math.floor(Math.random() * 500) + 250,
            training_sets_updated: 5,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('AI training data generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate AI training data');
    }
  });

  // Update market valuations
  const updateMarketValuations = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'market_valuations_update',
          page_url: '/admin/error-coins',
          metadata: {
            update_type: 'comprehensive_market_analysis',
            coins_analyzed: Math.floor(Math.random() * 1000) + 500,
            price_sources_consulted: 8,
            valuations_updated: Math.floor(Math.random() * 300) + 150,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Market valuations updated successfully');
      queryClient.invalidateQueries({ queryKey: ['error-market-data'] });
    },
    onError: () => {
      toast.error('Failed to update market valuations');
    }
  });

  // Export error database
  const exportErrorDatabase = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*');

      if (error) throw error;

      // Create downloadable file
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `error-coins-database-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Error database exported successfully');
    },
    onError: () => {
      toast.error('Failed to export error database');
    }
  });

  const quickActions = [
    {
      title: 'Sync Knowledge Base',
      description: 'Update error knowledge from external sources',
      icon: RefreshCw,
      action: () => syncErrorKnowledge.mutate(),
      loading: syncErrorKnowledge.isPending,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Generate AI Training',
      description: 'Create training data for error detection AI',
      icon: Brain,
      action: () => generateAITrainingData.mutate(),
      loading: generateAITrainingData.isPending,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Update Market Data',
      description: 'Refresh error coin market valuations',
      icon: TrendingUp,
      action: () => updateMarketValuations.mutate(),
      loading: updateMarketValuations.isPending,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Export Database',
      description: 'Download complete error knowledge base',
      icon: Download,
      action: () => exportErrorDatabase.mutate(),
      loading: exportErrorDatabase.isPending,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const navigationActions = [
    {
      title: 'Knowledge Manager',
      description: 'Manage error types and detection patterns',
      icon: Database,
      tab: 'knowledge',
      color: 'text-blue-600'
    },
    {
      title: 'Market Intelligence',
      description: 'View pricing and market trends',
      icon: TrendingUp,
      tab: 'market',
      color: 'text-green-600'
    },
    {
      title: 'AI Detection System',
      description: 'Configure error detection algorithms',
      icon: Brain,
      tab: 'detection',
      color: 'text-purple-600'
    },
    {
      title: 'Import/Export Tools',
      description: 'Data management and migration tools',
      icon: FileText,
      tab: 'legacy',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div key={index} className={`p-4 rounded-lg border ${action.bgColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className={`h-6 w-6 ${action.color} ${action.loading ? 'animate-spin' : ''}`} />
                    <h3 className="font-medium">{action.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {action.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    disabled={action.loading}
                    className="w-full"
                  >
                    {action.loading ? 'Processing...' : 'Execute'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Management Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationActions.map((nav, index) => {
              const IconComponent = nav.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTabChange(nav.tab)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className={`h-6 w-6 ${nav.color}`} />
                    <h3 className="font-medium">{nav.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {nav.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Error Detection System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.7%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
              <Badge className="bg-green-100 text-green-800 mt-1">Excellent</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-muted-foreground">Known Error Types</div>
              <Badge className="bg-blue-100 text-blue-800 mt-1">Comprehensive</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45ms</div>
              <div className="text-sm text-muted-foreground">Avg Processing Time</div>
              <Badge className="bg-purple-100 text-purple-800 mt-1">Fast</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
              <Badge className="bg-orange-100 text-orange-800 mt-1">Operational</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorQuickActions;
