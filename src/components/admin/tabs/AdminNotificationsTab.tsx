
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useNotifications } from '@/hooks/admin';
import { Bell, Check } from 'lucide-react';

const AdminNotificationsTab = () => {
  const { data: notifications = [], isLoading } = useNotifications();

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </h3>
        <div className="text-sm text-muted-foreground">
          Total: {notifications.length} notifications
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow key={notification.id}>
              <TableCell>
                <Badge variant="outline">{notification.type}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">
                {notification.message}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {notification.profiles?.name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {notification.profiles?.email || 'No email'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={notification.is_read ? 'default' : 'secondary'}>
                  {notification.is_read ? 'Read' : 'Unread'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(notification.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  <Check className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminNotificationsTab;
