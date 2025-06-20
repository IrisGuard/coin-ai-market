
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail, MessageCircle, Users, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminNotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalNotifications: 0,
    unreadNotifications: 0,
    totalMessages: 0,
    unreadMessages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotifications();
    fetchMessages();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles!notifications_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name, email),
          receiver:profiles!messages_receiver_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [notificationsRes, messagesRes] = await Promise.all([
        supabase.from('notifications').select('is_read'),
        supabase.from('messages').select('read_at')
      ]);

      const totalNotifications = notificationsRes.data?.length || 0;
      const unreadNotifications = notificationsRes.data?.filter(n => !n.is_read).length || 0;
      const totalMessages = messagesRes.data?.length || 0;
      const unreadMessages = messagesRes.data?.filter(m => !m.read_at).length || 0;

      setStats({
        totalNotifications,
        unreadNotifications,
        totalMessages,
        unreadMessages
      });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'bid': return 'bg-blue-600';
      case 'sale': return 'bg-green-600';
      case 'message': return 'bg-purple-600';
      case 'alert': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">All notifications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">Awaiting user action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">User-to-user messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Pending responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchNotifications}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{notification.profiles?.email || 'Unknown User'}</span>
                    <Badge className={getNotificationTypeColor(notification.type)}>
                      {notification.type?.toUpperCase()}
                    </Badge>
                    {!notification.is_read && (
                      <Badge className="bg-orange-600">UNREAD</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{notification.message}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </div>
                </div>
                {notification.action_url && (
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent User Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.slice(0, 10).map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{message.sender?.email || 'Unknown'}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{message.receiver?.email || 'Unknown'}</span>
                    <Badge className={
                      message.message_type === 'offer' ? 'bg-green-600' :
                      message.message_type === 'inquiry' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }>
                      {message.message_type?.toUpperCase() || 'MESSAGE'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-1 truncate">
                    {message.content}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                    {message.offer_amount && ` • Offer: $${message.offer_amount}`}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={message.read_at ? 'bg-green-600' : 'bg-red-600'}>
                    {message.read_at ? 'READ' : 'UNREAD'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsTab;
