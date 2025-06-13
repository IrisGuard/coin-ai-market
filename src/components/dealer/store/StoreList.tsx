
import React from 'react';
import { Store } from 'lucide-react';
import StoreCard from './StoreCard';

interface Store {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url?: string;
  is_active: boolean;
  verified: boolean;
  rating?: number;
  total_sales?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: any;
  shipping_options?: any;
}

interface StoreListProps {
  stores: Store[];
  selectedStoreId: string;
  onStoreSelect: (storeId: string) => void;
  onStoreEdit: (store: Store) => void;
}

const StoreList: React.FC<StoreListProps> = ({ 
  stores, 
  selectedStoreId, 
  onStoreSelect, 
  onStoreEdit 
}) => {
  if (stores.length === 0) {
    return (
      <div className="text-center py-8">
        <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          No stores yet. Create your first store to start selling coins!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          isSelected={selectedStoreId === store.id}
          onSelect={onStoreSelect}
          onEdit={onStoreEdit}
        />
      ))}
    </div>
  );
};

export default StoreList;
