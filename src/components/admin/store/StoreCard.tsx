
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
  verified: boolean;
  is_active: boolean;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    verified_dealer: boolean;
    rating: number;
  }[] | {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    verified_dealer: boolean;
    rating: number;
  } | null;
  coins: any[];
}

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  // Handle both array and single object cases for profiles
  const profile = Array.isArray(store.profiles) ? store.profiles[0] : store.profiles;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{store.name}</h3>
          <div className="flex gap-2">
            <Badge variant={store.verified ? 'default' : 'secondary'}>
              {store.verified ? 'Verified' : 'Unverified'}
            </Badge>
            <Badge variant={store.is_active ? 'default' : 'destructive'}>
              {store.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Owner:</span>
            <span>{profile?.full_name || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span>{store.coins?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rating:</span>
            <span>{profile?.rating || 'N/A'}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">View Details</Button>
          {!store.verified && (
            <Button size="sm" variant="outline">Verify</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
