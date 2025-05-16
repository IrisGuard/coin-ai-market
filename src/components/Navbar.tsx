
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import NavbarAuth from './NavbarAuth';
import NotificationsPanel from './NotificationsPanel';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      window.location.href = `/marketplace?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.span 
                className="text-coin-gold text-2xl font-serif font-bold"
                whileHover={{ scale: 1.05 }}
              >
                Coin
              </motion.span>
              <motion.span 
                className="text-coin-purple text-2xl font-serif font-bold"
                whileHover={{ scale: 1.05 }}
              >
                AI
              </motion.span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:text-coin-purple hover:border-coin-purple inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/marketplace" className="border-transparent text-gray-500 hover:text-coin-purple hover:border-coin-purple inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Marketplace
              </Link>
              <Link to="/upload" className="border-transparent text-gray-500 hover:text-coin-purple hover:border-coin-purple inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Upload Coin
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              {isSearchOpen ? (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }} 
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-coin-purple focus:border-coin-purple"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  />
                  <button type="submit" className="sr-only">Search</button>
                </motion.form>
              ) : (
                <button 
                  className="p-1 rounded-full text-gray-400 hover:text-coin-purple focus:outline-none"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            <NotificationsPanel />
            <LanguageSwitcher />
            <NavbarAuth />
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-purple hover:text-coin-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-purple hover:text-coin-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              to="/upload" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-purple hover:text-coin-purple"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload Coin
            </Link>
            <div className="pl-3 pr-4 py-2 flex items-center justify-between">
              <NavbarAuth />
              <div className="flex items-center space-x-2">
                <NotificationsPanel />
                <LanguageSwitcher />
              </div>
            </div>
            <div className="pl-3 pr-4 py-2">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-coin-purple focus:border-coin-purple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-coin-purple text-white px-4 py-2 rounded-r-md flex items-center justify-center"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
