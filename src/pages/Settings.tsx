
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { AccountTab } from '@/components/settings/AccountTab';
import { NotificationsTab } from '@/components/settings/NotificationsTab';
import { PrivacyTab } from '@/components/settings/PrivacyTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { DataTab } from '@/components/settings/DataTab';

const Settings = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <AccountTab />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacyTab />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <DataTab />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
