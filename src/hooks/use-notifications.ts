
import { useState, useEffect } from 'react';
import { supabase, hasValidSupabaseCredentials } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  // Check if we can use Supabase features
  const canUseSupabase = hasValidSupabaseCredentials();
  
  // Fetch notifications for the current user
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user || !canUseSupabase) {
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
      
      // Use mock data for development if Supabase is not available
      if (!canUseSupabase) {
        const mockNotifications = [
          {
            id: '1',
            user_id: user?.id || 'user123',
            message: 'Νέα προσφορά €250 στο νόμισμα 1794 Flowing Hair Dollar',
            type: 'bid' as const,
            is_read: false,
            created_at: new Date().toISOString(),
            related_coin_id: 'coin123',
            action_url: '/coins/coin123'
          },
          {
            id: '2',
            user_id: user?.id || 'user123',
            message: 'Η δημοπρασία σας για το 1909 Lincoln Cent έληξε με νικητήρια προσφορά €125',
            type: 'auction_end' as const,
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            related_coin_id: 'coin456',
            action_url: '/coins/coin456'
          },
          {
            id: '3',
            user_id: user?.id || 'user123',
            message: 'Έχετε ξεπεραστεί στη δημοπρασία για το 1883 Racketeer Nickel. Η νέα ψηλότερη προσφορά είναι €350',
            type: 'outbid' as const,
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            related_coin_id: 'coin789',
            action_url: '/coins/coin789'
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user || !canUseSupabase) {
      // For development without Supabase
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      return;
    }
    
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
    if (!user || !canUseSupabase) {
      // For development without Supabase
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      setUnreadCount(0);
      return;
    }
    
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
      
      toast({
        title: "Ειδοποιήσεις ενημερώθηκαν",
        description: "Όλες οι ειδοποιήσεις επισημάνθηκαν ως αναγνωσμένες.",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    if (!user || !canUseSupabase) {
      // For development without Supabase
      const wasUnread = notifications.some(n => n.id === notificationId && !n.is_read);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Only decrement unreadCount if the deleted notification was unread
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return;
    }
    
    try {
      // Find the notification to check if it was unread
      const wasUnread = notifications.some(n => n.id === notificationId && !n.is_read);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Only decrement unreadCount if the deleted notification was unread
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Η ειδοποίηση διαγράφηκε",
        description: "Η ειδοποίηση έχει αφαιρεθεί από τη λίστα σας.",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  // Create a new notification (useful for development/testing)
  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    if (!user || !canUseSupabase) {
      // For development without Supabase
      const newNotification: Notification = {
        ...notification,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast({
        title: getNotificationTitle(notification.type),
        description: notification.message,
      });
      
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          is_read: false
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => [data as Notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };
  
  // Subscribe to real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user || !canUseSupabase) return;
    
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
  }, [isAuthenticated, user, canUseSupabase]);
  
  // Helper to get notification title
  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'bid':
        return 'Νέα Προσφορά';
      case 'outbid':
        return 'Ξεπεράστηκε η προσφορά σας';
      case 'auction_end':
        return 'Η Δημοπρασία Έληξε';
      case 'purchase':
        return 'Ολοκληρώθηκε η Αγορά';
      case 'system':
        return 'Ειδοποίηση Συστήματος';
      default:
        return 'Ειδοποίηση';
    }
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refresh: fetchNotifications
  };
}
