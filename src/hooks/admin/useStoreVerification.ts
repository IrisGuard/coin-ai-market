
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useStoreVerifications = () => {
  return useQuery({
    queryKey: ['store-verifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_verifications')
        .select(`
          *,
          stores(name, user_id, email)
        `)
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateStoreVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (verificationData: {
      store_id: string;
      verification_type: string;
      submitted_documents: any;
      verification_notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('store_verifications')
        .insert(verificationData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-verifications'] });
      toast({
        title: "Verification Submitted",
        description: "Store verification has been submitted for review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to submit verification: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useProcessStoreVerification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      verificationId, 
      status, 
      notes 
    }: {
      verificationId: string;
      status: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('store_verifications')
        .update({ 
          verification_status: status,
          verification_notes: notes,
          verified_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', verificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-verifications'] });
      toast({
        title: "Verification Processed",
        description: "Store verification has been processed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to process verification: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
