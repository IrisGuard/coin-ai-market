
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Users, Shield, Search, UserCheck, UserX } from 'lucide-react';

const AdminUsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Get user roles separately
  const { data: userRoles } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (error) throw error;
      return data || [];
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ verified_dealer: verified })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User Updated",
        description: "User status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to update user status',
        variant: "destructive",
      });
    },
  });

  const promoteToAdmin = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast({
        title: "User Promoted",
        description: "User has been promoted to admin successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to promote user',
        variant: "destructive",
      });
    },
  });

  // Helper function to get user roles
  const getUserRoles = (userId: string) => {
    return userRoles?.filter(role => role.user_id === userId) || [];
  };

  // Helper function to check if user is admin
  const isUserAdmin = (userId: string) => {
    return getUserRoles(userId).some(role => role.role === 'admin');
  };

  const totalUsers = users?.length || 0;
  const verifiedDealers = users?.filter(user => user.verified_dealer)?.length || 0;
  const adminUsers = users?.filter(user => isUserAdmin(user.id))?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage all registered users and their permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
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
          placeholder="Search users by name, email, or username..."
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
                <p>Loading users...</p>
              </div>
            ) : users?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              users?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user.name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{user.role || 'user'}</Badge>
                        {user.verified_dealer && <Badge variant="default">Verified Dealer</Badge>}
                        {isUserAdmin(user.id) && (
                          <Badge variant="destructive">Admin</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.role === 'dealer' && (
                      <Button
                        variant={user.verified_dealer ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleUserStatus.mutate({ 
                          userId: user.id, 
                          verified: !user.verified_dealer 
                        })}
                        disabled={toggleUserStatus.isPending}
                      >
                        {user.verified_dealer ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        {user.verified_dealer ? 'Revoke' : 'Verify'}
                      </Button>
                    )}
                    {!isUserAdmin(user.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => promoteToAdmin.mutate(user.id)}
                        disabled={promoteToAdmin.isPending}
                      >
                        <Shield className="h-4 w-4" />
                        Make Admin
                      </Button>
                    )}
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
