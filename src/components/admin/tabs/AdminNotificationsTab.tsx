
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Send, Users, MessageSquare } from 'lucide-react';
import { useAdminNotifications } from '@/hooks/useAdminData';

const AdminNotificationsTab = () => {
  const { data: notifications = [], isLoading } = useAdminNotifications();

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'bid':
        return <Badge className="bg-blue-100 text-blue-800">Bid</Badge>;
      case 'outbid':
        return <Badge className="bg-orange-100 text-orange-800">Outbid</Badge>;
      case 'auction_end':
        return <Badge className="bg-green-100 text-green-800">Auction End</Badge>;
      case 'system':
        return <Badge className="bg-purple-100 text-purple-800">System</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    today: notifications.filter(n => {
      const today = new Date().toDateString();
      return new Date(n.created_at || '').toDateString() === today;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Broadcast Notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Notify All Users
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notify Verified Dealers
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              System Announcement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading notifications...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.profiles?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{notification.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" title={notification.message}>
                        {notification.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.is_read ? "outline" : "default"}>
                        {notification.is_read ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notification.created_at ? new Date(notification.created_at).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Resend
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsTab;
