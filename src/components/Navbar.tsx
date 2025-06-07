import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu as MenuIcon,
  X as CloseIcon,
  Plus,
  LogOut,
  LogIn,
  User,
  Settings,
  Coins,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center font-semibold text-xl text-coin-primary">
            <Coins className="w-6 h-6 mr-2 text-yellow-500" />
            CoinVision
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-coin-blue transition-colors ${location.pathname === '/' ? 'font-semibold' : ''
                }`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`text-gray-700 hover:text-coin-blue transition-colors ${location.pathname === '/search' ? 'font-semibold' : ''
                }`}
            >
              Search
            </Link>
            <Link
              to="/discovery"
              className={`text-gray-700 hover:text-coin-blue transition-colors ${location.pathname === '/discovery' ? 'font-semibold' : ''
                }`}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Discovery
            </Link>
            <Link 
              to="/mobile-ai" 
              className="flex items-center text-gray-700 hover:text-coin-blue transition-colors"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile AI
            </Link>
            {user && (
              <Link
                to="/upload"
                className="flex items-center text-gray-700 hover:text-coin-blue transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Upload
              </Link>
            )}
          </div>

          {/* Mobile Menu and Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            )}

            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-gray-700 hover:text-coin-blue transition-colors ${location.pathname === '/' ? 'font-semibold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/search"
                className={`text-gray-700 hover:text-coin-blue transition-colors ${location.pathname === '/search' ? 'font-semibold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                Search
              </Link>
              <Link
                to="/discovery"
                className={`text-gray-700 hover:text-coin-blue transition-colors ${location.pathname === '/discovery' ? 'font-semibold' : ''
                  }`}
                onClick={closeMobileMenu}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Discovery
              </Link>
              <Link 
                to="/mobile-ai" 
                className="flex items-center text-gray-700 hover:text-coin-blue transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile AI
              </Link>
              {user && (
                <Link
                  to="/upload"
                  className="flex items-center text-gray-700 hover:text-coin-blue transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Upload
                </Link>
              )}
              {!user && (
                <>
                  <Button variant="outline" size="sm" onClick={() => { navigate('/login'); closeMobileMenu(); }}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => { navigate('/register'); closeMobileMenu(); }}>
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
