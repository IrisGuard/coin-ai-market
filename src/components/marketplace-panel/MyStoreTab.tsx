
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Star, Globe, Phone, Mail, ExternalLink } from 'lucide-react';
import { useUserOwnStore } from '@/hooks/useUserOwnStore';

const MyStoreTab = () => {
  const { data: store, isLoading, error } = useUserOwnStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            My Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Found</h3>
            <p className="text-gray-600 mb-4">You haven't created a store yet.</p>
            <Button>Create Store</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            {store.name}
            {store.verified && <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Store Information</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{store.description}</p>
                {store.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone}</span>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{store.email}</span>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                      {store.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Store Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={store.is_active ? "default" : "secondary"}>
                    {store.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verified</span>
                  <Badge variant={store.verified ? "default" : "secondary"}>
                    {store.verified ? "Yes" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm">{new Date(store.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit Store</Button>
            <Button variant="outline" size="sm">View Public Page</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyStoreTab;
