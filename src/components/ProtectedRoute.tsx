import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireDealer?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireDealer = false }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
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

  // Show loading state if auth or role is still being determined
  if (loading || (requireDealer && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-electric-blue border-t-transparent rounded-full"></div>
          <span className="text-electric-blue font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // If the route requires admin access, show admin login form instead of redirecting
  if (requireAdmin) {
    const isAdmin = user?.email === 'admin@coinai.com' || 
                   user?.email === 'pvc.laminate@gmail.com' || 
                   userRole === 'admin';
    
    if (!isAuthenticated || !isAdmin) {
      return <AdminLoginForm isOpen={true} onClose={() => {}} />;
    }
  }

  // If the route requires authentication and the user isn't authenticated,
  // redirect to the login page
  if (requireAuth && !isAuthenticated && !requireAdmin) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If the route requires dealer access, check for dealer role
  if (requireDealer && isAuthenticated) {
    if (userRole !== 'dealer') {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // CRITICAL FIX: Do NOT auto-redirect authenticated users to admin panel
  // Only redirect from auth page to marketplace for regular users
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    // For all users (buyers and dealers), redirect to marketplace
    // Admin access should ONLY happen via Ctrl+Alt+A
    return <Navigate to="/marketplace" replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
