
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  Coins,
  Store,
  Upload,
  Brain
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const { data: userRole } = useSmartUserRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { name: 'Marketplace', path: '/marketplace', icon: <Coins className="w-4 h-4" /> },
    { name: 'Auctions', path: '/auctions', icon: <Store className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CoinVault</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Dealer Upload Access - ONLY FOR AUTHENTICATED DEALERS */}
              {user && userRole === 'dealer' && (
                <Link
                  to="/upload"
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>
              )}
              
              {/* Dealer Panel Access - ONLY FOR AUTHENTICATED DEALERS */}
              {user && userRole === 'dealer' && (
                <Link
                  to="/dealer"
                  className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>Dealer Panel</span>
                </Link>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Admin Access - ONLY FOR AUTHENTICATED ADMINS */}
            {user && isAdmin && (
              <Link to="/admin">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Admin
                </Badge>
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Dealer Upload Access - ONLY FOR AUTHENTICATED DEALERS */}
              {user && userRole === 'dealer' && (
                <Link
                  to="/upload"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </Link>
              )}
              
              {/* Mobile Dealer Panel Access - ONLY FOR AUTHENTICATED DEALERS */}
              {user && userRole === 'dealer' && (
                <Link
                  to="/dealer"
                  className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store className="w-4 h-4" />
                  <span>Dealer Panel</span>
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
