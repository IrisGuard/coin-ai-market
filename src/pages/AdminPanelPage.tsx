
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import FullSystemAdminPanel from "@/components/admin/enhanced/FullSystemAdminPanel";

const AdminPanelPage = () => {
  console.log('📄 AdminPanelPage - FULL SYSTEM RESTORED with 32 interfaces...');
  
  try {
    usePageView();
    console.log('✅ AdminPanelPage: usePageView hook completed');
    
    return <FullSystemAdminPanel />;
  } catch (error) {
    console.error('💥 Error in AdminPanelPage:', error);
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-foreground">Page Error</h2>
          <p className="text-muted-foreground">
            Error loading admin panel page. Check console for details.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
};

export default AdminPanelPage;
