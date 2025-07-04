
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useDealerStores } from '@/hooks/useDealerStores';
import { useAdminStore } from '@/contexts/AdminStoreContext';

const ProductionStoreManager = () => {
  const { data: stores = [], isLoading, error } = useDealerStores();
  const { selectedStoreId, setSelectedStoreId } = useAdminStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Production Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading live store data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Production Store Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Error loading stores: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
           Production Store Management
         </CardTitle>
       </CardHeader>
       <CardContent className="space-y-4">
         <div className="mb-4">
           <div className="flex items-center justify-between">
             <h4 className="font-medium">Live Store Status</h4>
             <div className="flex gap-2">
               <Badge variant="secondary">
                 Admin Stores: {stores.filter(s => s.isAdminStore).length}
               </Badge>
               <Badge variant="outline">
                 User Stores: {stores.filter(s => !s.isAdminStore).length}
               </Badge>
             </div>
           </div>
         </div>
        {stores.length === 0 ? (
          <div className="text-center py-8">
            <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Stores Yet</h3>
            <p className="text-gray-500 mb-4">Create your first dealer store to get started.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Store
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Live Stores ({stores.length})</h4>
              <Badge variant="outline" className="text-green-600 border-green-300">
                Production Data
              </Badge>
            </div>
            
            <div className="grid gap-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStoreId === store.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStoreId(store.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{store.name}</h5>
                      <p className="text-sm text-gray-600">{store.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {store.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {store.is_active && (
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Owner ID: {store.user_id?.slice(0, 8)}...
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Created: {new Date(store.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionStoreManager;
