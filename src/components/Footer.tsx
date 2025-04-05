
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, GitHub } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-coin-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              <span className="text-coin-gold">Coin</span>
              <span className="text-white">AI</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Global platform for coin identification, valuation and auctions powered by AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-coin-gold">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-coin-gold">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-coin-gold">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-coin-gold">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-300 hover:text-coin-gold">Explore</Link></li>
              <li><Link to="/upload" className="text-gray-300 hover:text-coin-gold">Sell a Coin</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Auctions</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Featured Coins</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">AI Recognition Guide</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Grading Standards</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Price Guide</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Help Center</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-coin-gold">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 py-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} CoinAI Market. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Powered by AI Technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
