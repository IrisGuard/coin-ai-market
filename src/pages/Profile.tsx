import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Star, Shield, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePageView } from '@/hooks/usePageView';
import { useUserProfile } from '@/hooks/useUserProfile';

const Profile = () => {
  usePageView();
  const { user } = useAuth();
  const { profile, setProfile, updateProfile, saving, data: profileData } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Sync form data with profile data
  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        bio: profileData.bio || '',
        avatar_url: profileData.avatar_url || ''
      });
    }
  }, [profileData, setProfile]);

  const handleSave = async () => {
    await updateProfile();
    setIsEditing(false);
  };

  const getUserInitials = () => {
    const name = profile.full_name || user?.email || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-xl bg-purple-100 text-purple-600">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="mt-4">{profile.full_name || 'User'}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    5.0 Rating
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <div className="text-center text-sm text-gray-600">
                  Member since {new Date(user?.created_at || '').toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <Input
                        id="fullName"
                        value={profile.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
