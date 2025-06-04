
import { Wifi, WifiOff, Loader2, Clock } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const OfflineStatusIndicator = () => {
  const { isOnline, pendingItems, isSyncing, syncPendingItems } = useOfflineSync();

  if (isOnline && pendingItems.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Wifi className="w-4 h-4" />
        <span>Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 border-b">
      {!isOnline ? (
        <div className="flex items-center gap-2 text-orange-600">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline Mode</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Online</span>
        </div>
      )}

      {pendingItems.length > 0 && (
        <>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {pendingItems.length} pending
          </Badge>
          
          {isOnline && (
            <Button
              onClick={syncPendingItems}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="text-xs h-6"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Syncing...
                </>
              ) : (
                'Sync Now'
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default OfflineStatusIndicator;
