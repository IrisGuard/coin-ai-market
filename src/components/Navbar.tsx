
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Coins, Bell, User, LogOut, Upload, Store, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useUnreadNotificationsCount } from '@/hooks/useNotifications';
import AdminKeyboardHandler from './admin/AdminKeyboardHandler';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Coins className="w-8 h-8 text-coin-gold" />
              <span className="text-xl font-serif font-bold text-gray-900">CoinVision AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-coin-gold transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/upload" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Coin
                    </Link>
                  </Button>

                  {/* Admin Button */}
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}

                  {/* Notifications */}
                  <div className="relative">
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="hidden lg:inline">{user?.user_metadata?.name || 'User'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/upload')}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Coin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/marketplace')}>
                        <Store className="w-4 h-4 mr-2" />
                        My Listings
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem className="text-red-600">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="coin-button">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-coin-gold transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/upload"
                      className="text-gray-700 hover:text-coin-gold transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Upload Coin
                    </Link>
                    {isAdmin && (
                      <span className="text-red-600 font-medium">
                        Admin Panel
                      </span>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-700 hover:text-coin-gold transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="text-gray-700 hover:text-coin-gold transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
      
      {/* Admin Keyboard Handler */}
      <AdminKeyboardHandler />
    </>
  );
};

export default Navbar;
