
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search,
  Shield,
  Star,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

const AdminUsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      role: 'verified_dealer',
      reputation: 98,
      verified_dealer: true,
      kyc_verified: true,
      created_at: '2024-01-15T10:30:00Z',
      phone: '+1-555-0123',
      avatar_url: null,
      rating: 4.9,
      coins_count: 127
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      username: 'sarahw',
      role: 'user',
      reputation: 85,
      verified_dealer: false,
      kyc_verified: true,
      created_at: '2024-02-01T14:20:00Z',
      phone: '+1-555-0124',
      avatar_url: null,
      rating: 4.7,
      coins_count: 43
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mike@example.com',
      username: 'mikec',
      role: 'expert',
      reputation: 94,
      verified_dealer: true,
      kyc_verified: true,
      created_at: '2024-01-20T09:15:00Z',
      phone: '+1-555-0125',
      avatar_url: null,
      rating: 4.8,
      coins_count: 89
    }
  ];

  const userStats = {
    total_users: 2847,
    verified_dealers: 156,
    expert_users: 89,
    new_registrations_24h: 23,
    active_users_7d: 1204,
    kyc_verified: 1876
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string, verified_dealer: boolean) => {
    if (role === 'admin') return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
    if (role === 'expert') return <Badge className="bg-purple-100 text-purple-800">Expert</Badge>;
    if (verified_dealer) return <Badge className="bg-blue-100 text-blue-800">Verified Dealer</Badge>;
    return <Badge variant="outline">User</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage platform users, dealers, and permissions</p>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total_users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Dealers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.verified_dealers}</div>
            <p className="text-xs text-muted-foreground">certified dealers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expert Users</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.expert_users}</div>
            <p className="text-xs text-muted-foreground">expert evaluators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New (24h)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.new_registrations_24h}</div>
            <p className="text-xs text-muted-foreground">new registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active (7d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.active_users_7d.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">weekly active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Verified</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.kyc_verified.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">identity verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Search & Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      {getRoleBadge(user.role, user.verified_dealer)}
                      {user.kyc_verified && <Shield className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username} • {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-4">
                      <span>Reputation: {user.reputation}/100</span>
                      <span>Rating: {user.rating}/5.0</span>
                      <span>Coins: {user.coins_count}</span>
                      <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <UserX className="h-4 w-4 mr-1" />
                    Suspend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTab;
