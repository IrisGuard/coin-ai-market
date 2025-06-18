
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Store } from 'lucide-react';
import VerifiedStoreBadge from '@/components/admin/enhanced/VerifiedStoreBadge';

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

interface StoreCardProps {
  store: Store;
  isSelected: boolean;
  onSelect: (storeId: string) => void;
  onEdit: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, isSelected, onSelect, onEdit }) => {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(store.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Store className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{store.name}</h3>
              {store.description && (
                <p className="text-sm text-gray-600 mt-1">{store.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <VerifiedStoreBadge isVerified={store.verified} size="sm" />
                <Badge variant={store.is_active ? "default" : "secondary"}>
                  {store.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Rating: {store.rating || 0}/5</span>
                <span>Sales: {store.total_sales || 0}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(store);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
