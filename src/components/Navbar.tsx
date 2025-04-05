
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Upload, ShoppingCart, User, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-coin-gold text-2xl font-serif font-bold">Coin</span>
              <span className="text-coin-blue text-2xl font-serif font-bold">AI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:text-coin-gold hover:border-coin-gold inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/marketplace" className="border-transparent text-gray-500 hover:text-coin-gold hover:border-coin-gold inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Marketplace
              </Link>
              <Link to="/upload" className="border-transparent text-gray-500 hover:text-coin-gold hover:border-coin-gold inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Upload Coin
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-coin-gold focus:outline-none">
              <Search size={20} />
            </button>
            <LanguageSwitcher />
            <Link to="/login" className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-700 hover:bg-gray-50">
              Login
            </Link>
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
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-gold hover:text-coin-gold"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-gold hover:text-coin-gold"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              to="/upload" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-gold hover:text-coin-gold"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload Coin
            </Link>
            <Link 
              to="/login" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-coin-gold hover:text-coin-gold"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <div className="pl-3 pr-4 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
