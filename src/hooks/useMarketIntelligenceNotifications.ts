
import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateSecureRandomNumber } from '@/utils/productionRandomUtils';

interface MarketNotification {
  id: string;
  type: 'price_alert' | 'market_trend' | 'new_listing' | 'auction_ending';
  title: string;
  message: string;
  coinId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export const useMarketIntelligenceNotifications = () => {
  const [notifications, setNotifications] = useState<MarketNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: notificationData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const mappedNotifications: MarketNotification[] = (notificationData || []).map(notification => ({
        id: notification.id,
        type: notification.type as MarketNotification['type'],
        title: `Market Alert: ${notification.type.replace('_', ' ')}`,
        message: notification.message,
        coinId: notification.related_coin_id,
        actionUrl: notification.action_url,
        isRead: notification.is_read,
        createdAt: notification.created_at,
        priority: 'medium' as const
      }));

      setNotifications(mappedNotifications);
      setUnreadCount(mappedNotifications.filter(n => !n.isRead).length);

    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      
      // Fallback notifications for development
      const fallbackNotifications: MarketNotification[] = [
        {
          id: '1',
          type: 'price_alert',
          title: 'Price Alert: Morgan Dollar',
          message: 'Morgan Silver Dollar 1921 price increased by 12%',
          priority: 'high',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          type: 'market_trend',
          title: 'Market Trend Alert',
          message: 'Silver coins showing strong upward trend',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      setNotifications(fallbackNotifications);
      setUnreadCount(fallbackNotifications.filter(n => !n.isRead).length);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  const generateMarketAlert = async (type: MarketNotification['type'], message: string, coinId?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.user.id,
          type,
          message,
          related_coin_id: coinId,
          is_read: false
        });

      if (error) {
        console.error('Error creating notification:', error);
        return;
      }

      await fetchNotifications();
    } catch (error) {
      console.error('Error in generateMarketAlert:', error);
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    generateMarketAlert,
    refreshNotifications: fetchNotifications
  };
};
