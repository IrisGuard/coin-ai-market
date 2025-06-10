
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import StoreCard from './StoreCard';

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

interface StoreOverviewTabProps {
  stores: Store[];
}

const StoreOverviewTab = ({ stores }: StoreOverviewTabProps) => {
  return (
    <TabsContent value="stores" className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores?.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </TabsContent>
  );
};

export default StoreOverviewTab;
