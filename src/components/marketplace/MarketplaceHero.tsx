
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

const MarketplaceHero = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-pink bg-clip-text text-transparent mb-3">
              Ανακαλύψτε τα καλύτερα καταστήματα νομισμάτων
            </h1>
            <p className="text-lg text-gray-600">
              Εξερευνήστε αυθεντικά νομίσματα από επαληθευμένους dealers παγκοσμίως
            </p>
          </div>
          
          {/* Register Store Button */}
          <div className="ml-6">
            <Link to="/auth">
              <Button 
                size="sm" 
                className="bg-electric-orange hover:bg-electric-orange/90 text-white shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
              >
                <Store className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Εγγραφή Καταστήματος</span>
                <span className="sm:hidden">Εγγραφή</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
