
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import FullSystemAdminPanel from "@/components/admin/enhanced/FullSystemAdminPanel";
import { Loader2, Shield } from 'lucide-react';

const AdminPanelPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  
  console.log('📄 AdminPanelPage - FULL SYSTEM ADMIN with 32 Complete Interfaces');
  
  try {
    usePageView();
    console.log('✅ AdminPanelPage: usePageView hook completed');
    
    if (authLoading || adminLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            <span className="text-blue-600 font-medium">Loading admin panel...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to access the admin panel.</p>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Admin Access Required</h2>
            <p className="text-muted-foreground">
              You need administrator privileges to access this panel.
            </p>
            <p className="text-sm text-muted-foreground">
              Current user: {user?.email}
            </p>
          </div>
        </div>
      );
    }
    
    return <FullSystemAdminPanel />;
  } catch (error) {
    console.error('💥 Error in AdminPanelPage:', error);
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-foreground">Page Error</h2>
          <p className="text-muted-foreground">
            Error loading full system admin panel. Check console for details.
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
