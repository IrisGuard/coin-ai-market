
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const AdminProfileTab = () => {
  const { user } = useAuth();
  const { updateAdminProfile } = useAdmin();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateAdminProfile({ fullName, email });
      toast({
        title: "Profile Updated",
        description: "Your admin profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Admin Profile</h3>
          <p className="text-sm text-muted-foreground">Manage your administrator profile settings</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Administrator
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                {user?.id || 'Not available'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Account Created</Label>
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Last Sign In</Label>
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Not available'}
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Session Timeout</h4>
                  <p className="text-sm text-red-700">
                    Your admin session will expire after exactly 10 minutes of inactivity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfileTab;
