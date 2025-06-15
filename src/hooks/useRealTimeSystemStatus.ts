
import { useState, useEffect } from 'react';

interface SystemStatus {
  activeUsers: number;
  totalCoins: number;
  scrapingJobs: number;
  aiCommands: number;
  liveAuctions: number;
  automationRules: number;
  lastUpdated: Date;
}

export const useRealTimeSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>({
    activeUsers: 247,
    totalCoins: 1834,
    scrapingJobs: 12,
    aiCommands: 45,
    liveAuctions: 23,
    automationRules: 8,
    lastUpdated: new Date()
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 50) + 200,
        liveAuctions: Math.floor(Math.random() * 10) + 20,
        lastUpdated: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return status;
};
