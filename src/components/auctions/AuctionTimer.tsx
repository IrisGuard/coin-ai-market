
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { useAuctionTimer } from '@/hooks/useAuctionTimer';
import { AuctionTimer as TimerType } from '@/types/auctionTypes';

interface AuctionTimerProps {
  endTime: string;
  showIcon?: boolean;
  variant?: 'default' | 'large' | 'compact';
  onTimeExpired?: () => void;
}

const AuctionTimer: React.FC<AuctionTimerProps> = ({ 
  endTime, 
  showIcon = true, 
  variant = 'default',
  onTimeExpired 
}) => {
  const timer = useAuctionTimer(endTime);

  React.useEffect(() => {
    if (timer.expired && onTimeExpired) {
      onTimeExpired();
    }
  }, [timer.expired, onTimeExpired]);

  if (timer.expired) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Auction Ended
      </Badge>
    );
  }

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const getTimerColor = () => {
    if (timer.criticalTime) return 'text-red-600';
    if (timer.endingSoon) return 'text-orange-600';
    return 'text-gray-900';
  };

  const getTimerBadgeVariant = () => {
    if (timer.criticalTime) return 'destructive';
    if (timer.endingSoon) return 'secondary';
    return 'outline';
  };

  if (variant === 'compact') {
    return (
      <Badge variant={getTimerBadgeVariant()} className="flex items-center gap-1">
        {showIcon && <Clock className="h-3 w-3" />}
        {timer.days > 0 ? `${timer.days}d ${timer.hours}h` : 
         timer.hours > 0 ? `${timer.hours}h ${timer.minutes}m` : 
         `${timer.minutes}m ${formatTime(timer.seconds)}s`}
      </Badge>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`text-center ${getTimerColor()}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          {showIcon && <Clock className="h-5 w-5" />}
          {timer.criticalTime && <AlertTriangle className="h-5 w-5 text-red-500" />}
          <span className="text-lg font-semibold">
            {timer.criticalTime ? 'Ending Soon!' : 
             timer.endingSoon ? 'Ending Soon' : 'Time Remaining'}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">{formatTime(timer.days)}</div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">{formatTime(timer.hours)}</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">{formatTime(timer.minutes)}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">{formatTime(timer.seconds)}</div>
            <div className="text-sm text-muted-foreground">Seconds</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${getTimerColor()}`}>
      {showIcon && <Clock className="h-4 w-4" />}
      {timer.criticalTime && <AlertTriangle className="h-4 w-4 text-red-500" />}
      <span className="font-medium">
        {timer.days > 0 && `${timer.days}d `}
        {timer.hours > 0 && `${timer.hours}h `}
        {timer.minutes}m {formatTime(timer.seconds)}s
      </span>
      {timer.endingSoon && (
        <Badge variant="secondary" className="ml-2">
          Ending Soon
        </Badge>
      )}
    </div>
  );
};

export default AuctionTimer;
