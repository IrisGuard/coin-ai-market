import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/admin';

const AdminUsersTab = () => {
  const { data: users = [], isLoading } = useAdminUsers();
  const updateUserStatus = useUpdateUserStatus();

  const handleVerifyUser = (userId: string, verified: boolean) => {
    updateUserStatus.mutate({ userId, verified });
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  const stats = {
    total: users.length,
    verified: users.filter(u => u.verified_dealer).length,
    pending: users.filter(u => !u.verified_dealer).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Dealers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Reputation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <span className="font-medium">{user.name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.reputation || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.verified_dealer ? "default" : "secondary"}>
                      {user.verified_dealer ? "Verified Dealer" : "Regular User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={user.verified_dealer ? "destructive" : "default"}
                      onClick={() => handleVerifyUser(user.id, !user.verified_dealer)}
                      disabled={updateUserStatus.isPending}
                    >
                      {user.verified_dealer ? "Revoke" : "Verify"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTab;
