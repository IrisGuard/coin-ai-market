
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

const DealerCoinsList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-6 w-6" />
          My Coins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>View and manage your coin inventory</p>
      </CardContent>
    </Card>
  );
};

export default DealerCoinsList;
