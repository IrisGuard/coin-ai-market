
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import ConsolidatedAdminPanel from "@/components/admin/ConsolidatedAdminPanel";

const AdminPanelPage = () => {
  usePageView();

  return <ConsolidatedAdminPanel />;
};

export default AdminPanelPage;
