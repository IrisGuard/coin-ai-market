
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bell, Users } from 'lucide-react';
import { mockApi } from '@/lib/mockApi';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const AdminNotificationsTab = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('announcement');
  const [targetUser, setTargetUser] = useState('all');

  const fetchNotifications = async () => {
    try {
      // Mock notifications data
      const mockNotifications = [
        {
          id: '1',
          user_id: 'user1',
          message: 'Welcome to CoinVision AI!',
          type: 'announcement',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: 'user2',
          message: 'Your coin has been verified!',
          type: 'system',
          is_read: true,
          created_at: new Date().toISOString()
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!newMessage.trim()) return;

    try {
      const newNotification = {
        id: Date.now().toString(),
        user_id: targetUser === 'all' ? 'all' : targetUser,
        message: newMessage,
        type: messageType,
        is_read: false,
        created_at: new Date().toISOString()
      };

      setNotifications([newNotification, ...notifications]);
      setNewMessage('');
      
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send New Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Message Type</label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target</label>
              <Select value={targetUser} onValueChange={setTargetUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin">Admins Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your notification message..."
              rows={3}
            />
          </div>
          <Button 
            onClick={handleSendNotification}
            disabled={!newMessage.trim()}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notifications
        </h3>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          notification.type === 'warning' ? 'destructive' :
                          notification.type === 'announcement' ? 'default' : 'secondary'
                        }
                      >
                        {notification.type}
                      </Badge>
                      {!notification.is_read && (
                        <Badge variant="outline" className="text-blue-600">
                          Unread
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsTab;
