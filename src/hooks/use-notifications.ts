
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'bid' | 'auction_end' | 'purchase' | 'system' | 'outbid';
  is_read: boolean;
  created_at: string;
  related_coin_id?: string;
  action_url?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Mock notifications για development
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Notifications: Waiting for new Supabase connection');
      setNotifications([]);
      setUnreadCount(0);
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);
  
  const markAsRead = async (notificationId: string) => {
    console.log('Mark as read: Waiting for new Supabase connection');
  };
  
  const markAllAsRead = async () => {
    console.log('Mark all as read: Waiting for new Supabase connection');
  };
  
  const deleteNotification = async (notificationId: string) => {
    console.log('Delete notification: Waiting for new Supabase connection');
  };
  
  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    console.log('Create notification: Waiting for new Supabase connection');
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refresh: () => console.log('Refresh notifications: Waiting for new Supabase connection')
  };
}
