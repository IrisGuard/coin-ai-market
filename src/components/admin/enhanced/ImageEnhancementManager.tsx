
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Settings, 
  BarChart3, 
  Image, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EnhancementSettings {
  auto_enhancement_enabled: boolean;
  default_enhancement_level: 'basic' | 'professional' | 'ultra';
  batch_processing_enabled: boolean;
  max_concurrent_jobs: number;
  quality_threshold: number;
}

interface EnhancementStats {
  total_enhancements: number;
  successful_enhancements: number;
  failed_enhancements: number;
  average_quality_improvement: number;
  average_processing_time: number;
  enhancements_today: number;
}

const ImageEnhancementManager: React.FC = () => {
  const [settings, setSettings] = useState<EnhancementSettings>({
    auto_enhancement_enabled: true,
    default_enhancement_level: 'professional',
    batch_processing_enabled: true,
    max_concurrent_jobs: 5,
    quality_threshold: 75
  });

  const queryClient = useQueryClient();

  // Fetch enhancement statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['enhancement-stats'],
    queryFn: async () => {
      console.log('📊 Fetching enhancement statistics...');
      
      // Simulate fetching stats from database
      // In production, this would query the image_enhancements table
      const mockStats: EnhancementStats = {
        total_enhancements: 1247,
        successful_enhancements: 1198,
        failed_enhancements: 49,
        average_quality_improvement: 23.5,
        average_processing_time: 1350,
        enhancements_today: 89
      };
      
      return mockStats;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: EnhancementSettings) => {
      console.log('⚙️ Updating enhancement settings...', newSettings);
      
      // In production, this would save settings to database
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'image_enhancement',
          setting_value: newSettings,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
      return newSettings;
    },
    onSuccess: (newSettings) => {
      setSettings(newSettings);
      toast.success('Enhancement settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['enhancement-stats'] });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast.error('Failed to update settings');
    }
  });

  const handleSettingChange = (key: keyof EnhancementSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    updateSettingsMutation.mutate(newSettings);
  };

  const getSuccessRate = () => {
    if (!stats) return 0;
    return Math.round((stats.successful_enhancements / stats.total_enhancements) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Image Enhancement Management
          </h2>
          <p className="text-gray-600">
            Automatic professional image enhancement system for marketplace
          </p>
        </div>
        
        <Badge className={`${
          settings.auto_enhancement_enabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {settings.auto_enhancement_enabled ? 'Auto Enhancement ON' : 'Auto Enhancement OFF'}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enhanced</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.total_enhancements || 0}
                </p>
              </div>
              <Image className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {getSuccessRate()}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quality Improvement</p>
                <p className="text-2xl font-bold text-purple-600">
                  +{stats?.average_quality_improvement || 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats?.average_processing_time || 0}ms
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhancement Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Enhancement Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Enhancement Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Automatic Enhancement</h4>
              <p className="text-sm text-gray-600">
                Automatically enhance all uploaded images in marketplace
              </p>
            </div>
            <Switch
              checked={settings.auto_enhancement_enabled}
              onCheckedChange={(checked) => handleSettingChange('auto_enhancement_enabled', checked)}
            />
          </div>

          {/* Enhancement Level */}
          <div className="space-y-2">
            <h4 className="font-medium">Default Enhancement Level</h4>
            <div className="flex gap-2">
              {(['basic', 'professional', 'ultra'] as const).map((level) => (
                <Button
                  key={level}
                  variant={settings.default_enhancement_level === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('default_enhancement_level', level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Batch Processing */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Batch Processing</h4>
              <p className="text-sm text-gray-600">
                Enable processing multiple images simultaneously
              </p>
            </div>
            <Switch
              checked={settings.batch_processing_enabled}
              onCheckedChange={(checked) => handleSettingChange('batch_processing_enabled', checked)}
            />
          </div>

          {/* Quality Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Quality Threshold</h4>
              <span className="text-sm text-gray-600">{settings.quality_threshold}%</span>
            </div>
            <Progress value={settings.quality_threshold} className="h-2" />
            <p className="text-xs text-gray-500">
              Images below this quality threshold will be automatically enhanced
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Enhancement Service: Online</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">AI Brain: Connected</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Database: Healthy</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Queue: {stats?.enhancements_today || 0} processed today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageEnhancementManager;
