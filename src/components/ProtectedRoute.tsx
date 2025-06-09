import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }: ProtectedRouteProps) => {
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
    // For now, we'll check if this is the admin email
    // In a real app, you'd check the user's role from the database
    const isAdmin = user?.email === 'admin@coinai.com';
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If the route is auth and the user is already authenticated,
  // redirect to the appropriate dashboard
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    // Check if user is admin
    const isAdmin = user?.email === 'admin@coinai.com';
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
