
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
import AdminProfileTab from './tabs/AdminProfileTab';

const ConsolidatedAdminPanel = () => {
  const { isAdmin, isLoading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  console.log('🎛️ ConsolidatedAdminPanel render:', {
    isAdmin,
    isLoading
  });

  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Validating admin access...</p>
        </div>
      </div>
    );
  }

  // Safety net - should be handled by ProtectedRoute
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">
            Admin privileges required. Press Ctrl+Alt+A to authenticate.
          </p>
        </div>
      </div>
    );
  }

  // Render the full admin panel
  return (
    <div className="min-h-screen bg-background">
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
          
          <TabsContent value="profile" className="space-y-6">
            <AdminProfileTab />
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
