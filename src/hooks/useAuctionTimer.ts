
import { useState, useEffect } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  endingSoon: boolean; // less than 24 hours
  criticalTime: boolean; // less than 1 hour
}

export const useAuctionTimer = (endTime: string): TimeRemaining => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
    endingSoon: false,
    criticalTime: false
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const remaining = end - now;

      if (remaining <= 0) {
        setTimeRemaining({ 
          days: 0, 
          hours: 0, 
          minutes: 0, 
          seconds: 0, 
          expired: true,
          endingSoon: false,
          criticalTime: false
        });
        return;
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      // Calculate if ending soon (less than 24 hours) or critical time (less than 1 hour)
      const totalHours = remaining / (1000 * 60 * 60);
      const endingSoon = totalHours <= 24;
      const criticalTime = totalHours <= 1;

      setTimeRemaining({ 
        days, 
        hours, 
        minutes, 
        seconds, 
        expired: false,
        endingSoon,
        criticalTime
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeRemaining;
};
