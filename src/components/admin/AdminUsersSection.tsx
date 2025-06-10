
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/admin';
import { User, CheckCircle, XCircle } from 'lucide-react';

const AdminUsersSection = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const updateUserStatus = useUpdateUserStatus();

  const handleToggleVerification = (userId: string, currentStatus: boolean) => {
    updateUserStatus.mutate({ userId, verified: !currentStatus });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage user accounts and verification status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.verified_dealer ? "default" : "secondary"}>
                  {user.verified_dealer ? "Verified" : "Unverified"}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersSection;
