
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Edit, Search, UserCheck, UserX } from 'lucide-react';
import { mockApi } from '@/lib/mockApi';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  reputation: number;
  created_at: string;
}

const AdminUsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const mockUsers = [
        {
          id: '1',
          email: 'john@example.com',
          name: 'John Smith',
          avatar_url: '',
          reputation: 85,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          email: 'jane@example.com',
          name: 'Jane Doe',
          avatar_url: '',
          reputation: 92,
          created_at: new Date().toISOString()
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReputation = async (userId: string, newReputation: number) => {
    try {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, reputation: newReputation } : user
      ));

      toast({
        title: "Success",
        description: "User reputation updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reputation",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name || 'No name'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        Reputation: {user.reputation}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newRep = prompt('Enter new reputation:', user.reputation.toString());
                      if (newRep && !isNaN(Number(newRep))) {
                        handleUpdateReputation(user.id, Number(newRep));
                      }
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your search.
        </div>
      )}
    </div>
  );
};

export default AdminUsersTab;
