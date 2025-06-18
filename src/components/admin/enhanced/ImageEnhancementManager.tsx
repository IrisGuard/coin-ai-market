
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useImageEnhancementData } from '@/hooks/useImageEnhancementData';
import EnhancementStatsCards from './image-enhancement/EnhancementStatsCards';
import EnhancementSettingsCard from './image-enhancement/EnhancementSettingsCard';
import SystemStatusCard from './image-enhancement/SystemStatusCard';

const ImageEnhancementManager: React.FC = () => {
  const { settings, stats, statsLoading, handleSettingChange } = useImageEnhancementData();

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
      <EnhancementStatsCards stats={stats} />

      {/* Enhancement Settings */}
      <EnhancementSettingsCard 
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      {/* System Status */}
      <SystemStatusCard enhancementsToday={stats?.enhancements_today} />
    </div>
  );
};

export default ImageEnhancementManager;
