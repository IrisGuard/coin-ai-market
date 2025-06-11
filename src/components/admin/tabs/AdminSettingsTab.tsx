
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Database, 
  Mail, 
  Shield,
  Bell,
  Palette,
  Globe,
  Zap
} from 'lucide-react';

const AdminSettingsTab = () => {
  const [settings, setSettings] = useState({
    // System Settings
    maintenance_mode: false,
    debug_mode: false,
    auto_backup: true,
    
    // Notifications
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    
    // AI Settings
    ai_recognition_enabled: true,
    ai_auto_categorization: true,
    ai_price_prediction: true,
    
    // Security
    two_factor_required: false,
    session_timeout: 30,
    max_login_attempts: 5
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const systemInfo = {
    version: '2.1.4',
    uptime: '15 days, 8 hours',
    database_size: '2.4 GB',
    cache_size: '156 MB',
    active_connections: 1247,
    last_backup: '2 hours ago'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Settings</h3>
          <p className="text-sm text-muted-foreground">Configure platform settings and preferences</p>
        </div>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{systemInfo.version}</div>
              <p className="text-sm text-muted-foreground">Platform Version</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{systemInfo.uptime}</div>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{systemInfo.active_connections}</div>
              <p className="text-sm text-muted-foreground">Active Connections</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div className="flex justify-between">
              <span>Database Size:</span>
              <span className="font-medium">{systemInfo.database_size}</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Size:</span>
              <span className="font-medium">{systemInfo.cache_size}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Backup:</span>
              <span className="font-medium">{systemInfo.last_backup}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Debug Mode</Label>
              <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
            </div>
            <Switch
              checked={settings.debug_mode}
              onCheckedChange={(checked) => updateSetting('debug_mode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">Enable automated daily backups</p>
            </div>
            <Switch
              checked={settings.auto_backup}
              onCheckedChange={(checked) => updateSetting('auto_backup', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI & Recognition Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI & Recognition Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>AI Recognition</Label>
              <p className="text-sm text-muted-foreground">Enable AI-powered coin recognition</p>
            </div>
            <Switch
              checked={settings.ai_recognition_enabled}
              onCheckedChange={(checked) => updateSetting('ai_recognition_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Categorization</Label>
              <p className="text-sm text-muted-foreground">Automatically categorize coins using AI</p>
            </div>
            <Switch
              checked={settings.ai_auto_categorization}
              onCheckedChange={(checked) => updateSetting('ai_auto_categorization', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Price Prediction</Label>
              <p className="text-sm text-muted-foreground">Enable AI price prediction models</p>
            </div>
            <Switch
              checked={settings.ai_price_prediction}
              onCheckedChange={(checked) => updateSetting('ai_price_prediction', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send system alerts via email</p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
            </div>
            <Switch
              checked={settings.sms_notifications}
              onCheckedChange={(checked) => updateSetting('sms_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Send notifications to admin dashboard</p>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Mandatory 2FA for all admin accounts</p>
            </div>
            <Switch
              checked={settings.two_factor_required}
              onCheckedChange={(checked) => updateSetting('two_factor_required', checked)}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
              <Input
                id="session_timeout"
                type="number"
                value={settings.session_timeout}
                onChange={(e) => updateSetting('session_timeout', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="max_attempts">Max Login Attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                value={settings.max_login_attempts}
                onChange={(e) => updateSetting('max_login_attempts', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
