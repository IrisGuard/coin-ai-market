
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const WatchlistEmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your Watchlist is Empty</h3>
        <p className="text-gray-600 mb-4">Start watching coins to track their prices and get notifications.</p>
        <Link to="/marketplace">
          <Button>Browse Marketplace</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default WatchlistEmptyState;
