
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSecurityIncidents = () => {
  return useQuery({
    queryKey: ['security-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateSecurityIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (incidentData: {
      incident_type: string;
      severity_level: string;
      title: string;
      description?: string;
      incident_data?: any;
    }) => {
      const { data, error } = await supabase.rpc('create_security_incident', incidentData);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-incidents'] });
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
      toast({
        title: "Security Incident Created",
        description: "Security incident has been logged and alerts have been generated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create security incident: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useResolveSecurityIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (incidentId: string) => {
      const { data, error } = await supabase
        .from('security_incidents')
        .update({ 
          status: 'resolved', 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', incidentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-incidents'] });
      toast({
        title: "Incident Resolved",
        description: "Security incident has been marked as resolved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to resolve incident: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
