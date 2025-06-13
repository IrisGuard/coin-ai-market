
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAICommandsRealtime = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup any existing subscription first
    if (channelRef.current) {
      console.log('🛑 Cleaning up existing AI commands subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🔄 Setting up real-time subscription for AI commands...');
    
    // Create a unique channel name to avoid conflicts
    const channelName = `ai-commands-changes-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_commands'
      }, (payload) => {
        console.log('🔄 Real-time AI command change:', payload);
        queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ AI commands subscription established');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ AI commands subscription error');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🛑 Cleaning up AI commands subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);
};
