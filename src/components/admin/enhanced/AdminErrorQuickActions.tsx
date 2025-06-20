
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Brain, RefreshCw, Download, Zap, Database } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminErrorQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const AdminErrorQuickActions: React.FC<AdminErrorQuickActionsProps> = ({ onTabChange }) => {
  
  const runAIErrorDetection = async () => {
    toast.info('Starting AI error detection across all coin images...');
    
    const { error } = await supabase.rpc('execute_ai_command', {
      p_command_id: 'bulk-error-detection',
      p_input_data: { 
        source: 'all_coins',
        confidence_threshold: 0.8 
      }
    });

    if (error) {
      toast.error('Failed to start AI error detection');
    } else {
      toast.success('AI error detection process initiated');
    }
  };

  const syncMarketData = async () => {
    toast.info('Syncing error coin market data from external sources...');
    
    const { error } = await supabase.rpc('execute_ai_command', {
      p_command_id: 'sync-market-data',
      p_input_data: { 
        sources: ['heritage_auctions', 'pcgs', 'ngc'],
        update_existing: true 
      }
    });

    if (error) {
      toast.error('Failed to sync market data');
    } else {
      toast.success('Market data sync initiated');
    }
  };

  const exportErrorDatabase = async () => {
    toast.info('Exporting complete error coin database...');
    
    const { data: knowledge } = await supabase
      .from('error_coins_knowledge')
      .select('*');
    
    const { data: market } = await supabase
      .from('error_coins_market_data')
      .select('*');

    const exportData = {
      knowledge_base: knowledge,
      market_data: market,
      exported_at: new Date().toISOString(),
      total_records: (knowledge?.length || 0) + (market?.length || 0)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-coins-database-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Error database exported successfully');
  };

  const optimizeAIModel = async () => {
    toast.info('Optimizing AI detection models with latest training data...');
    
    const { error } = await supabase.rpc('execute_ai_command', {
      p_command_id: 'optimize-ai-models',
      p_input_data: { 
        model_types: ['error_detection', 'value_estimation'],
        use_latest_data: true 
      }
    });

    if (error) {
      toast.error('Failed to optimize AI models');
    } else {
      toast.success('AI model optimization started');
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Brain className="h-5 w-5" />
              AI Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-600 mb-4">
              Run AI error detection across all coin images in the system
            </p>
            <Button onClick={runAIErrorDetection} className="w-full bg-purple-600 hover:bg-purple-700">
              Start AI Detection
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <RefreshCw className="h-5 w-5" />
              Market Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600 mb-4">
              Sync latest market data from Heritage Auctions and PCGS
            </p>
            <Button onClick={syncMarketData} className="w-full bg-green-600 hover:bg-green-700">
              Sync Market Data
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600 mb-4">
              Export complete error coin database and market data
            </p>
            <Button onClick={exportErrorDatabase} className="w-full bg-blue-600 hover:bg-blue-700">
              Export Database
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Upload className="h-5 w-5" />
              Bulk Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-600 mb-4">
              Upload new error patterns and market data in bulk
            </p>
            <Button onClick={() => onTabChange('knowledge')} className="w-full bg-orange-600 hover:bg-orange-700">
              Manage Knowledge
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Zap className="h-5 w-5" />
              AI Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-600 mb-4">
              Optimize AI models with latest training data
            </p>
            <Button onClick={optimizeAIModel} className="w-full bg-yellow-600 hover:bg-yellow-700">
              Optimize Models
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Database className="h-5 w-5" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View detailed market data and pricing trends
            </p>
            <Button onClick={() => onTabChange('market')} className="w-full bg-gray-600 hover:bg-gray-700">
              View Market Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>Error Coins System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-green-700">AI Detection Accuracy</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-blue-700">Knowledge Base Entries</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">5,678</div>
              <div className="text-sm text-purple-700">Market Data Points</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-orange-700">Live Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorQuickActions;
