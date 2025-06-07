
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';

interface CategoryDistributionCardProps {
  categories: Record<string, number>;
  totalResults: number;
}

const CategoryDistributionCard: React.FC<CategoryDistributionCardProps> = ({
  categories,
  totalResults
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(categories).map(([category, count]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{category}</span>
                <Badge variant="outline">{count} items</Badge>
              </div>
              <Progress 
                value={(count / totalResults) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionCard;
