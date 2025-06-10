
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';

interface RealTimeControlsProps {
  isLive: boolean;
  onToggleLive: () => void;
  onRefresh: () => void;
}

const RealTimeControls = ({ isLive, onToggleLive, onRefresh }: RealTimeControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Real-Time Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Live system monitoring and metrics
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={isLive ? 'default' : 'secondary'} className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {isLive ? 'LIVE' : 'OFFLINE'}
        </Badge>
        <Button 
          variant={isLive ? 'destructive' : 'default'} 
          size="sm" 
          onClick={onToggleLive}
        >
          <Activity className="w-4 h-4 mr-2" />
          {isLive ? 'Stop Live' : 'Go Live'}
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default RealTimeControls;
