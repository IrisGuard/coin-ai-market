import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { useAdminNotifications } from '@/hooks/useAdminData';

const AdminNotificationsTab = () => {
  const { data: notifications = [], isLoading } = useAdminNotifications();

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Stay informed about important activities and updates
          </p>
        </div>
        {/* Add any additional stats or quick actions here */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.slice(0, 10).map((notification) => (
              <div key={notification.id} className="flex items-start justify-between p-4 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{notification.type}</span>
                    <Badge variant={notification.is_read ? 'secondary' : 'default'}>
                      {notification.is_read ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div>
                      User: {notification.profiles?.name || 'Unknown'}
                    </div>
                    <div>
                      Email: {notification.profiles?.email || 'No email'}
                    </div>
                    <div>
                      {new Date(notification.created_at).toLocaleDateString()}
                    </div>
                  </div>
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
