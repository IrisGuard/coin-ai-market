
import React, { useState } from 'react';
import { Coins, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

  // Clean navigation items for public site
  const navItems = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/upload', label: 'Sell Coin' },
  ];

  const primaryColor = currentTenant?.primary_color || '#007AFF';
  const secondaryColor = currentTenant?.secondary_color || '#FF9500';

  return (
    <>
      <nav className="navbar-fixed bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-electric-orange flex items-center justify-center" 
                       style={{ 
                         backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                       }}>
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                )}
                <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-orange bg-clip-text text-transparent">
                  {currentTenant?.name || 'CoinVision AI'}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Clean public navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-700 hover:text-electric-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              <LanguageSwitcher />
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

          {/* Mobile Navigation - Clean mobile menu */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg">
              <div className="container-padding py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-gray-700 hover:text-electric-blue block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="border-t pt-3">
                  <NavbarAuth />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hidden admin access - only accessible via keyboard shortcut */}
      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
      <AdminKeyboardHandler />
    </>
  );
};

export default Navbar;
