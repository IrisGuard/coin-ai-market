import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireDealer?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireDealer = false }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still being determined
  if (loading) {
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
    const isAdmin = user?.email === 'admin@coinai.com';
    if (!isAdmin) {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // If the route requires dealer access, check for dealer role
  if (requireDealer && isAuthenticated) {
    // In a real implementation, you'd check the user's role from the database
    // For now, we'll assume dealers have access
  }

  // If the route is auth and the user is already authenticated,
  // redirect to the appropriate page based on role
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    // Check if user is admin
    const isAdmin = user?.email === 'admin@coinai.com';
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
