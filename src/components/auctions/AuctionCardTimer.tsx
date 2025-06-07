
import React from 'react';
import { Clock } from 'lucide-react';
import { TimeRemaining } from '@/types/auction';

interface AuctionCardTimerProps {
  timeRemaining: TimeRemaining;
  isEndingSoon: boolean;
}

const AuctionCardTimer = ({ timeRemaining, isEndingSoon }: AuctionCardTimerProps) => {
  // Handle error cases gracefully
  if (!timeRemaining || timeRemaining.expired) {
    return (
      <div className="p-3 bg-gray-100 rounded-lg text-center">
        <span className="text-gray-600 font-medium">Auction Ended</span>
      </div>
    );
  }

  // Ensure numbers are valid
  const days = Math.max(0, timeRemaining.days || 0);
  const hours = Math.max(0, Math.min(23, timeRemaining.hours || 0));
  const minutes = Math.max(0, Math.min(59, timeRemaining.minutes || 0));
  const seconds = Math.max(0, Math.min(59, timeRemaining.seconds || 0));

  return (
    <div className={`p-3 rounded-lg ${isEndingSoon ? 'bg-red-50' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Time Remaining:</span>
        <Clock className={`w-4 h-4 ${isEndingSoon ? 'text-red-600' : 'text-gray-600'}`} />
      </div>
      <div className={`text-lg font-bold ${isEndingSoon ? 'text-red-600' : 'text-gray-900'}`}>
        {days > 0 && `${days}d `}
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default AuctionCardTimer;
