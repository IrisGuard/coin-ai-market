
import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const ConsolidatedAdminPanel = () => {
  const { isAdmin, isAdminAuthenticated, isLoading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [sessionStorageAuth, setSessionStorageAuth] = useState(false);

  // Check sessionStorage for fallback authentication state
  useEffect(() => {
    const checkSessionAuth = () => {
      const sessionAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      
      if (sessionAuth && sessionTime) {
        const elapsed = Date.now() - parseInt(sessionTime);
        const isSessionValid = elapsed < (10 * 60 * 1000); // 10 minutes
        setSessionStorageAuth(isSessionValid);
        
        // If sessionStorage says we're authenticated but context doesn't, add sync delay
        if (isSessionValid && !isAdminAuthenticated && !isSyncing) {
          console.log('🔄 Detected timing mismatch - adding sync delay for context propagation');
          setIsSyncing(true);
          setTimeout(() => {
            setIsSyncing(false);
          }, 500);
        }
      } else {
        setSessionStorageAuth(false);
      }
    };

    checkSessionAuth();
    
    // Check periodically for session changes
    const interval = setInterval(checkSessionAuth, 1000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated, isSyncing]);

  // Show loading state while checking admin status
  if (isLoading || isSyncing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{isSyncing ? 'Synchronizing admin session...' : 'Validating admin access...'}</p>
        </div>
      </div>
    );
  }

  // Check if user has admin role first
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Denied</strong>
            <p className="mt-1">Administrative privileges required to access this content.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check authentication with fallback to sessionStorage
  const isAuthenticated = isAdminAuthenticated || sessionStorageAuth;
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Authentication Required</strong>
            <p className="mt-1">Please use Ctrl+Alt+A to access the admin panel.</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Both checks passed - render the full admin panel
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
