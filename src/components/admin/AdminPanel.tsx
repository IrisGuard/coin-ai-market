
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';
import AdminPanelHeader from './AdminPanelHeader';
import AdminStatsOverview from './AdminStatsOverview';
import AdminTabsList from './AdminTabsList';
import AdminTabsContent from './AdminTabsContent';
import AdminDataValidator from './AdminDataValidator';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <AdminPanelHeader />
        
        <AdminDataValidator />

        <div className="space-y-6">
          <AdminStatsOverview />

          <Tabs defaultValue="ai-brain" className="space-y-4">
            <AdminTabsList />
            <AdminTabsContent />
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
