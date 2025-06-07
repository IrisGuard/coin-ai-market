
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const PersonalizedRecommendations: React.FC = () => {
  const recommendations = [
    { id: '13', name: '1942-D Mercury Dime', price: 45, reason: 'Similar to your recent searches' },
    { id: '14', name: '1964 Kennedy Half Dollar', price: 25, reason: 'Popular in your price range' },
    { id: '15', name: '1881-S Morgan Dollar', price: 350, reason: 'Matches your collection interests' },
    { id: '16', name: '1943-S Steel Cent', price: 15, reason: 'Trending in your area' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          Recommended for You
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your search history and preferences
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((coin) => (
            <Card key={coin.id} className="border border-purple-200">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{coin.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      ${coin.price}
                    </span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 italic">{coin.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
