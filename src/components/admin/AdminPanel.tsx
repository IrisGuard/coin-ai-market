
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Coins, 
  CreditCard, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  Bug,
  Key
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminCoinsTab from './tabs/AdminCoinsTab';
import AdminTransactionsTab from './tabs/AdminTransactionsTab';
import AdminNotificationsTab from './tabs/AdminNotificationsTab';
import AdminAnalyticsTab from './tabs/AdminAnalyticsTab';
import AdminSystemTab from './tabs/AdminSystemTab';
import AdminErrorMonitoringTab from './tabs/AdminErrorMonitoringTab';
import AdminApiKeysTab from './tabs/AdminApiKeysTab';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('users');
  const { adminLogout } = useAdmin();

  const handleLogout = () => {
    adminLogout();
    onClose();
  };

  const handleClose = () => {
    setActiveTab('users');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              CoinAI Admin Panel
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="coins" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Coins
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Errors
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 h-[calc(90vh-200px)] overflow-y-auto">
            <TabsContent value="users">
              <AdminUsersTab />
            </TabsContent>
            <TabsContent value="coins">
              <AdminCoinsTab />
            </TabsContent>
            <TabsContent value="transactions">
              <AdminTransactionsTab />
            </TabsContent>
            <TabsContent value="notifications">
              <AdminNotificationsTab />
            </TabsContent>
            <TabsContent value="analytics">
              <AdminAnalyticsTab />
            </TabsContent>
            <TabsContent value="errors">
              <AdminErrorMonitoringTab />
            </TabsContent>
            <TabsContent value="api-keys">
              <AdminApiKeysTab />
            </TabsContent>
            <TabsContent value="system">
              <AdminSystemTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
