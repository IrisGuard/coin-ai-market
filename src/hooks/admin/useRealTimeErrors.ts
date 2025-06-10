
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeError {
  id: string;
  error_type: string;
  message: string;
  page_url?: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useRealTimeErrors = () => {
  const [recentErrors, setRecentErrors] = useState<RealtimeError[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to real-time error updates
    const channel = supabase
      .channel('error-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'error_logs'
        },
        (payload) => {
          const newError = payload.new as any;
          const realtimeError: RealtimeError = {
            id: newError.id,
            error_type: newError.error_type,
            message: newError.message,
            page_url: newError.page_url,
            created_at: newError.created_at,
            severity: determineSeverity(newError)
          };

          setRecentErrors(prev => [realtimeError, ...prev.slice(0, 19)]); // Keep last 20
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const determineSeverity = (error: any): 'low' | 'medium' | 'high' | 'critical' => {
    const message = error.message?.toLowerCase() || '';
    const type = error.error_type?.toLowerCase() || '';

    if (message.includes('database') || message.includes('auth') || type === 'critical') {
      return 'critical';
    }
    if (message.includes('network') || message.includes('api') || type === 'error') {
      return 'high';
    }
    if (type === 'warn' || message.includes('warning')) {
      return 'medium';
    }
    return 'low';
  };

  return { recentErrors, isConnected };
};
