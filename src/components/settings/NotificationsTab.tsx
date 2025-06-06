
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Save } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

export const NotificationsTab = () => {
  const { notifications, setNotifications, updateSettings, saving } = useUserSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Choose how you want to be notified about activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
              <p className="text-sm text-gray-600">
                {key === 'email_notifications' && 'Receive notifications via email'}
                {key === 'push_notifications' && 'Receive push notifications on your device'}
                {key === 'auction_alerts' && 'Get notified about auction activities'}
                {key === 'price_alerts' && 'Receive alerts about price changes'}
                {key === 'new_messages' && 'Get notified about new messages'}
                {key === 'marketing_emails' && 'Receive promotional emails'}
                {key === 'weekly_digest' && 'Weekly summary of activities'}
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, [key]: checked })
              }
            />
          </div>
        ))}
        <Button onClick={updateSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};
