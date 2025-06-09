
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

  // If the route requires authentication and the user isn't authenticated,
  // redirect to the login page
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If the route requires admin access, check for admin role
  if (requireAdmin && isAuthenticated) {
    const isAdmin = user?.email === 'admin@coinai.com' || userRole === 'admin';
    if (!isAdmin) {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // If the route requires dealer access, check for dealer role
  if (requireDealer && isAuthenticated) {
    if (userRole !== 'dealer') {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // If the route is auth and the user is already authenticated,
  // redirect to the appropriate page based on role
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    // Check if user is admin
    const isAdmin = user?.email === 'admin@coinai.com' || userRole === 'admin';
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    // For all other users (buyers and dealers), redirect to marketplace
    return <Navigate to="/marketplace" replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
