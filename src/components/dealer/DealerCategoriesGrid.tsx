
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid3X3 } from 'lucide-react';

const categories = [
  'Ancient Coins', 'US Coins', 'World Coins', 'Gold Coins', 'Silver Coins',
  'Euro Coins', 'UK Coins', 'Canadian Coins', 'Australian Coins', 'Error Coins',
  'Commemorative', 'Proof Sets', 'Mint Sets', 'Bullion', 'Medals',
  'Tokens', 'Paper Money', 'Rare Coins', 'Investment Coins', 'Collector Coins',
  'Foreign Coins', 'Military Coins', 'Historical Coins', 'Modern Coins', 'Vintage Coins',
  'Precious Metals', 'Coin Accessories', 'Coin Supplies', 'Coin Albums', 'Coin Books'
];

const DealerCategoriesGrid = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Browse and select from 30+ coin categories for your listings
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {categories.map((category, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="p-3 text-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Category Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI-powered category suggestions</li>
                <li>• Automatic categorization based on coin images</li>
                <li>• Market trends for each category</li>
                <li>• Category-specific pricing insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealerCategoriesGrid;
