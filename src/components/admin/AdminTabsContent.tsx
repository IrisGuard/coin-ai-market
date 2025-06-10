
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import AdminTabsList from './navigation/AdminTabsList';
import AdminTabsContentWrapper from './navigation/AdminTabsContentWrapper';

const AdminTabsContent = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="ai-brain" className="space-y-6">
        <AdminTabsList />
        <AdminTabsContentWrapper />
      </Tabs>
    </div>
  );
};

export default AdminTabsContent;
