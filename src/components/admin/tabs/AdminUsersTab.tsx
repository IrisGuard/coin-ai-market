
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAdminUsers, useUpdateUserStatus, useUpdateUserRole } from '@/hooks/admin/useAdminUsers';
import { Users, UserCheck, UserX, Shield, Search, Mail } from 'lucide-react';

const AdminUsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the improved hook with left join
  const { data: users, isLoading } = useAdminUsers();
  const updateUserStatus = useUpdateUserStatus();
  const updateUserRole = useUpdateUserRole();

  const filteredUsers = users?.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalUsers = users?.length || 0;
  const verifiedDealers = users?.filter(user => user.verified_dealer)?.length || 0;
  const adminUsers = users?.filter(user => user.user_roles?.some((role: any) => role.role === 'admin'))?.length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage users, dealers, and admin accounts</p>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Dealers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedDealers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No users found matching your search' : 'No users found'}
              </div>
            ) : (
              filteredUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-coin-purple/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-coin-purple" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name || 'Unnamed User'}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={user.verified_dealer ? "default" : "secondary"}>
                          {user.verified_dealer ? "Verified Dealer" : "Regular User"}
                        </Badge>
                        {user.user_roles?.map((roleData: any) => (
                          <Badge key={roleData.role} variant="outline">
                            {roleData.role}
                          </Badge>
                        ))}
                        {user.stores?.length > 0 && (
                          <Badge variant="outline">Has Store</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={user.verified_dealer ? "destructive" : "default"}
                      size="sm"
                      onClick={() => updateUserStatus.mutate({ 
                        userId: user.id, 
                        verified: !user.verified_dealer 
                      })}
                      disabled={updateUserStatus.isPending}
                    >
                      {user.verified_dealer ? (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Unverify
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Verify
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentRole = user.user_roles?.[0]?.role || 'user';
                        const newRole = currentRole === 'admin' ? 'user' : 'admin';
                        updateUserRole.mutate({ userId: user.id, role: newRole });
                      }}
                      disabled={updateUserRole.isPending}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Toggle Admin
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTab;
