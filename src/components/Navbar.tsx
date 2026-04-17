import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import {
  Menu, X, User, LogOut, Shield, Coins, Store, Brain, Home, Gavel,
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const { data: userRole } = useSmartUserRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { name: t('nav.home'), path: '/', icon: Home },
    { name: t('nav.marketplace'), path: '/marketplace', icon: Coins },
    { name: t('nav.auctions'), path: '/auctions', icon: Gavel },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 inset-x-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Brand + nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </span>
              <span className="text-lg font-semibold tracking-tight">NovaCoin</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-foreground bg-secondary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {active && (
                      <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {user && userRole === 'dealer' && (
              <Link to="/dealer" className="hidden md:block">
                <Button size="sm" variant="outline" className="gap-2">
                  <Store className="w-4 h-4" />
                  {t('nav.dealerPanel')}
                </Button>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="hidden md:block">
                <Badge
                  variant="outline"
                  className="cursor-pointer gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
                >
                  <Brain className="w-3 h-3" />
                  {t('nav.aiAdmin')}
                </Badge>
              </Link>
            )}

            {user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{t('nav.profile')}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">{t('nav.signOut')}</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                  {t('nav.signIn')}
                </Button>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="lg:hidden grid place-items-center w-10 h-10 rounded-lg text-muted-foreground hover:bg-secondary"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="space-y-1 border-t border-border pt-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              {user && userRole === 'dealer' && (
                <Link to="/dealer" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-secondary">
                  <Store className="w-4 h-4" /> {t('nav.dealerPanel')}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent">
                  <Shield className="w-4 h-4" /> {t('nav.aiAdmin')}
                </Link>
              )}
              <div className="pt-2">
                {user ? (
                  <div className="flex gap-2">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-2" /> {t('nav.profile')}
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="text-destructive">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground">
                      {t('nav.signIn')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
