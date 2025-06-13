
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RefreshCw, Brain, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AIConfigManager = () => {
  const [config, setConfig] = useState({
    recognition_enabled: true,
    auto_analysis: true,
    confidence_threshold: 0.8,
    max_processing_time: 30000,
    cache_duration: 3600,
    api_rate_limit: 100
  });

  const { data: aiConfig, isLoading } = useQuery({
    queryKey: ['ai-configuration'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_configuration')
        .select('*')
        .eq('id', 'main')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching AI configuration:', error);
        throw error;
      }
      
      console.log('✅ AI configuration loaded:', data);
      return data;
    }
  });

  const { data: searchFilters, isLoading: filtersLoading } = useQuery({
    queryKey: ['ai-search-filters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_search_filters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI search filters:', error);
        throw error;
      }
      
      console.log('✅ AI search filters loaded:', data?.length);
      return data || [];
    }
  });

  React.useEffect(() => {
    if (aiConfig?.config && typeof aiConfig.config === 'object' && aiConfig.config !== null) {
      setConfig(prev => ({ ...prev, ...(aiConfig.config as any) }));
    }
  }, [aiConfig]);

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = async () => {
    try {
      const { error } = await supabase
        .from('ai_configuration')
        .upsert({
          id: 'main',
          config: config,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('✅ AI configuration saved');
    } catch (error) {
      console.error('❌ Error saving AI configuration:', error);
    }
  };

  if (isLoading || filtersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              AI System Configuration
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={saveConfiguration}>
                <Save className="h-4 w-4 mr-2" />
                Save Config
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Recognition Settings
              </h3>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Recognition Enabled</label>
                <Switch
                  checked={config.recognition_enabled}
                  onCheckedChange={(value) => handleConfigChange('recognition_enabled', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Analysis</label>
                <Switch
                  checked={config.auto_analysis}
                  onCheckedChange={(value) => handleConfigChange('auto_analysis', value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confidence Threshold</label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.confidence_threshold}
                  onChange={(e) => handleConfigChange('confidence_threshold', parseFloat(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Processing Time (ms)</label>
                <Input
                  type="number"
                  value={config.max_processing_time}
                  onChange={(e) => handleConfigChange('max_processing_time', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Settings
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cache Duration (seconds)</label>
                <Input
                  type="number"
                  value={config.cache_duration}
                  onChange={(e) => handleConfigChange('cache_duration', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">API Rate Limit (per minute)</label>
                <Input
                  type="number"
                  value={config.api_rate_limit}
                  onChange={(e) => handleConfigChange('api_rate_limit', parseInt(e.target.value))}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Current Status</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Recognition:</span>
                    <Badge variant={config.recognition_enabled ? 'default' : 'secondary'}>
                      {config.recognition_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Analysis:</span>
                    <Badge variant={config.auto_analysis ? 'default' : 'secondary'}>
                      {config.auto_analysis ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Threshold:</span>
                    <span>{Math.round(config.confidence_threshold * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Search Filters ({searchFilters?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchFilters?.map((filter) => (
              <Card key={filter.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{filter.filter_name}</h4>
                    <Badge variant={filter.is_active ? 'default' : 'secondary'}>
                      {filter.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Type: {filter.filter_type}
                  </div>
                  <div className="text-sm">
                    Usage: {filter.usage_count} times
                  </div>
                  <div className="text-sm">
                    Confidence: {Math.round((filter.confidence_threshold || 0) * 100)}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfigManager;
