
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Star, Clock, Sparkles } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Market Trends
          </Button>
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Browse Collections
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Live Auctions
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
