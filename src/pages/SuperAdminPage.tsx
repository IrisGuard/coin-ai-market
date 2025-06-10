
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
import SecurityValidationWrapper from '@/components/admin/SecurityValidationWrapper';

const SuperAdminPage = () => {
  usePageView();

  return (
    <SecurityValidationWrapper requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SuperAdminDashboard />
      </div>
    </SecurityValidationWrapper>
  );
};

export default SuperAdminPage;
