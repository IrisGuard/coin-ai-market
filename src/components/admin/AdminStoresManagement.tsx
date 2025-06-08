
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, CheckCircle, Clock, Users } from 'lucide-react';
import { useAdminStores } from '@/hooks/useAdminStores';

const AdminStoresManagement = () => {
  const { data: stores, isLoading, error } = useAdminStores();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-electric-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Error loading stores: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const totalStores = stores?.length || 0;
  const activeStores = stores?.filter(store => store.is_active)?.length || 0;
  const verifiedStores = stores?.filter(store => store.verified)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Stores Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-electric-green" />
              <div>
                <p className="text-sm text-gray-600">Total Stores</p>
                <p className="text-2xl font-bold">{totalStores}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-electric-blue" />
              <div>
                <p className="text-sm text-gray-600">Active Stores</p>
                <p className="text-2xl font-bold">{activeStores}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-electric-purple" />
              <div>
                <p className="text-sm text-gray-600">Verified Stores</p>
                <p className="text-2xl font-bold">{verifiedStores}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            All Stores ({totalStores})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalStores === 0 ? (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Stores Found</h3>
              <p className="text-gray-600">No stores have been created in the system yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Store</th>
                    <th className="text-left p-2">Owner</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Contact</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            {store.logo_url ? (
                              <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover rounded" />
                            ) : (
                              <Store className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{store.name}</p>
                            <p className="text-sm text-gray-600">{store.description?.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{store.profiles?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{store.profiles?.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          <Badge variant={store.is_active ? 'default' : 'secondary'}>
                            {store.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {store.verified && (
                            <Badge variant="default" className="text-xs">Verified</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">
                          {store.email && <p>{store.email}</p>}
                          {store.phone && <p>{store.phone}</p>}
                        </div>
                      </td>
                      <td className="p-2 text-sm text-gray-600">
                        {new Date(store.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoresManagement;
