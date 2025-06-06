
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Save } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

export const PrivacyTab = () => {
  const { privacy, setPrivacy, updateSettings, saving } = useUserSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Controls
        </CardTitle>
        <CardDescription>Control your privacy and data sharing preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Profile Visibility</p>
            <p className="text-sm text-gray-600">Control who can see your profile</p>
          </div>
          <Select 
            value={privacy.profile_visibility} 
            onValueChange={(value: 'public' | 'private' | 'friends') => 
              setPrivacy({...privacy, profile_visibility: value})
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {Object.entries(privacy).filter(([key]) => key !== 'profile_visibility').map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
              <p className="text-sm text-gray-600">
                {key === 'show_collection' && 'Display your portfolio value publicly'}
                {key === 'show_activity' && 'Show your bidding and transaction history'}
                {key === 'show_location' && 'Display your location on your profile'}
                {key === 'allow_messages' && 'Allow other users to send you messages'}
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => 
                setPrivacy({ ...privacy, [key]: checked })
              }
            />
          </div>
        ))}
        <Button onClick={updateSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};
