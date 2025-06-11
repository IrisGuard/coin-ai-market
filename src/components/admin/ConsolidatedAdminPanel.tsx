
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import AdminPanelHeader from './AdminPanelHeader';
import AdminTabsList from './navigation/AdminTabsList';
import AdminStatsOverview from './AdminStatsOverview';
import AdminUsersSection from './AdminUsersSection';
import AdminCoinsSection from './AdminCoinsSection';
import AICommandsSection from './ai-brain/AICommandsSection';
import AdminSecurityTab from './tabs/AdminSecurityTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminAPIKeysTab from './tabs/AdminAPIKeysTab';
import AdminAuctionsTab from './tabs/AdminAuctionsTab';
import AdminMarketplaceTab from './tabs/AdminMarketplaceTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminLogsTab from './tabs/AdminLogsTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import AdminKeyboardHandler from './AdminKeyboardHandler';
import SecureAdminWrapper from './SecureAdminWrapper';

const ConsolidatedAdminPanel = () => {
  const { isAdminAuthenticated } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdminAuthenticated) {
    return (
      <SecureAdminWrapper>
        <div />
      </SecureAdminWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminKeyboardHandler />
      <div className="container mx-auto py-8 px-4">
        <AdminPanelHeader />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <AdminTabsList />
          
          <TabsContent value="overview" className="space-y-6">
            <AdminStatsOverview />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <AdminUsersSection />
          </TabsContent>
          
          <TabsContent value="coins" className="space-y-6">
            <AdminCoinsSection />
          </TabsContent>
          
          <TabsContent value="ai-brain" className="space-y-6">
            <AICommandsSection 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <AdminSecurityTab />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalyticsTab />
          </TabsContent>
          
          <TabsContent value="api-keys" className="space-y-6">
            <AdminAPIKeysTab />
          </TabsContent>
          
          <TabsContent value="auctions" className="space-y-6">
            <AdminAuctionsTab />
          </TabsContent>
          
          <TabsContent value="marketplace" className="space-y-6">
            <AdminMarketplaceTab />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <AdminNotificationsTab />
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <AdminLogsTab />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsolidatedAdminPanel;
