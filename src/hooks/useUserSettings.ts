
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

export const useUserSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Settings fetch error:', settingsError);
      } else if (settingsData) {
        if (settingsData.notifications) {
          setNotifications(settingsData.notifications as NotificationSettings);
        }
        if (settingsData.privacy) {
          setPrivacy(settingsData.privacy as PrivacySettings);
        }
        if (settingsData.app_settings) {
          setAppSettings(settingsData.app_settings as AppSettings);
        }
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id!,
          notifications,
          privacy,
          app_settings: appSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    notifications,
    privacy,
    appSettings,
    setNotifications,
    setPrivacy,
    setAppSettings,
    updateSettings,
    fetchUserSettings
  };
};
