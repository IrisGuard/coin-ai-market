import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Store, Users, Eye, Edit, Trash2 } from 'lucide-react';
import type { MarketplaceStore } from '@/types/marketplace';

interface UserStoresManagementProps {
  dealers: MarketplaceStore[];
  dealersLoading: boolean;
}

const UserStoresManagement: React.FC<UserStoresManagementProps> = ({
  dealers,
  dealersLoading
}) => {
  if (dealersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Stores Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dealers || dealers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Stores Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No User Stores Yet</h3>
            <p>When users create verified dealer accounts, they will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Stores Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dealers.map((store) => {
            const profile = store.profiles?.[0];
            return (
              <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile?.avatar_url || store.logo_url} />
                    <AvatarFallback className="bg-electric-blue/10 text-electric-blue">
                      {profile?.full_name?.[0] || store.name?.[0] || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{profile?.full_name || store.name}</h3>
                      {(profile?.verified_dealer || store.verified) && (
                        <Badge variant="secondary" className="bg-electric-green/10 text-electric-green">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {typeof store.address === 'object' && store.address !== null 
                        ? (store.address as any).city || 'Unknown Location'
                        : 'Unknown Location'
                      } • Rating: {profile?.rating ? Number(profile.rating).toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStoresManagement;
