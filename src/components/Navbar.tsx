
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
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-electric-purple rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              CoinVision
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-electric-blue hover:text-electric-purple transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 text-electric-orange hover:text-electric-red transition-colors font-medium"
            >
              <Store className="w-4 h-4" />
              Marketplace
            </Link>
            <Link
              to="/auctions"
              className="flex items-center gap-2 text-electric-green hover:text-electric-emerald transition-colors font-medium"
            >
              <Gavel className="w-4 h-4" />
              Auctions
            </Link>
            <Link
              to="/ai-features"
              className="flex items-center gap-2 text-electric-purple hover:text-electric-pink transition-colors font-medium"
            >
              <Brain className="w-4 h-4" />
              AI Features
            </Link>
            {user && (
              <Link
                to="/upload"
                className="flex items-center gap-2 text-electric-cyan hover:text-electric-blue transition-colors font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-electric-blue hover:text-electric-purple">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-electric-blue">Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-electric-red hover:text-electric-orange"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-purple hover:to-electric-pink text-white">
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
