
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Coins, 
  Store, 
  Upload, 
  User, 
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Get user role
  const { data: userRole } = useQuery({
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
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-cyber-purple rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-cyber-purple bg-clip-text text-transparent">
              CoinVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-700 hover:text-electric-blue transition-colors">
              Marketplace
            </Link>
            
            {isAuthenticated && userRole === 'dealer' && (
              <Link to="/upload" className="text-gray-700 hover:text-electric-blue transition-colors">
                Upload Coins
              </Link>
            )}

            {isAuthenticated && userRole === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-electric-blue transition-colors">
                Admin Panel
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/marketplace" 
                className="px-3 py-2 text-gray-700 hover:text-electric-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              
              {isAuthenticated && userRole === 'dealer' && (
                <Link 
                  to="/upload" 
                  className="px-3 py-2 text-gray-700 hover:text-electric-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Upload Coins
                </Link>
              )}

              {isAuthenticated && userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className="px-3 py-2 text-gray-700 hover:text-electric-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="px-3 py-2 text-gray-700 hover:text-electric-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 text-left text-gray-700 hover:text-electric-blue transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth"
                  className="px-3 py-2 text-gray-700 hover:text-electric-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
