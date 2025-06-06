
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Camera,
  Save,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Phone,
  Settings as SettingsIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/hooks/useI18n';
import { usePageView } from '@/hooks/usePageView';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  birth_date?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  created_at?: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  auction_alerts: boolean;
  price_alerts: boolean;
  new_messages: boolean;
  marketing_emails: boolean;
  weekly_digest: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  show_collection: boolean;
  show_activity: boolean;
  show_location: boolean;
  allow_messages: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'el' | 'en';
  currency: 'EUR' | 'USD' | 'GBP';
  sound_effects: boolean;
  auto_refresh: boolean;
  compact_view: boolean;
}

const Settings = () => {
  usePageView();
  const { user } = useAuth();
  const { theme, toggleTheme, language, setLanguage } = useTheme();
  const { t } = useI18n();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    email: user?.email || '',
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    birth_date: '',
    website: '',
    twitter: '',
    instagram: ''
  });

  // Settings states
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    auction_alerts: true,
    price_alerts: true,
    new_messages: true,
    marketing_emails: false,
    weekly_digest: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'public',
    show_collection: true,
    show_activity: true,
    show_location: false,
    allow_messages: true
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'dark',
    language: 'el',
    currency: 'EUR',
    sound_effects: true,
    auto_refresh: true,
    compact_view: false
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Settings fetch error:', settingsError);
      } else if (settingsData) {
        if (settingsData.notifications) {
          setNotifications(settingsData.notifications);
        }
        if (settingsData.privacy) {
          setPrivacy(settingsData.privacy);
        }
        if (settingsData.app_settings) {
          setAppSettings(settingsData.app_settings);
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user?.id,
            email: user?.email,
            ...profile,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert([
          {
            user_id: user?.id,
            notifications,
            privacy,
            app_settings: appSettings,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      });

      if (error) throw error;
      
      toast.success('Password changed successfully');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast.success('Avatar updated successfully');
      await fetchUserData();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error uploading avatar');
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      // Fetch all user data
      const [profileRes, settingsRes, portfolioRes, favoritesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id),
        supabase.from('user_settings').select('*').eq('user_id', user?.id),
        supabase.from('user_portfolios').select('*').eq('user_id', user?.id),
        supabase.from('user_favorites').select('*').eq('user_id', user?.id)
      ]);

      const exportData = {
        profile: profileRes.data,
        settings: settingsRes.data,
        portfolio: portfolioRes.data,
        favorites: favoritesRes.data,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coinvision-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error exporting data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user?.email || '')}&size=128&background=6366f1&color=ffffff`}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <label className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadAvatar}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile?.full_name || 'Anonymous User'}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500">
                      Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Full Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.full_name || ''} 
                      onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profile.phone || ''} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={profile.location || ''} 
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    placeholder="City, Country" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={profile.bio || ''} 
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
                <Button onClick={updateProfile} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button 
                    onClick={changePassword} 
                    disabled={saving || !passwordForm.new_password || !passwordForm.confirm_password}
                    variant="outline"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {saving ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">
                        {key === 'email_notifications' && 'Receive notifications via email'}
                        {key === 'push_notifications' && 'Receive push notifications on your device'}
                        {key === 'auction_alerts' && 'Get notified about auction activities'}
                        {key === 'price_alerts' && 'Receive alerts about price changes'}
                        {key === 'new_messages' && 'Get notified about new messages'}
                        {key === 'marketing_emails' && 'Receive promotional emails'}
                        {key === 'weekly_digest' && 'Weekly summary of activities'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}
                <Button onClick={updateSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Controls
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Control who can see your profile</p>
                  </div>
                  <Select 
                    value={privacy.profile_visibility} 
                    onValueChange={(value: 'public' | 'private' | 'friends') => 
                      setPrivacy({...privacy, profile_visibility: value})
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {Object.entries(privacy).filter(([key]) => key !== 'profile_visibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">
                        {key === 'show_collection' && 'Display your portfolio value publicly'}
                        {key === 'show_activity' && 'Show your bidding and transaction history'}
                        {key === 'show_location' && 'Display your location on your profile'}
                        {key === 'allow_messages' && 'Allow other users to send you messages'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setPrivacy({ ...privacy, [key]: checked })
                      }
                    />
                  </div>
                ))}
                <Button onClick={updateSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Export your data and manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-gray-600 mb-4">Download all your data in JSON format</p>
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Preferences
                </CardTitle>
                <CardDescription>Customize your experience on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-600">Toggle dark theme</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-600">Choose your preferred language</p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="el">Ελληνικά</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-gray-600">Display prices in your preferred currency</p>
                  </div>
                  <Select 
                    value={appSettings.currency} 
                    onValueChange={(value: 'EUR' | 'USD' | 'GBP') => 
                      setAppSettings({...appSettings, currency: value})
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={updateSettings} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
