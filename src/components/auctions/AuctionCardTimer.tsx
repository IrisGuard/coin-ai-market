
import React from 'react';
import { Clock } from 'lucide-react';
import { TimeRemaining } from '@/types/auction';

interface AuctionCardTimerProps {
  timeRemaining: TimeRemaining;
  isEndingSoon: boolean;
}

const AuctionCardTimer = ({ timeRemaining, isEndingSoon }: AuctionCardTimerProps) => {
  if (timeRemaining.expired) {
    return (
      <div className="p-3 bg-gray-100 rounded-lg text-center">
        <span className="text-gray-600 font-medium">Auction Ended</span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg ${isEndingSoon ? 'bg-red-50' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Time Remaining:</span>
        <Clock className={`w-4 h-4 ${isEndingSoon ? 'text-red-600' : 'text-gray-600'}`} />
      </div>
      <div className={`text-lg font-bold ${isEndingSoon ? 'text-red-600' : 'text-gray-900'}`}>
        {timeRemaining.days > 0 && `${timeRemaining.days}d `}
        {String(timeRemaining.hours).padStart(2, '0')}:
        {String(timeRemaining.minutes).padStart(2, '0')}:
        {String(timeRemaining.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default AuctionCardTimer;
