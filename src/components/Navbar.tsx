
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, LogOut, Upload, Gavel, Brain, Store, Home, Menu, X, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/hooks/useI18n';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@coinai.com';

  const navLinks = [
    { to: "/", icon: Home, label: "Home", color: "text-electric-blue hover:text-electric-purple" },
    { to: "/marketplace", icon: Store, label: "Marketplace", color: "text-electric-orange hover:text-electric-red" },
    { to: "/auctions", icon: Gavel, label: "Auctions", color: "text-electric-green hover:text-electric-emerald" },
    { to: "/ai-features", icon: Brain, label: "AI Features", color: "text-electric-purple hover:text-electric-pink" },
  ];

  const userLinks = user ? [
    { to: "/upload", icon: Upload, label: "Upload", color: "text-electric-cyan hover:text-electric-blue" },
    ...(isAdmin ? [{ to: "/admin", icon: Settings, label: "Admin Panel", color: "text-electric-red hover:text-electric-orange" }] : []),
    { to: "/dashboard", icon: Users, label: "Dashboard", color: "text-electric-green hover:text-electric-emerald" },
  ] : [];

  return (
    <>
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
                CoinAI
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 ${link.color} transition-colors font-medium`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {userLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 ${link.color} transition-colors font-medium`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop User Actions - Only show if user is authenticated */}
            <div className="hidden lg:flex items-center space-x-3">
              {user && (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    {isAdmin && <span className="ml-1 text-red-600 font-semibold">(Admin)</span>}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-electric-red hover:text-electric-orange"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-electric-blue"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white border-b border-gray-200 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-2 rounded-lg ${link.color} transition-colors font-medium`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            
            {userLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-2 rounded-lg ${link.color} transition-colors font-medium`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}

            {/* Mobile User Actions - Only show if user is authenticated */}
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 p-2">
                    Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    {isAdmin && <span className="ml-1 text-red-600 font-semibold">(Admin)</span>}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2 text-electric-red hover:text-electric-orange"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
