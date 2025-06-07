
import React from 'react';

const MarketplaceHero = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-electric-blue via-electric-purple to-electric-pink bg-clip-text text-transparent mb-3">
            Ανακαλύψτε τα καλύτερα καταστήματα νομισμάτων
          </h1>
          <p className="text-lg text-gray-600">
            Εξερευνήστε αυθεντικά νομίσματα από επαληθευμένους dealers παγκοσμίως
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
