
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const DiscoveryHeader: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          Discover Amazing Coins
        </CardTitle>
        <p className="text-gray-600">
          Explore trending coins, new arrivals, and rare finds curated by our AI
        </p>
      </CardHeader>
    </Card>
  );
};

export default DiscoveryHeader;
