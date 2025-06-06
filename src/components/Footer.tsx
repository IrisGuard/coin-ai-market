
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-electric-blue text-2xl font-serif font-bold">Coin</span>
              <span className="text-electric-orange text-2xl font-serif font-bold">AI</span>
            </div>
            <p className="text-gray-600 mb-4">
              The world's leading platform for AI-powered coin identification and numismatic trading.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-electric-blue transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-electric-orange transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.148-1.596L3.07 18.41l-1.579-1.529 2.202-2.122c-.367-.72-.49-1.515-.49-2.31 0-2.913 2.310-5.223 5.223-5.223 2.913 0 5.223 2.31 5.223 5.223 0 2.913-2.31 5.223-5.223 5.223z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-electric-green transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-electric-blue">Marketplace</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-600 hover:text-electric-blue transition-colors">Browse Coins</Link></li>
              <li><Link to="/upload" className="text-gray-600 hover:text-electric-orange transition-colors">Sell Coins</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-green transition-colors">Auctions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-yellow transition-colors">Price Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-electric-orange">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-electric-blue transition-colors">AI Identification</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-green transition-colors">Professional Grading</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-orange transition-colors">Authentication</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-yellow transition-colors">Valuation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-electric-green">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-electric-blue transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-orange transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-electric-yellow transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            © 2024 <span className="text-electric-blue font-semibold">Coin</span><span className="text-electric-orange font-semibold">AI</span>. All rights reserved. | Empowering numismatists worldwide with AI technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
