
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import EnhancedAdminPanel from "@/components/admin/EnhancedAdminPanel";

const AdminPanelPage = () => {
  usePageView();

  return <EnhancedAdminPanel />;
};

export default AdminPanelPage;
