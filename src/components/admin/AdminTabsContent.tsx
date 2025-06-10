
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import CompleteAdminTabsList from './navigation/CompleteAdminTabsList';
import CompleteAdminTabsContentWrapper from './navigation/CompleteAdminTabsContentWrapper';

const AdminTabsContent = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="monitoring" className="space-y-6">
        <CompleteAdminTabsList />
        <CompleteAdminTabsContentWrapper />
      </Tabs>
    </div>
  );
};

export default AdminTabsContent;
