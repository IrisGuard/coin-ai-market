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
import AdminStoresTab from './tabs/AdminStoresTab';
import AdminAIPerformanceTab from './tabs/AdminAIPerformanceTab';
import AdminDataSourcesTab from './tabs/AdminDataSourcesTab';
import AdminCategoriesTab from './tabs/AdminCategoriesTab';
import AdminErrorCoinsTab from './tabs/AdminErrorCoinsTab';
import AdminRevenueTab from './tabs/AdminRevenueTab';
import AdminGeographyTab from './tabs/AdminGeographyTab';
import AdminBulkOperationsTab from './tabs/AdminBulkOperationsTab';
import AdminSystemMonitoringTab from './tabs/AdminSystemMonitoringTab';

const ConsolidatedAdminPanel = () => {
  const { isAdmin, isLoading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  console.log('🎛️ ConsolidatedAdminPanel render START:', {
    isAdmin,
    isLoading,
    timestamp: new Date().toISOString()
  });

  try {
    // Show loading state while checking admin status
    if (isLoading) {
      console.log('🔄 Showing loading state');
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
      console.log('❌ Access denied - not admin');
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

    console.log('✅ Rendering admin panel content');

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

            <TabsContent value="stores" className="space-y-6">
              <AdminStoresTab />
            </TabsContent>
            
            <TabsContent value="ai-brain" className="space-y-6">
              <AICommandsSection 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </TabsContent>

            <TabsContent value="data-sources" className="space-y-6">
              <AdminDataSourcesTab />
            </TabsContent>

            <TabsContent value="ai-performance" className="space-y-6">
              <AdminAIPerformanceTab />
            </TabsContent>

            <TabsContent value="scraping" className="space-y-6">
              <AdminDataSourcesTab />
            </TabsContent>

            <TabsContent value="automation" className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Automation Rules</h3>
                <p className="text-muted-foreground">Automation management coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">AI Predictions</h3>
                <p className="text-muted-foreground">Prediction management coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="system-monitoring" className="space-y-6">
              <AdminSystemMonitoringTab />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <AdminCategoriesTab />
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <AdminRevenueTab />
            </TabsContent>

            <TabsContent value="geography" className="space-y-6">
              <AdminGeographyTab />
            </TabsContent>

            <TabsContent value="error-coins" className="space-y-6">
              <AdminErrorCoinsTab />
            </TabsContent>

            <TabsContent value="bulk-ops" className="space-y-6">
              <AdminBulkOperationsTab />
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
  } catch (error) {
    console.error('💥 Error in ConsolidatedAdminPanel:', error);
    
    // Fallback UI
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Admin Panel Error</h2>
          <p className="text-muted-foreground">
            Something went wrong loading the admin panel. Please check the console for details.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default ConsolidatedAdminPanel;
