
import React, { useState } from 'react';
import { Coins, Menu, X, Settings, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import NavbarAuth from './NavbarAuth';
import AdminPanel from './admin/AdminPanel';
import AdminKeyboardHandler from './admin/AdminKeyboardHandler';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const openAdminPanel = () => {
    setShowAdminPanel(true);
  };

  const navItems = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/upload', label: 'Sell Coin' },
  ];

  const handleAdminSetupClick = () => {
    navigate('/admin-setup');
    setIsOpen(false);
  };

  const primaryColor = currentTenant?.primary_color || '#6366f1';
  const secondaryColor = currentTenant?.secondary_color || '#8b5cf6';

  return (
    <>
      <nav className="navbar-fixed">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                {currentTenant?.logo_url ? (
                  <img 
                    src={currentTenant.logo_url} 
                    alt={currentTenant.name}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center" 
                       style={{ 
                         backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                       }}>
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                )}
                <span className="text-xl font-bold gradient-text">
                  {currentTenant?.name || 'CoinVision'}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
              
              <LanguageSwitcher />
              
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAdminPanel}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Admin
                  <Badge variant="secondary" className="ml-1">
                    Pro
                  </Badge>
                </Button>
              )}

              {!isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminSetupClick}
                  className="admin-link flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin Setup
                </Button>
              )}

              <NavbarAuth />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg">
              <div className="container-padding py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {isAdmin && (
                  <button
                    onClick={() => {
                      openAdminPanel();
                      setIsOpen(false);
                    }}
                    className="nav-link w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                      <Badge variant="secondary">Pro</Badge>
                    </div>
                  </button>
                )}

                {!isAdmin && (
                  <button
                    onClick={handleAdminSetupClick}
                    className="admin-link nav-link w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin Setup
                    </div>
                  </button>
                )}
                
                <div className="border-t pt-3">
                  <NavbarAuth />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
      <AdminKeyboardHandler />
    </>
  );
};

export default Navbar;
