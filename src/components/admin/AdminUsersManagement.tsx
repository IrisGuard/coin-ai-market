
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, CheckCircle, Clock } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';

const AdminUsersManagement = () => {
  const { data: users, isLoading, error } = useAdminUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-electric-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Error loading users: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const totalUsers = users?.length || 0;
  const verifiedDealers = users?.filter(user => user.verified_dealer)?.length || 0;
  const kycVerified = users?.filter(user => user.kyc_verified)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-electric-blue" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-electric-green" />
              <div>
                <p className="text-sm text-gray-600">Verified Dealers</p>
                <p className="text-2xl font-bold">{verifiedDealers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-electric-purple" />
              <div>
                <p className="text-sm text-gray-600">KYC Verified</p>
                <p className="text-2xl font-bold">{kycVerified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({totalUsers})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalUsers === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">No registered users in the system yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Joined</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{user.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{user.username || 'No username'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">{user.email || 'No email'}</td>
                      <td className="p-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role || 'user'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          {user.verified_dealer && (
                            <Badge variant="default" className="text-xs">Verified Dealer</Badge>
                          )}
                          {user.kyc_verified && (
                            <Badge variant="default" className="text-xs">KYC Verified</Badge>
                          )}
                          {!user.verified_dealer && !user.kyc_verified && (
                            <Badge variant="secondary" className="text-xs">Standard User</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
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

export default AdminUsersManagement;
