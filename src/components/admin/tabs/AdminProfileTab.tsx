
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Save } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfileTab = () => {
  const { user } = useAuth();
  const { updateAdminProfile } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateAdminProfile(formData);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Administrator Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="profile-fullname">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="profile-fullname"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">User ID:</span>
            <span className="text-sm font-mono">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Role:</span>
            <span className="text-sm font-semibold text-blue-600">Administrator</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Creation Date:</span>
            <span className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US') : 'N/A'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileTab;
