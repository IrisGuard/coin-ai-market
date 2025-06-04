
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
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // TODO: Replace with real API call when backend is connected
      setNotifications([]);
      setUnreadCount(0);
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);
  
  const markAsRead = async (notificationId: string) => {
    // TODO: Replace with real API call when backend is connected
  };
  
  const markAllAsRead = async () => {
    // TODO: Replace with real API call when backend is connected
  };
  
  const deleteNotification = async (notificationId: string) => {
    // TODO: Replace with real API call when backend is connected
  };
  
  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    // TODO: Replace with real API call when backend is connected
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refresh: () => {
      // TODO: Replace with real API call when backend is connected
    }
  };
}
