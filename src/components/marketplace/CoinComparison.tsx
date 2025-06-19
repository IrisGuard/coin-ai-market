
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Coin } from '@/types/coin';

interface CoinComparisonProps {
  coins?: Coin[];
  onAddCoin?: () => void;
}

const CoinComparison: React.FC<CoinComparisonProps> = ({ coins = [], onAddCoin }) => {
  const [compareCoins, setCompareCoins] = useState<Coin[]>(coins);

  const removeCoin = (coinId: string) => {
    setCompareCoins(prev => prev.filter(coin => coin.id !== coinId));
  };

  const addCoin = (coin: Coin) => {
    if (compareCoins.length < 4 && !compareCoins.find(c => c.id === coin.id)) {
      setCompareCoins(prev => [...prev, coin]);
    }
  };

  const getComparisonIcon = (value1: number, value2: number) => {
    if (value1 > value2) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value1 < value2) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const comparisonFields = [
    { key: 'price', label: 'Price', format: (val: number) => `$${val?.toLocaleString() || 'N/A'}` },
    { key: 'year', label: 'Year', format: (val: number) => val?.toString() || 'N/A' },
    { key: 'grade', label: 'Grade', format: (val: string) => val || 'N/A' },
    { key: 'rarity', label: 'Rarity', format: (val: string) => val || 'N/A' },
    { key: 'condition', label: 'Condition', format: (val: string) => val || 'N/A' },
    { key: 'views', label: 'Views', format: (val: number) => val?.toLocaleString() || '0' }
  ];

  if (compareCoins.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Coin Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No coins selected for comparison</p>
            <Button onClick={onAddCoin}>
              <Plus className="h-4 w-4 mr-2" />
              Add Coins to Compare
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Coin Comparison
          {compareCoins.length < 4 && (
            <Button variant="outline" size="sm" onClick={onAddCoin}>
              <Plus className="h-4 w-4 mr-2" />
              Add Coin
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Feature</th>
                {compareCoins.map((coin, index) => (
                  <th key={coin.id} className="text-center p-2 border-b min-w-[200px]">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCoin(coin.id)}
                        className="float-right"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-16 h-16 rounded-lg mx-auto object-cover"
                      />
                      <div className="text-sm font-medium">{coin.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field) => (
                <tr key={field.key}>
                  <td className="p-2 border-b font-medium">{field.label}</td>
                  {compareCoins.map((coin, index) => {
                    const value = coin[field.key as keyof Coin];
                    const prevValue = index > 0 ? compareCoins[index - 1][field.key as keyof Coin] : null;
                    
                    return (
                      <td key={coin.id} className="p-2 border-b text-center">
                        <div className="flex items-center justify-center gap-2">
                          {field.format(value as any)}
                          {index > 0 && field.key === 'price' && typeof value === 'number' && typeof prevValue === 'number' && (
                            getComparisonIcon(value, prevValue)
                          )}
                        </div>
                        {field.key === 'rarity' && (
                          <Badge variant="outline" className="mt-1">
                            {value as string}
                          </Badge>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {compareCoins.length > 1 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Quick Insights</h4>
            <ul className="text-sm space-y-1">
              <li>
                • Highest Price: {compareCoins.reduce((max, coin) => 
                  (coin.price || 0) > (max.price || 0) ? coin : max
                ).name} - ${compareCoins.reduce((max, coin) => 
                  Math.max(max, coin.price || 0), 0
                ).toLocaleString()}
              </li>
              <li>
                • Oldest Coin: {compareCoins.reduce((oldest, coin) => 
                  (coin.year || 0) < (oldest.year || Infinity) ? coin : oldest
                ).name} ({compareCoins.reduce((min, coin) => 
                  Math.min(min, coin.year || Infinity), Infinity
                )})
              </li>
              <li>
                • Most Popular: {compareCoins.reduce((max, coin) => 
                  (coin.views || 0) > (max.views || 0) ? coin : max
                ).name} - {compareCoins.reduce((max, coin) => 
                  Math.max(max, coin.views || 0), 0
                ).toLocaleString()} views
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinComparison;
