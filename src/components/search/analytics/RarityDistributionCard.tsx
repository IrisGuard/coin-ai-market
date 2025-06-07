
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

interface RarityDistributionCardProps {
  rarityDistribution: Record<string, number>;
  totalResults: number;
}

const RarityDistributionCard: React.FC<RarityDistributionCardProps> = ({
  rarityDistribution,
  totalResults
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Ultra Rare': return 'bg-purple-500';
      case 'Rare': return 'bg-red-500';
      case 'Uncommon': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Rarity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(rarityDistribution).map(([rarity, count]) => (
            <div key={rarity} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{rarity}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRarityColor(rarity)}`} />
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
              <Progress 
                value={(count / totalResults) * 100} 
                className="h-1"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RarityDistributionCard;
