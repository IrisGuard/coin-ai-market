
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Settings } from 'lucide-react';

interface EnhancementSettings {
  auto_enhancement_enabled: boolean;
  default_enhancement_level: 'basic' | 'professional' | 'ultra';
  batch_processing_enabled: boolean;
  max_concurrent_jobs: number;
  quality_threshold: number;
}

interface EnhancementSettingsCardProps {
  settings: EnhancementSettings;
  onSettingChange: (key: keyof EnhancementSettings, value: any) => void;
}

const EnhancementSettingsCard: React.FC<EnhancementSettingsCardProps> = ({
  settings,
  onSettingChange
}) => {
  return (
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
            onCheckedChange={(checked) => onSettingChange('auto_enhancement_enabled', checked)}
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
                onClick={() => onSettingChange('default_enhancement_level', level)}
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
            onCheckedChange={(checked) => onSettingChange('batch_processing_enabled', checked)}
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
  );
};

export default EnhancementSettingsCard;
