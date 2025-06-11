
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAICommandsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for AI commands...');
    
    const channel = supabase
      .channel('ai-commands-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_commands'
        },
        (payload) => {
          console.log('🔄 Real-time AI command change:', payload);
          queryClient.invalidateQueries({ queryKey: ['ai-commands'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🛑 Cleaning up AI commands subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
