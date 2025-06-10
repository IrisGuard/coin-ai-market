
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Mail, 
  Key,
  Globe,
  Zap,
  Save
} from 'lucide-react';

const AdminSettingsTab = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'CoinVision',
    siteDescription: 'Professional Coin Authentication & Marketplace',
    maintenanceMode: false,
    
    // Security Settings
    twoFactorRequired: false,
    sessionTimeout: '24',
    passwordComplexity: 'medium',
    
    // Email Settings
    emailNotifications: true,
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    
    // API Settings
    rateLimitPerHour: '1000',
    apiVersioning: true,
    corsEnabled: true,
    
    // AI Settings
    aiProvider: 'openai',
    aiModelVersion: 'gpt-4',
    confidenceThreshold: '0.8',
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: '30'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      // Implementation for saving settings
      console.log('Saving settings:', settings);
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Settings</h3>
          <p className="text-sm text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
                <Label htmlFor="maintenanceMode">
                  {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              rows={3}
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twoFactorRequired">Require 2FA for Admins</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="twoFactorRequired"
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorRequired', checked)}
                />
                <Badge variant={settings.twoFactorRequired ? 'default' : 'secondary'}>
                  {settings.twoFactorRequired ? 'Required' : 'Optional'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordComplexity">Password Complexity</Label>
              <Select value={settings.passwordComplexity} onValueChange={(value) => handleSettingChange('passwordComplexity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI & ML Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI & Machine Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aiProvider">AI Provider</Label>
              <Select value={settings.aiProvider} onValueChange={(value) => handleSettingChange('aiProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiModelVersion">Model Version</Label>
              <Select value={settings.aiModelVersion} onValueChange={(value) => handleSettingChange('aiModelVersion', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
              <Input
                id="confidenceThreshold"
                value={settings.confidenceThreshold}
                onChange={(e) => handleSettingChange('confidenceThreshold', e.target.value)}
                placeholder="0.8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
            <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
          </div>
          {settings.emailNotifications && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                  placeholder="587"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup & Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="autoBackup"
              checked={settings.autoBackup}
              onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
            />
            <Label htmlFor="autoBackup">Enable Automatic Backups</Label>
          </div>
          {settings.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupRetention">Retention Period (days)</Label>
                <Input
                  id="backupRetention"
                  value={settings.backupRetention}
                  onChange={(e) => handleSettingChange('backupRetention', e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
