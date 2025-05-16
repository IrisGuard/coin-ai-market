
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'bid' | 'auction_end' | 'purchase' | 'system';
  is_read: boolean;
  created_at: string;
  related_coin_id?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  // Fetch notifications for the current user
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        throw error;
      }
      
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Find the notification to check if it was unread
      const wasUnread = notifications.some(n => n.id === notificationId && !n.is_read);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Only decrement unreadCount if the deleted notification was unread
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Subscribe to real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    // Initial fetch
    fetchNotifications();
    
    // Subscribe to changes
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const newNotification = payload.new as Notification;
        
        // Add to state
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show a toast notification
        toast({
          title: getNotificationTitle(newNotification.type),
          description: newNotification.message,
        });
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, user]);
  
  // Helper to get notification title
  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'bid':
        return 'New Bid';
      case 'auction_end':
        return 'Auction Ended';
      case 'purchase':
        return 'Purchase Completed';
      case 'system':
        return 'System Notification';
      default:
        return 'Notification';
    }
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  };
}
