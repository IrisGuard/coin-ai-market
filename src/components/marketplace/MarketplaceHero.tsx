
import React from 'react';

const MarketplaceHero = () => {
  const coinCategories = [
    { name: 'Αρχαία Νομίσματα', href: '/marketplace?category=ancient', color: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' },
    { name: 'Σύγχρονα Νομίσματα', href: '/marketplace?category=modern', color: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' },
    { name: 'Νομίσματα Λάθους', href: '/marketplace?category=error', color: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' },
    { name: 'Βαθμολογημένα', href: '/marketplace?category=graded', color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' },
    { name: 'Δημοπρασίες', href: '/marketplace?auctions=true', color: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700' },
    { name: 'Ευρωπαϊκά', href: '/marketplace?category=european', color: 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700' },
    { name: 'Αμερικανικά', href: '/marketplace?category=american', color: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' },
    { name: 'Ασιατικά', href: '/marketplace?category=asian', color: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600' },
    { name: 'Συλλεκτικά', href: '/marketplace?category=collectible', color: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600' },
    { name: 'Χρυσά Νομίσματα', href: '/marketplace?category=gold', color: 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700' },
    { name: 'Ασημένια Νομίσματα', href: '/marketplace?category=silver', color: 'bg-gradient-to-r from-gray-400 to-slate-500 hover:from-gray-500 hover:to-slate-600' },
    { name: 'Σπάνια', href: '/marketplace?category=rare', color: 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700' }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Βρείτε το τέλειο νόμισμα για εσάς
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ανακαλύψτε αυθεντικά νομίσματα από συλλέκτες σε όλο τον κόσμο
          </p>

          {/* Colorful Category Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {coinCategories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className={`${category.color} text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
