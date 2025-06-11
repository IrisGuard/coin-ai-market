
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireDealer?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireDealer = false }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { isAdmin, isAdminAuthenticated, isLoading: adminLoading } = useAdmin();
  const location = useLocation();

  // Get user role if needed
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
    enabled: !!user?.id && (requireAdmin || requireDealer),
  });

  console.log('🔐 ProtectedRoute - Admin check:', {
    requireAdmin,
    isAdmin,
    isAdminAuthenticated,
    loading,
    adminLoading,
    isAuthenticated,
    location: location.pathname
  });

  // Show loading state if auth or role is still being determined
  if (loading || (requireAdmin && adminLoading) || (requireDealer && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-electric-blue border-t-transparent rounded-full"></div>
          <span className="text-electric-blue font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // For admin routes - check admin role AND admin authentication
  if (requireAdmin) {
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to auth');
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    
    if (!isAdmin) {
      console.log('❌ User is not admin, redirecting to marketplace');
      return <Navigate to="/marketplace" replace />;
    }
    
    if (!isAdminAuthenticated) {
      console.log('❌ Admin not authenticated, showing admin auth requirement');
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-foreground">Admin Authentication Required</h2>
            <p className="text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl+Alt+A</kbd> to access the admin panel
            </p>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 Use the keyboard shortcut to trigger admin authentication
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    console.log('✅ Admin access granted');
    return <>{children}</>;
  }

  // Regular auth check for non-admin routes
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Dealer role check
  if (requireDealer && isAuthenticated) {
    if (userRole !== 'dealer') {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // Only redirect from auth page if authenticated
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
