
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

  const primaryColor = currentTenant?.primary_color || '#1F2937';
  const secondaryColor = currentTenant?.secondary_color || '#3B82F6';

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Coins className="h-8 w-8" style={{ color: primaryColor }} />
                )}
                <span className="text-xl font-bold" style={{ color: primaryColor }}>
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
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  style={{ 
                    borderColor: secondaryColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderBottomColor = secondaryColor;
                    e.currentTarget.style.borderBottomWidth = '2px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderBottomWidth = '0px';
                  }}
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
                  className="flex items-center gap-2 text-muted-foreground"
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
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
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
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
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
                    className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left"
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
                    className="text-muted-foreground hover:text-gray-900 block px-3 py-2 text-base font-medium w-full text-left"
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
