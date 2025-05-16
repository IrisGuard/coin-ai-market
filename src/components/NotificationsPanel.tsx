
import { useState } from 'react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bid':
        return 'bg-coin-orange';
      case 'auction_end':
        return 'bg-coin-purple';
      case 'purchase':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
    
    // If there's a related coin, navigate to its details page
    if (notification.related_coin_id) {
      navigate(`/coins/${notification.related_coin_id}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative p-3 rounded-lg border mb-2 cursor-pointer ${
        notification.is_read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${getTypeColor(notification.type)}`} />
        <div className="flex-1">
          <p className={`text-sm ${notification.is_read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <span className="text-xs text-gray-500 mt-1">
            {new Date(notification.created_at).toLocaleString()}
          </span>
        </div>
        <div className="flex space-x-1">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
            >
              <Check className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationsPanel = () => {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 min-w-[20px] h-5 bg-coin-orange text-white"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-auto">
        <div className="flex justify-between items-center p-2">
          <DropdownMenuLabel className="text-lg">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs flex items-center"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-coin-purple"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No notifications yet
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsPanel;
