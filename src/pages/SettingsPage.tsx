
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountTab } from '@/components/settings/AccountTab';
import { NotificationsTab } from '@/components/settings/NotificationsTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { PrivacyTab } from '@/components/settings/PrivacyTab';
import { DataTab } from '@/components/settings/DataTab';

const SettingsPage = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyTab />
          </TabsContent>

          <TabsContent value="data">
            <DataTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
