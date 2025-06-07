
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock, CheckCircle } from 'lucide-react';

interface OfflineStatusIndicatorProps {
  isOnline?: boolean;
  pendingCount?: number;
  className?: string;
}

const OfflineStatusIndicator = ({ 
  isOnline = navigator.onLine, 
  pendingCount = 0,
  className = ""
}: OfflineStatusIndicatorProps) => {
  if (isOnline && pendingCount === 0) {
    return null; // Don't show anything when everything is normal
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-b bg-gradient-to-r ${className}`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-3">
          {!isOnline ? (
            <>
              <Badge variant="destructive" className="flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                Offline Mode
              </Badge>
              <span className="text-sm text-gray-600">
                Data will sync when connection returns
              </span>
            </>
          ) : pendingCount > 0 ? (
            <>
              <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3" />
                Syncing {pendingCount} items
              </Badge>
              <span className="text-sm text-gray-600">
                Upload in progress...
              </span>
            </>
          ) : (
            <>
              <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3" />
                All synced
              </Badge>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OfflineStatusIndicator;
