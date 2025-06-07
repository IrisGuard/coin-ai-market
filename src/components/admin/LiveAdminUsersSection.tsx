
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealUsersData } from '@/hooks/useRealAdminData';
import { useUpdateUserStatus } from '@/hooks/useAdminData';
import { User, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const LiveAdminUsersSection = () => {
  const { data: users = [], isLoading, refetch } = useRealUsersData();
  const updateUserStatus = useUpdateUserStatus();

  const handleToggleVerification = (userId: string, currentStatus: boolean) => {
    updateUserStatus.mutate({ userId, verified: !currentStatus }, {
      onSuccess: () => {
        refetch(); // Refresh data after update
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading users...</p>
        </CardContent>
      </Card>
    );
  }

  const verifiedCount = users.filter(u => u.verified_dealer).length;
  const totalCount = users.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              {totalCount} total users • {verifiedCount} verified dealers
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found. This indicates the database is empty.
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-600">{user.email || 'No email'}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      {user.reputation && ` • Reputation: ${user.reputation}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.verified_dealer ? "default" : "secondary"}>
                    {user.verified_dealer ? "Verified Dealer" : "Regular User"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVerification(user.id, user.verified_dealer)}
                    disabled={updateUserStatus.isPending}
                  >
                    {user.verified_dealer ? (
                      <XCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    {user.verified_dealer ? "Revoke" : "Verify"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveAdminUsersSection;
