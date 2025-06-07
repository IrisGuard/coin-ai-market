
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Moon, Sun, Save } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserSettings } from '@/hooks/useUserSettings';

export const PreferencesTab = () => {
  const { theme, toggleTheme } = useTheme();
  const { appSettings, setAppSettings, updateSettings, saving } = useUserSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          General Preferences
        </CardTitle>
        <CardDescription>Customize your experience on the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600">Toggle dark theme</p>
            </div>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Currency</p>
            <p className="text-sm text-gray-600">Display prices in your preferred currency</p>
          </div>
          <Select 
            value={appSettings.currency} 
            onValueChange={(value: 'EUR' | 'USD' | 'GBP') => 
              setAppSettings({...appSettings, currency: value})
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={updateSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};
