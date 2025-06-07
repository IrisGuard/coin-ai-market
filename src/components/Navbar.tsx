
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, LogOut, Upload, Gavel, Brain, Store, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/hooks/useI18n';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CoinVision
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 hover:text-purple-600 transition-colors font-medium group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 text-orange-600 hover:text-red-600 transition-colors font-medium group"
            >
              <Store className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Marketplace
            </Link>
            <Link
              to="/auctions"
              className="flex items-center gap-2 text-green-600 hover:text-emerald-600 transition-colors font-medium group"
            >
              <Gavel className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Auctions
            </Link>
            <Link
              to="/ai-features"
              className="flex items-center gap-2 text-purple-600 hover:text-pink-600 transition-colors font-medium group"
            >
              <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
              AI Features
            </Link>
            {user && (
              <Link
                to="/upload"
                className="flex items-center gap-2 text-cyan-600 hover:text-blue-600 transition-colors font-medium group"
              >
                <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Upload
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-blue-600 hover:text-purple-600 hover:bg-blue-50">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-orange-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
