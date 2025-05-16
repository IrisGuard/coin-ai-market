
import { useState } from 'react';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { Bell, X, Check, CheckCheck, Trash2, ExternalLink, Clock, ChevronRight } from 'lucide-react';
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
import { formatDistanceToNow } from 'date-fns';

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
      case 'outbid':
        return 'bg-red-500';
      case 'auction_end':
        return 'bg-coin-purple';
      case 'purchase':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bid':
        return <Badge variant="outline" className="bg-coin-orange/10 text-coin-orange border-coin-orange/30">New Bid</Badge>;
      case 'outbid':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">Outbid</Badge>;
      case 'auction_end':
        return <Badge variant="outline" className="bg-coin-purple/10 text-coin-purple border-coin-purple/30">Auction Ended</Badge>;
      case 'purchase':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Purchase</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/30">System</Badge>;
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
    
    // If there's a related action URL, navigate to it
    if (notification.action_url) {
      navigate(notification.action_url);
    } else if (notification.related_coin_id) {
      navigate(`/coins/${notification.related_coin_id}`);
    }
  };
  
  const formattedTime = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative p-3 rounded-lg mb-2 cursor-pointer transition-all duration-300 ${
        notification.is_read 
          ? 'bg-white border border-gray-100 hover:bg-gray-50' 
          : 'bg-blue-50 border border-blue-100 hover:bg-blue-100/70'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={`w-1 self-stretch rounded-full ${getTypeColor(notification.type)}`} />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            {getTypeIcon(notification.type)}
            <div className="flex space-x-1">
              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-blue-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(notification.id);
                  }}
                >
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <p className={`text-sm ${notification.is_read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedTime}
            </span>
            {(notification.action_url || notification.related_coin_id) && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
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
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge
                  className="px-1 min-w-[20px] h-5 bg-gradient-to-r from-coin-purple to-coin-orange text-white font-semibold"
                >
                  {unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[80vh] overflow-auto p-2 shadow-lg backdrop-blur-sm bg-white/80 border border-gray-100">
        <div className="sticky top-0 z-10 flex justify-between items-center py-2 px-1 bg-white/90 backdrop-blur-sm border-b border-gray-100 mb-2">
          <DropdownMenuLabel className="text-lg font-serif bg-gradient-to-r from-coin-purple to-coin-skyblue bg-clip-text text-transparent">
            Ειδοποιήσεις
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Επισήμανση όλων ως αναγνωσμένων</span>
            </Button>
          )}
        </div>
        <div className="py-1 px-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 relative">
                <div className="absolute inset-0 rounded-full border-2 border-t-coin-purple border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-coin-orange border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
                <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-coin-skyblue border-l-transparent animate-spin animation-delay-300"></div>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-gray-800 font-medium mb-1">Καμία ειδοποίηση ακόμη</h3>
              <p className="text-gray-500 text-sm">
                Θα σας ενημερώσουμε όταν υπάρχουν νέες προσφορές ή δραστηριότητες που σχετίζονται με τα νομίσματά σας.
              </p>
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
